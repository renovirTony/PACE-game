import Peer, { DataConnection } from 'peerjs';
import type { RoomPeer } from '../types/game';
import { MAX_ONLINE_PLAYERS, RemoteAction, SyncedGameState, playerIdForSeat } from './onlineProtocol';

/**
 * PeerJS（WebRTC）傳輸層：只負責連線與收送訊息，不懂遊戲規則。
 * 訊息內容的意義見 onlineProtocol.ts。
 *
 * 穩定性設計：
 * - 心跳偵測斷線（對方關分頁、斷網時 PeerJS 常常不會觸發 close）。
 * - 客端斷線後自動重連，並帶同一張座位憑證回到原本的座位。
 * - 分頁從背景回到前景時立刻檢查連線，不必等心跳逾時。
 */

const PEER_ID_PREFIX = 'pace-v2-';
const ROOM_CODE_LENGTH = 4;
/** 去掉 0/O、1/I/L 等易混淆字元，口頭報房號時不會聽錯 */
const ROOM_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
/** 房號被別人占用（PeerJS 公用伺服器上 ID 撞名）時重抽的次數 */
const MAX_ROOM_CODE_ATTEMPTS = 3;
/** 單次連線嘗試（含握手）的等待上限 */
const CONNECT_TIMEOUT_MS = 12000;

const HEARTBEAT_INTERVAL_MS = 3000;
/** 超過這段時間沒收到對方任何訊息就視為斷線（約 4 次心跳，容許短暫的網路抖動） */
const PEER_TIMEOUT_MS = 12000;
/** 分頁剛回到前景時，給對方多久證明自己還在（期間應至少收到一次心跳） */
const RESUME_PROOF_OF_LIFE_MS = 5000;

/** 客端自動重連：最多嘗試次數與每次間隔（第一次立即重試，之後逐步拉長） */
const MAX_RECONNECT_ATTEMPTS = 6;
const RECONNECT_BASE_DELAY_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 8000;

type WireMessage =
  | { kind: 'PING' }
  | { kind: 'HELLO'; name: string; seatToken: string }
  | { kind: 'WELCOME'; playerId: string }
  | { kind: 'REJECTED'; reason: string }
  | { kind: 'ACTION'; action: RemoteAction }
  | { kind: 'SYNC'; state: SyncedGameState };

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MultiplayerManagerCallbacks {
  /** 房主：有客端完成握手（新加入或重新連線） */
  onGuestJoined: (guest: RoomPeer) => void;
  /** 房主：某客端斷線 */
  onGuestLeft: (playerId: string) => void;
  /** 房主：收到客端動作（玩家身分取自握手時綁定的連線，不信任訊息內容自報） */
  onActionReceived: (playerId: string, action: RemoteAction) => void;
  /** 客端：收到房主廣播的快照 */
  onGameStateReceived: (state: SyncedGameState) => void;
  /** 客端：自動重連全部失敗，放棄這個房間 */
  onHostLost: () => void;
  onConnectionStatus: (status: ConnectionStatus, message?: string) => void;
}

/** 連線失敗的原因；fatal 代表重試也沒用（例如房間已滿），不再自動重連 */
class ConnectError extends Error {
  constructor(message: string, readonly fatal = false) {
    super(message);
  }
}

interface GuestLink {
  conn: DataConnection;
  lastHeardAt: number;
}

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_ALPHABET[Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)];
  }
  return code;
}

function hostPeerIdFor(roomCode: string): string {
  return `${PEER_ID_PREFIX}${roomCode}`;
}

function reconnectDelay(attempt: number): number {
  if (attempt <= 1) return 0;
  return Math.min(RECONNECT_BASE_DELAY_MS * 2 ** (attempt - 2), RECONNECT_MAX_DELAY_MS);
}

export class P2PMultiplayerManager {
  private peer: Peer | null = null;
  private isHost = false;
  private roomCode = '';
  private callbacks: MultiplayerManagerCallbacks;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  /** 每次 disconnect 都換一代；舊一代的非同步流程（重連迴圈、逾時）發現代數不同就停止 */
  private generation = 0;

  // 房主端：以玩家 id 為鍵，重新連線時直接換掉舊連線
  private guests: Map<string, GuestLink> = new Map();

  // 客端端
  private hostLink: GuestLink | null = null;
  private playerName = '';
  private seatToken = '';
  private isReconnecting = false;
  /** 重連等待中被「回到前景／網路恢復」叫醒，立刻重試 */
  private wakeReconnectWait: (() => void) | null = null;

  constructor(callbacks: MultiplayerManagerCallbacks) {
    this.callbacks = callbacks;
  }

  // ===== 房主 =====

  /** 建立房間（房主），回傳房號 */
  public async createRoom(): Promise<string> {
    this.disconnect();
    this.isHost = true;
    this.callbacks.onConnectionStatus('connecting', '正在建立 P2P 房間...');

    for (let attempt = 1; attempt <= MAX_ROOM_CODE_ATTEMPTS; attempt++) {
      const code = generateRoomCode();
      try {
        await this.openHostPeer(code);
        this.roomCode = code;
        this.startHeartbeat();
        this.listenToPageLifecycle();
        this.callbacks.onConnectionStatus('connected', `房間已建立！代碼：${code}，把代碼或邀請連結傳給隊友。`);
        return code;
      } catch (err) {
        const isTaken = (err as { type?: string })?.type === 'unavailable-id';
        if (!isTaken || attempt === MAX_ROOM_CODE_ATTEMPTS) {
          this.callbacks.onConnectionStatus('error', `建立房間失敗：${describePeerError(err)}`);
          this.disconnect();
          throw err;
        }
      }
    }
    throw new Error('unreachable');
  }

  private openHostPeer(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const peer = new Peer(hostPeerIdFor(code), { debug: 1 });
      this.peer = peer;
      let opened = false;

      peer.on('open', () => {
        opened = true;
        resolve();
      });
      peer.on('connection', (conn) => this.setupHostConnection(conn));
      peer.on('disconnected', () => {
        // 與信令伺服器斷線不影響已建立的 P2P 連線，但要重連才收得到新的加入者與重新連線的客端
        if (!peer.destroyed) peer.reconnect();
      });
      peer.on('error', (err) => {
        if (!opened) {
          peer.destroy();
          reject(err);
        }
        // 開房後的錯誤（例如某位客端連不上）不影響其他人，交給心跳與重連處理
      });
    });
  }

  private setupHostConnection(conn: DataConnection) {
    let playerId: string | null = null;

    conn.on('data', (data) => {
      const msg = data as WireMessage;
      if (msg.kind === 'HELLO') {
        playerId = playerIdForSeat(msg.seatToken);
        this.acceptGuest(conn, playerId, msg.name);
        return;
      }
      const link = playerId ? this.guests.get(playerId) : undefined;
      // 已被新連線取代的舊連線，訊息一律忽略
      if (!playerId || link?.conn !== conn) return;
      link.lastHeardAt = Date.now();
      if (msg.kind === 'ACTION') this.callbacks.onActionReceived(playerId, msg.action);
    });

    conn.on('close', () => {
      if (playerId && this.guests.get(playerId)?.conn === conn) this.dropGuest(playerId);
    });
  }

  private acceptGuest(conn: DataConnection, playerId: string, name: string) {
    const previous = this.guests.get(playerId);
    // 房主自己佔一個座位；重新連線的人原本就有座位，不受人數上限限制
    if (!previous && this.guests.size + 1 >= MAX_ONLINE_PLAYERS) {
      this.send(conn, { kind: 'REJECTED', reason: `房間已滿（最多 ${MAX_ONLINE_PLAYERS} 人）。` });
      setTimeout(() => conn.close(), 500);
      return;
    }

    // 先登記新連線再關舊的，舊連線的 close 事件就不會被當成「離開」
    this.guests.set(playerId, { conn, lastHeardAt: Date.now() });
    previous?.conn.close();

    this.send(conn, { kind: 'WELCOME', playerId });
    this.callbacks.onGuestJoined({
      id: playerId,
      peerId: conn.peer,
      name: name?.trim() || '連線指揮官',
      avatar: '',
      color: '',
      isHost: false,
    });
  }

  private dropGuest(playerId: string) {
    const link = this.guests.get(playerId);
    if (!link) return;
    this.guests.delete(playerId);
    link.conn.close();
    this.callbacks.onGuestLeft(playerId);
  }

  /** 房主：向所有客端廣播最新快照 */
  public broadcastGameState(state: SyncedGameState) {
    if (!this.isHost) return;
    this.guests.forEach(({ conn }) => this.send(conn, { kind: 'SYNC', state }));
  }

  // ===== 客端 =====

  /**
   * 加入房間（客端），成功時回傳房主分配的玩家 id。
   * 第一次加入失敗會直接回報（多半是房號打錯）；加入成功之後的斷線才會自動重連。
   */
  public async joinRoom(roomCode: string, playerName: string, seatToken: string): Promise<string> {
    this.disconnect();
    this.isHost = false;
    this.roomCode = roomCode.toUpperCase();
    this.playerName = playerName;
    this.seatToken = seatToken;
    this.callbacks.onConnectionStatus('connecting', `正在連接房號 ${this.roomCode}...`);

    try {
      const playerId = await this.connectToHost();
      this.startHeartbeat();
      this.listenToPageLifecycle();
      this.callbacks.onConnectionStatus('connected', `已加入房間 ${this.roomCode}，等待房主開始遊戲...`);
      return playerId;
    } catch (err) {
      this.callbacks.onConnectionStatus('error', err instanceof ConnectError ? err.message : `加入房間失敗：${describePeerError(err)}`);
      this.disconnect();
      throw err;
    }
  }

  /** 建立一條通往房主的新連線並完成握手；每次都用新的 Peer，避免沿用已壞掉的信令連線 */
  private connectToHost(): Promise<string> {
    const generation = this.generation;
    this.hostLink = null;
    this.peer?.destroy();

    return new Promise((resolve, reject) => {
      let settled = false;
      const peer = new Peer({ debug: 1 });
      this.peer = peer;

      const fail = (err: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        peer.destroy();
        reject(err);
      };
      const timeout = setTimeout(
        () => fail(new ConnectError('連線逾時：找不到房間，請確認房號，或請房主重新建立房間。')),
        CONNECT_TIMEOUT_MS
      );

      peer.on('open', () => {
        // 必須用 binary 序列化：完整遊戲快照超過 JSON 通道的單則訊息上限，binary 會自動分塊傳送
        const conn = peer.connect(hostPeerIdFor(this.roomCode), { reliable: true, serialization: 'binary' });

        conn.on('open', () => {
          this.send(conn, { kind: 'HELLO', name: this.playerName, seatToken: this.seatToken });
        });

        conn.on('data', (data) => {
          if (generation !== this.generation) return;
          const msg = data as WireMessage;
          if (this.hostLink?.conn === conn) this.hostLink.lastHeardAt = Date.now();

          if (msg.kind === 'WELCOME') {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            this.hostLink = { conn, lastHeardAt: Date.now() };
            resolve(msg.playerId);
          } else if (msg.kind === 'REJECTED') {
            fail(new ConnectError(`無法加入：${msg.reason}`, true));
          } else if (msg.kind === 'SYNC') {
            this.callbacks.onGameStateReceived(msg.state);
          }
        });

        conn.on('close', () => {
          if (!settled) {
            fail(new ConnectError('房主關閉了連線。'));
          } else if (this.hostLink?.conn === conn) {
            this.handleHostDropped();
          }
        });
      });

      peer.on('error', (err) => {
        if (!settled) fail(err);
        // 握手後的錯誤交給 close 事件或心跳處理
      });
    });
  }

  private handleHostDropped() {
    if (this.isHost || this.isReconnecting || !this.roomCode) return;
    // 先解除登記再關閉，close 事件才不會再次觸發這裡
    const staleLink = this.hostLink;
    this.hostLink = null;
    staleLink?.conn.close();
    void this.reconnectLoop();
  }

  private async reconnectLoop() {
    const generation = this.generation;
    this.isReconnecting = true;

    for (let attempt = 1; attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
      this.callbacks.onConnectionStatus(
        'connecting',
        `與房主的連線中斷，正在自動重新連線（第 ${attempt}/${MAX_RECONNECT_ATTEMPTS} 次）...`
      );
      await this.waitBeforeReconnect(reconnectDelay(attempt));
      if (generation !== this.generation) return;

      try {
        await this.connectToHost();
        if (generation !== this.generation) return;
        this.isReconnecting = false;
        this.callbacks.onConnectionStatus('connected', `已重新連上房間 ${this.roomCode}！`);
        return;
      } catch (err) {
        if (generation !== this.generation) return;
        if (err instanceof ConnectError && err.fatal) break;
      }
    }

    this.isReconnecting = false;
    this.callbacks.onConnectionStatus('disconnected', '無法重新連上房主，對局已中斷。請確認房主的裝置仍開著遊戲畫面。');
    this.callbacks.onHostLost();
  }

  private waitBeforeReconnect(ms: number): Promise<void> {
    if (ms <= 0) return Promise.resolve();
    return new Promise((resolve) => {
      const timer = setTimeout(done, ms);
      function done() {
        clearTimeout(timer);
        resolve();
      }
      this.wakeReconnectWait = () => {
        this.wakeReconnectWait = null;
        done();
      };
    });
  }

  /** 客端：把動作送給房主 */
  public sendActionToHost(action: RemoteAction) {
    if (!this.isHost && this.hostLink) this.send(this.hostLink.conn, { kind: 'ACTION', action });
  }

  // ===== 雙方共用：心跳與分頁生命週期 =====

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      if (this.isHost) {
        this.guests.forEach((link, playerId) => {
          if (now - link.lastHeardAt > PEER_TIMEOUT_MS) this.dropGuest(playerId);
          else this.send(link.conn, { kind: 'PING' });
        });
      } else if (this.hostLink) {
        if (now - this.hostLink.lastHeardAt > PEER_TIMEOUT_MS) this.handleHostDropped();
        else this.send(this.hostLink.conn, { kind: 'PING' });
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  /**
   * 手機切到背景或鎖屏時 JS 會暫停，回來時計時資料已經不可信：
   * 先把每條連線改成「只剩幾秒證明自己還活著」，並立刻送出心跳；
   * 若客端正在等待重連，則跳過等待立刻重試。
   */
  private handleResume = () => {
    if (document.visibilityState === 'hidden') return;
    const deadline = Date.now() - PEER_TIMEOUT_MS + RESUME_PROOF_OF_LIFE_MS;
    const links = this.isHost ? [...this.guests.values()] : this.hostLink ? [this.hostLink] : [];
    links.forEach((link) => {
      link.lastHeardAt = Math.max(Math.min(link.lastHeardAt, Date.now()), deadline);
      this.send(link.conn, { kind: 'PING' });
    });
    if (this.isHost && this.peer?.disconnected && !this.peer.destroyed) this.peer.reconnect();
    this.wakeReconnectWait?.();
  };

  private listenToPageLifecycle() {
    document.addEventListener('visibilitychange', this.handleResume);
    window.addEventListener('online', this.handleResume);
  }

  private stopListeningToPageLifecycle() {
    document.removeEventListener('visibilitychange', this.handleResume);
    window.removeEventListener('online', this.handleResume);
  }

  private send(conn: DataConnection, msg: WireMessage) {
    if (conn.open) conn.send(msg);
  }

  public disconnect() {
    this.generation++;
    this.stopHeartbeat();
    this.stopListeningToPageLifecycle();
    this.wakeReconnectWait?.();
    this.isReconnecting = false;

    // 先清空再關閉：主動離開不應觸發「對方斷線」的處理
    const openConnections = [...this.guests.values(), ...(this.hostLink ? [this.hostLink] : [])];
    this.guests.clear();
    this.hostLink = null;
    openConnections.forEach(({ conn }) => conn.close());

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isHost = false;
    this.roomCode = '';
  }
}

function describePeerError(err: unknown): string {
  const type = (err as { type?: string })?.type;
  switch (type) {
    case 'peer-unavailable':
      return '找不到這個房號，請確認代碼是否正確、房主是否還在大廳。';
    case 'unavailable-id':
      return '房號已被占用，請再試一次。';
    case 'network':
    case 'server-error':
    case 'socket-error':
    case 'socket-closed':
      return '無法連上配對伺服器，請檢查網路。';
    case 'browser-incompatible':
      return '這個瀏覽器不支援 WebRTC。';
    default:
      return type || String(err);
  }
}
