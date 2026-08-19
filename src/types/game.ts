export type PACESlot = 'P' | 'A' | 'C' | 'E';

export type CommCategory = 
  | 'Cellular/Internet' 
  | 'Satellite' 
  | 'Tactical Radio' 
  | 'HF/Shortwave' 
  | 'Wired/Field' 
  | 'Mesh/LoRa' 
  | 'Optical/Visual' 
  | 'Physical/Courier' 
  | 'Acoustic/Seismic';

export type RangeType = 'Local' | 'Tactical' | 'Global' | 'Penetrating';
export type BandwidthType = 'High' | 'Medium' | 'Low';

export interface CommsCard {
  id: string;
  name: string;
  slot: PACESlot;
  category: CommCategory;
  cost: number;        // 購買消耗 (Credits)
  powerCost: number;   // 運作耗電 (Energy)
  bandwidth: BandwidthType;
  range: RangeType;
  resilience: {
    empShield: boolean;
    weatherResistant: boolean;
    subterranean: boolean;
  };
  bonusVP?: number;
  effectDesc: string;
  iconName: string;
  flavorText: string;
  tags: string[];
}

export type TacticType = 'Support' | 'Interference' | 'Upgrade' | 'Intel';

export interface TacticCard {
  id: string;
  name: string;
  type: TacticType;
  cost: number;
  effectType: 
    | 'GAIN_ENERGY' 
    | 'GAIN_CREDITS' 
    | 'SIGNAL_BOOST' 
    | 'EMP_JAMMER' 
    | 'OVERCLOCK' 
    | 'SUPPLY_DROP' 
    | 'SCOUT_AHEAD'
    | 'SECURE_CHANNEL';
  value?: number;
  description: string;
  iconName: string;
  flavorText: string;
}

export type MissionUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CrisisMission {
  id: string;
  title: string;
  description: string;
  vp: number;
  creditReward: number;
  requiredRange?: RangeType[];
  requiredBandwidth?: BandwidthType;
  requiredCategory?: CommCategory[];
  restrictedSlots?: PACESlot[]; // 該槽位被環境或任務限制不能使用
  requiresEmpShield?: boolean;
  requiresWeatherResist?: boolean;
  requiresSubterranean?: boolean;
  minSlotRequirement?: PACESlot; // 最低需要哪個槽位的應變手段 (如極限救援只能靠 C 或 E)
  urgency: MissionUrgency;
  iconName: string;
  flavor: string;
  claimedBy: string[]; // 哪些玩家已廣播連通
}

export interface GlobalEvent {
  id: string;
  title: string;
  duration: number; // 持續回合
  effectDescription: string;
  jammedSlots?: PACESlot[];
  blockedCategories?: CommCategory[];
  powerDrainBonus?: number;
  bandwidthPenalty?: boolean;
  iconName: string;
  flavor: string;
}

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  aiPersonality?: 'Aggressive' | 'Resilient' | 'Balanced' | 'Tactician';
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
  handTactics: TacticCard[];
  completedMissions: string[];
  stats: {
    transmissions: number;
    fallbacksTriggered: number;
    pSuccesses: number;
    aSuccesses: number;
    cSuccesses: number;
    eSuccesses: number;
  };
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
  | 'EVENT_PHASE' 
  | 'PLAYER_ACTION' 
  | 'TRANSMISSION_PHASE' 
  | 'ROUND_END' 
  | 'GAME_OVER';

export interface TransmissionResult {
  canTransmit: boolean;
  successfulSlot: PACESlot | null;
  usedCard: CommsCard | null;
  fallbackDepth: number; // 0 for P, 1 for A, 2 for C, 3 for E
  reason: string;
  bonusPoints: number;
  slotDetails: {
    slot: PACESlot;
    card: CommsCard | null;
    available: boolean;
    blockedReason?: string;
  }[];
}

export type FontSizeMode = 'normal' | 'large' | 'xlarge';

export interface TutorialStepInfo {
  step: number;
  title: string;
  targetElementId?: string;
  highlightSelector?: string;
  instruction: string;
  detail: string;
  actionHint?: string;
}
