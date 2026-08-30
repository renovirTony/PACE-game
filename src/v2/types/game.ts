export type PACESlot = 'P' | 'A' | 'C' | 'E';

/**
 * 5 大實體物理媒介 (Physical Media)
 * 事件攻擊物理媒介，同類媒介具備共同脆弱點 (Common-mode Failure)
 */
export type PhysicalMedium = 
  | 'Cellular'        // 🏙️ 公眾網/行動基地台 (高度依賴市電與機房)
  | 'Satellite'       // 🛰️ 衛星通訊 (依賴開闊天空視線，受暴風雨/雲層衰減)
  | 'Radio'           // 📻 無線電波/射頻 (易受電磁脈衝 EMP、山峰阻隔、雜訊干擾)
  | 'Wired'           // 🔌 實體有線 (免射頻干擾，但線路可能被地震/土石流扯斷)
  | 'PhysicalOptical';// 🏃 人力與光學/聲波 (完全免電力、零干擾，但距離短、易受天候視線阻礙)

export type BandwidthType = 'High' | 'Medium' | 'Low';
export type RangeType = 'Local' | 'LineOfSight' | 'LongRange' | 'Penetrating';

export type WorldviewType = 
  | 'CivilDefense'      // 主題 B：社區民防與自救 (預設)
  | 'IslandResilience'  // 主題 A：海島孤島與極端天災
  | 'CyberDisconnect';  // 主題 C：大斷網時代 (科幻廢土)

export interface LocalizedContent {
  name: string;
  desc: string;
  flavor: string;
  icon: string;
}

export interface CommsCard {
  id: string;
  medium: PhysicalMedium;
  bandwidth: BandwidthType;
  range: RangeType;
  cost: number;        // 採購成本 (Credits)
  powerCost: number;   // 運作耗電 (Energy)
  resilience: {
    empShield: boolean;        // 具備抗 EMP 加固
    weatherResistant: boolean; // 具備全天候防風雨耐受
    subterranean: boolean;     // 具備地底/掩體穿透力
  };
  translations: Record<WorldviewType, LocalizedContent>;
  tags: string[];
}

export type TacticEffectType =
  | 'RECHARGE_BATTERY'
  | 'AIRDROP_CREDITS'
  | 'DEPLOY_ANTENNA'
  | 'FARADAY_SHIELD'
  | 'COMMUNITY_RELAY'
  | 'AGILE_PROTOCOL';

export interface TacticCard {
  id: string;
  cost: number;
  effectType: TacticEffectType;
  value?: number;
  translations: Record<WorldviewType, LocalizedContent>;
}

export type MissionUrgency = 'Routine' | 'Disaster' | 'Critical';

export interface CrisisMission {
  id: string;
  requiredBandwidth: BandwidthType; // High, Medium, Low (頻寬門檻)
  requiredRange: RangeType[];
  requiresWeatherResist?: boolean;
  requiresEmpShield?: boolean;
  requiresSubterranean?: boolean;
  requiresOptical?: boolean; // 需光學/信號燈手段 (如黑夜電磁靜默)
  requiresWired?: boolean;   // 需實體有線
  vpReward: number;
  creditReward: number;
  urgency: MissionUrgency;
  translations: Record<WorldviewType, {
    title: string;
    desc: string;
    flavor: string;
    icon: string;
    expertTip?: string; // 專家提示 / 模組 B 失敗解說
  }>;
  claimedBy: string[];
}

export interface DisasterEvent {
  id: string;
  duration: number;
  targetedMedia: PhysicalMedium[]; // 遭到直接破壞中斷的物理媒介
  powerDrainBonus?: number;       // 全場設備額外耗電 (如電網大斷電)
  rangePenalty?: boolean;         // 視線距離受阻 (如濃霧暴雨)
  translations: Record<WorldviewType, {
    title: string;
    desc: string;
    flavor: string;
    icon: string;
  }>;
}

export interface PlayerBuffs {
  antennaBoostRange?: boolean;   // 八木天線：本回合無線電距離 +1 階
  faradayEmpArmor?: boolean;     // 法拉第袋：本回合所有電子設備免疫 EMP
  communityRelayActive?: boolean;// 社區中繼站：本回合 C/E 通訊視同 A 槽（100% 滿額收益）
  agileProtocolActive?: boolean; // 敏捷協議：本回合防線對調與倉庫調配 0 AP
}

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  aiPersonality?: 'Balanced' | 'Pragmatic' | 'HighTech' | 'Survivalist';
  avatar: string;
  color: string;
  score: number;
  credits: number;
  actionPoints: number;
  maxActionPoints: number;
  energy: number;
  maxEnergy: number;
  paceBoard: {
    P: CommsCard | null;
    A: CommsCard | null;
    C: CommsCard | null;
    E: CommsCard | null;
  };
  inventory: CommsCard[]; // 備用裝備倉庫 (可暫存卸下之卡牌隨時重新裝備)
  handTactics: TacticCard[];
  completedMissions: string[];
  activeBuffs?: PlayerBuffs;
  stats: {
    transmissions: number;
    pSuccesses: number;
    aSuccesses: number;
    cSuccesses: number;
    eSuccesses: number;
    degradedTransmissions: number;
  };
}

export interface TransmissionResult {
  canTransmit: boolean;
  successfulSlot: PACESlot | null;
  usedCard: CommsCard | null;
  fallbackDepth: number; // 0 for P, 1 for A, 2 for C, 3 for E, -1 for failed
  degradationRate: number; // 1.0 (P/A), 0.7 (C), 0.5 (E)
  earnedVP: number;
  earnedCredits: number;
  reason: string;
  expertDebrief: string; // 專家科普解說 (做中學反饋)
  slotEvaluations: {
    slot: PACESlot;
    card: CommsCard | null;
    passed: boolean;
    failReason?: string;
  }[];
}

export interface GameLog {
  id: string;
  round: number;
  timestamp: string;
  playerId?: string;
  playerName?: string;
  type: 'info' | 'transmission' | 'event' | 'action' | 'alert' | 'success';
  message: string;
  details?: string;
}

export type GamePhase = 
  | 'SETUP' 
  | 'DISASTER_PHASE' 
  | 'PLAYER_ACTION' 
  | 'TRANSMISSION_PHASE' 
  | 'ROUND_END' 
  | 'GAME_OVER';

export type GameMode = 'SinglePlayer' | 'PassAndPlay' | 'OnlineMultiplayer';

export interface RoomPeer {
  id: string;
  peerId: string;
  name: string;
  isHost: boolean;
  avatar: string;
  color: string;
}
