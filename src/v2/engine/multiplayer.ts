import Peer, { DataConnection } from 'peerjs';
import { CommsCard, CrisisMission, PACESlot, Player, RoomPeer, TacticCard } from '../types/game';

export type MultiplayerActionType =
  | 'SYNC_GAME_STATE'
  | 'PLAYER_JOINED'
  | 'BUY_EQUIPMENT'
  | 'BUY_TACTIC'
  | 'PLAY_TACTIC'
  | 'RECHARGE'
  | 'TRANSMIT'
  | 'END_TURN';

export interface MultiplayerMessage {
  type: MultiplayerActionType;
  senderPeerId: string;
  senderPlayerId?: string;
  payload?: any;
}

export interface MultiplayerManagerCallbacks {
  onPeerJoined: (peer: RoomPeer) => void;
  onPeerLeft: (peerId: string) => void;
  onGameStateReceived: (syncedState: any) => void;
  onActionReceived: (action: MultiplayerMessage) => void;
  onConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected' | 'error', message?: string) => void;
}

export class P2PMultiplayerManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private isHost: boolean = false;
  private roomCode: string = '';
  private callbacks: MultiplayerManagerCallbacks;
  private myPeerId: string = '';

  constructor(callbacks: MultiplayerManagerCallbacks) {
    this.callbacks = callbacks;
  }

  public getPeerId(): string {
    return this.myPeerId;
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public getIsHost(): boolean {
    return this.isHost;
  }

  /**
   * 建立連線房間 (Host)
   */
  public createRoom(hostPlayer: { name: string; avatar: string; color: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      this.disconnect();
      this.isHost = true;

      // 生成 4 位隨機房號 (大寫英數)
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      this.roomCode = randomCode;
      const peerId = `pace-v2-${this.roomCode}`;

      try {
        this.callbacks.onConnectionStatus('connecting', '正在建立 PeerJS P2P 房間...');
        this.peer = new Peer(peerId, {
          debug: 1,
        });

        this.peer.on('open', (id) => {
          this.myPeerId = id;
          this.callbacks.onConnectionStatus('connected', `房間已建立！代碼：${this.roomCode}`);
          resolve(this.roomCode);
        });

        this.peer.on('connection', (conn) => {
          this.setupHostConnection(conn);
        });

        this.peer.on('error', (err) => {
          this.callbacks.onConnectionStatus('error', `P2P 連線錯誤: ${err.type}`);
          reject(err);
        });
      } catch (err) {
        this.callbacks.onConnectionStatus('error', '無法啟動 WebRTC Peer');
        reject(err);
      }
    });
  }

  /**
   * 加入現有房間 (Client)
   */
  public joinRoom(roomCode: string, playerInfo: { name: string; avatar: string; color: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.disconnect();
      this.isHost = false;
      this.roomCode = roomCode.toUpperCase();
      const hostPeerId = `pace-v2-${this.roomCode}`;

      try {
        this.callbacks.onConnectionStatus('connecting', `正在連接房號 ${this.roomCode}...`);
        this.peer = new Peer();

        this.peer.on('open', (id) => {
          this.myPeerId = id;
          const conn = this.peer!.connect(hostPeerId, {
            reliable: true,
          });

          conn.on('open', () => {
            this.connections.set(hostPeerId, conn);
            this.callbacks.onConnectionStatus('connected', `已成功加入房間 ${this.roomCode}！`);

            // 發送加入通知
            conn.send({
              type: 'PLAYER_JOINED',
              senderPeerId: this.myPeerId,
              payload: playerInfo,
            } as MultiplayerMessage);

            resolve();
          });

          conn.on('data', (data) => {
            this.handleClientData(data as MultiplayerMessage);
          });

          conn.on('close', () => {
            this.callbacks.onConnectionStatus('disconnected', '與房主的連線已中斷。');
          });

          conn.on('error', (err) => {
            this.callbacks.onConnectionStatus('error', `連線錯誤: ${err}`);
            reject(err);
          });
        });

        this.peer.on('error', (err) => {
          this.callbacks.onConnectionStatus('error', `加入房間失敗: ${err.type}`);
          reject(err);
        });
      } catch (err) {
        this.callbacks.onConnectionStatus('error', '無法連線');
        reject(err);
      }
    });
  }

  /**
   * 房主處理客端連線與資料接收
   */
  private setupHostConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
    });

    conn.on('data', (data) => {
      const msg = data as MultiplayerMessage;
      if (msg.type === 'PLAYER_JOINED') {
        const newPeer: RoomPeer = {
          id: `player_${conn.peer.substring(0, 6)}`,
          peerId: conn.peer,
          name: msg.payload?.name || '連線指揮官',
          avatar: msg.payload?.avatar || '📡',
          color: msg.payload?.color || '#06b6d4',
          isHost: false,
        };
        this.callbacks.onPeerJoined(newPeer);
      } else {
        // 將客端的行動傳給房主狀態機
        this.callbacks.onActionReceived(msg);
      }
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.callbacks.onPeerLeft(conn.peer);
    });
  }

  /**
   * 客端接收房主廣播之遊戲狀態
   */
  private handleClientData(msg: MultiplayerMessage) {
    if (msg.type === 'SYNC_GAME_STATE') {
      this.callbacks.onGameStateReceived(msg.payload);
    }
  }

  /**
   * 房主向所有客端廣播最新遊戲狀態
   */
  public broadcastGameState(syncedState: any) {
    if (!this.isHost) return;
    const msg: MultiplayerMessage = {
      type: 'SYNC_GAME_STATE',
      senderPeerId: this.myPeerId,
      payload: syncedState,
    };
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(msg);
      }
    });
  }

  /**
   * 客端向房主發送出牌 / 任務行動
   */
  public sendActionToHost(type: MultiplayerActionType, payload?: any, playerId?: string) {
    const msg: MultiplayerMessage = {
      type,
      senderPeerId: this.myPeerId,
      senderPlayerId: playerId,
      payload,
    };

    if (this.isHost) {
      // 房主自己直接執行
      this.callbacks.onActionReceived(msg);
    } else {
      // 客端發送給房主
      const hostPeerId = `pace-v2-${this.roomCode}`;
      const conn = this.connections.get(hostPeerId);
      if (conn && conn.open) {
        conn.send(msg);
      }
    }
  }

  /**
   * 斷開連線
   */
  public disconnect() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isHost = false;
    this.roomCode = '';
    this.myPeerId = '';
  }
}
