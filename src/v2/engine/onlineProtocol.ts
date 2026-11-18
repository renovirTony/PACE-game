import type {
  CommsCard,
  CrisisMission,
  DisasterEvent,
  GameLog,
  GamePhase,
  PACESlot,
  Player,
  RoomPeer,
  TacticCard,
  TransmissionResult,
  WorldviewType,
} from '../types/game';

/**
 * 線上多人的資料協定（與 PeerJS 傳輸層無關）。
 *
 * 架構：房主權威（host-authoritative）。
 * - 遊戲規則只在房主端執行；客端按下按鈕時只送出「動作」給房主。
 * - 房主每次狀態變動後廣播完整快照，客端直接套用快照。
 * 這樣不必處理雙方各自洗牌、各自擲骰造成的分歧。
 */

/** 線上房間最多人數（含房主）；超過的連線會被拒絕 */
export const MAX_ONLINE_PLAYERS = 4;

export const HOST_PLAYER_ID = 'host';

/** 依座位順序分配頭像與顏色（房主坐 0 號位），客端自報的外觀不採用，避免大家撞色 */
export const ONLINE_SEAT_STYLES: { avatar: string; color: string }[] = [
  { avatar: '📡', color: '#06b6d4' },
  { avatar: '🛡️', color: '#f97316' },
  { avatar: '📻', color: '#a855f7' },
  { avatar: '⚡', color: '#10b981' },
];

/**
 * 客端的玩家 id 由「座位憑證」決定，而不是每次連線都會變的 PeerJS id，
 * 斷線後帶著同一張憑證重新連線，就能坐回原本的座位、接手原本的防線與分數。
 */
export function playerIdForSeat(seatToken: string): string {
  return `guest_${seatToken}`;
}

export function createHostMember(name: string): RoomPeer {
  return { id: HOST_PLAYER_ID, peerId: '', name, isHost: true, ...ONLINE_SEAT_STYLES[0] };
}

/** 新加入者拿第一個沒人用的座位外觀（0 號位保留給房主）；有人離開後座位可被重複利用 */
export function pickFreeSeatStyle(members: RoomPeer[]): { avatar: string; color: string } {
  const guestSeats = ONLINE_SEAT_STYLES.slice(1);
  return guestSeats.find(seat => !members.some(m => m.color === seat.color)) ?? guestSeats[0];
}

/** 一次通訊檢定的紀錄；id 讓客端分辨「新結果」與「重複收到的同一筆快照」 */
export interface TransmissionRecord {
  id: string;
  result: TransmissionResult;
  mission: CrisisMission;
  playerId: string;
  playerName: string;
  isAI: boolean;
}

/** 客端送給房主的動作：只帶 id，由房主用自己的狀態查回卡片，避免客端送來過期或偽造的卡片物件 */
export type RemoteAction =
  | { type: 'BUY_EQUIPMENT'; cardId: string; slot: PACESlot }
  | { type: 'SWAP_SLOTS'; slotA: PACESlot; slotB: PACESlot }
  | { type: 'STORE_CARD'; slot: PACESlot }
  | { type: 'EQUIP_FROM_INVENTORY'; cardId: string; slot: PACESlot }
  | { type: 'BUY_TACTIC'; tacticId: string }
  | { type: 'PLAY_TACTIC'; tacticId: string }
  | { type: 'RECHARGE' }
  | { type: 'REQUISITION' }
  | { type: 'RECYCLE'; cardId: string }
  | { type: 'REFRESH_MISSIONS' }
  | { type: 'TRANSMIT'; missionId: string }
  | { type: 'END_TURN' };

/** 房主廣播給客端的完整遊戲快照（牌庫不同步：只有房主需要抽牌） */
export interface SyncedGameState {
  phase: GamePhase;
  round: number;
  players: Player[];
  activePlayerIndex: number;
  market: CommsCard[];
  tacticMarket: TacticCard[];
  activeMissions: CrisisMission[];
  activeEvent: DisasterEvent | null;
  logs: GameLog[];
  winner: Player | null;
  lastTransmission: TransmissionRecord | null;
  worldview: WorldviewType;
  /** 房間成員（含房主），讓客端大廳也看得到所有人 */
  members: RoomPeer[];
}

/** 遊戲引擎對外的操作介面；本機玩家直接呼叫，線上客端則換成「送給房主」的版本 */
export interface GameActions {
  buyEquipment: (card: CommsCard, targetSlot: PACESlot) => boolean;
  swapSlots: (slotA: PACESlot, slotB: PACESlot) => boolean;
  storeCard: (slot: PACESlot) => void;
  equipFromInventory: (card: CommsCard, targetSlot: PACESlot) => boolean;
  buyTactic: (card: TacticCard) => boolean;
  playTactic: (card: TacticCard) => boolean;
  rechargeEnergy: () => boolean;
  requestEmergencyRequisition: () => boolean;
  recycleInventoryCard: (cardId: string) => boolean;
  refreshMissions: () => boolean;
  transmitMission: (mission: CrisisMission) => TransmissionResult;
  endTurn: () => void;
}

/**
 * 客端版的操作：送出動作後立即回傳 true（真正結果以房主廣播的快照為準）。
 * 通訊檢定先用本機規則預估結果，讓呼叫端拿得到回傳值；正式報告會隨快照送達。
 */
export function createClientActions(
  send: (action: RemoteAction) => void,
  previewTransmission: (mission: CrisisMission) => TransmissionResult
): GameActions {
  return {
    buyEquipment: (card, slot) => { send({ type: 'BUY_EQUIPMENT', cardId: card.id, slot }); return true; },
    swapSlots: (slotA, slotB) => { send({ type: 'SWAP_SLOTS', slotA, slotB }); return true; },
    storeCard: (slot) => { send({ type: 'STORE_CARD', slot }); },
    equipFromInventory: (card, slot) => { send({ type: 'EQUIP_FROM_INVENTORY', cardId: card.id, slot }); return true; },
    buyTactic: (card) => { send({ type: 'BUY_TACTIC', tacticId: card.id }); return true; },
    playTactic: (card) => { send({ type: 'PLAY_TACTIC', tacticId: card.id }); return true; },
    rechargeEnergy: () => { send({ type: 'RECHARGE' }); return true; },
    requestEmergencyRequisition: () => { send({ type: 'REQUISITION' }); return true; },
    recycleInventoryCard: (cardId) => { send({ type: 'RECYCLE', cardId }); return true; },
    refreshMissions: () => { send({ type: 'REFRESH_MISSIONS' }); return true; },
    transmitMission: (mission) => {
      send({ type: 'TRANSMIT', missionId: mission.id });
      return previewTransmission(mission);
    },
    endTurn: () => { send({ type: 'END_TURN' }); },
  };
}

/** 房主執行客端動作時需要查詢的當下狀態 */
export interface RemoteActionContext {
  activePlayer: Player;
  market: CommsCard[];
  tacticMarket: TacticCard[];
  activeMissions: CrisisMission[];
}

/**
 * 房主端：把客端動作轉成引擎呼叫。
 * 卡片一律從房主自己的狀態查回；查不到（例如已被買走）就忽略這個動作。
 */
export function dispatchRemoteAction(action: RemoteAction, actions: GameActions, ctx: RemoteActionContext): void {
  switch (action.type) {
    case 'BUY_EQUIPMENT': {
      const card = ctx.market.find(c => c.id === action.cardId);
      if (card) actions.buyEquipment(card, action.slot);
      return;
    }
    case 'SWAP_SLOTS':
      actions.swapSlots(action.slotA, action.slotB);
      return;
    case 'STORE_CARD':
      actions.storeCard(action.slot);
      return;
    case 'EQUIP_FROM_INVENTORY': {
      const card = ctx.activePlayer.inventory.find(c => c.id === action.cardId);
      if (card) actions.equipFromInventory(card, action.slot);
      return;
    }
    case 'BUY_TACTIC': {
      const tactic = ctx.tacticMarket.find(t => t.id === action.tacticId);
      if (tactic) actions.buyTactic(tactic);
      return;
    }
    case 'PLAY_TACTIC': {
      const tactic = ctx.activePlayer.handTactics.find(t => t.id === action.tacticId);
      if (tactic) actions.playTactic(tactic);
      return;
    }
    case 'RECHARGE':
      actions.rechargeEnergy();
      return;
    case 'REQUISITION':
      actions.requestEmergencyRequisition();
      return;
    case 'RECYCLE':
      actions.recycleInventoryCard(action.cardId);
      return;
    case 'REFRESH_MISSIONS':
      actions.refreshMissions();
      return;
    case 'TRANSMIT': {
      const mission = ctx.activeMissions.find(m => m.id === action.missionId);
      if (mission) actions.transmitMission(mission);
      return;
    }
    case 'END_TURN':
      actions.endTurn();
      return;
  }
}
