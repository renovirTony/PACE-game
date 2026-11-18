import { CommsCard, CrisisMission, DisasterEvent, PACESlot, Player, TacticCard } from '../types/game';
import { evaluateV2PACETransmission, isCardBlockedByEvent } from './rules';
import { EMP_EVENT_ID } from '../data/disasterEvents';

export interface AIDecision {
  actionType:
    | 'BUY_EQUIPMENT'
    | 'BUY_TACTIC'
    | 'PLAY_TACTIC'
    | 'RECHARGE'
    | 'TRANSMIT'
    | 'REFRESH_MISSIONS'
    | 'REQUISITION'
    | 'END_TURN';
  targetCard?: CommsCard;
  targetSlot?: PACESlot;
  targetTactic?: TacticCard;
  targetMission?: CrisisMission;
}

type Personality = NonNullable<Player['aiPersonality']>;

/**
 * 依 AI 個性為市場裝備打分（分數越高越想買）。
 * - Pragmatic（應變組長）：重視媒介多樣性與性價比
 * - Survivalist（火腿老手）：偏好抗災、免電、能撐到最後的 C/E 工具
 * - HighTech（特戰通訊官）：偏好高頻寬、長距離的高階裝備
 * - Balanced：介於中間
 */
function scoreCardForPersonality(card: CommsCard, player: Player, personality: Personality): number {
  const existingMedia = Object.values(player.paceBoard)
    .filter((c): c is CommsCard => c !== null)
    .map(c => c.medium);
  const isNewMedium = !existingMedia.includes(card.medium);
  const resilienceCount =
    Number(card.resilience.empShield) + Number(card.resilience.weatherResistant) + Number(card.resilience.subterranean);
  const bandwidthScore = card.bandwidth === 'High' ? 2 : card.bandwidth === 'Medium' ? 1 : 0;
  const rangeScore = card.range === 'LongRange' ? 2 : card.range === 'LineOfSight' ? 1 : 0;
  const isPowerFree = card.powerCost === 0;

  switch (personality) {
    case 'Survivalist':
      return (isNewMedium ? 3 : 0) + resilienceCount * 2 + (isPowerFree ? 3 : 0) - card.cost * 0.3;
    case 'HighTech':
      return (isNewMedium ? 2 : 0) + bandwidthScore * 2.5 + rangeScore * 1.5 + card.cost * 0.3;
    case 'Pragmatic':
      return (isNewMedium ? 4 : 0) + resilienceCount + bandwidthScore - card.cost * 0.5;
    case 'Balanced':
    default:
      return (isNewMedium ? 3 : 0) + resilienceCount + bandwidthScore + rangeScore * 0.5 - card.cost * 0.3;
  }
}

/**
 * 評估 AI 玩家的最佳槽位配置 (鼓勵媒介獨立性與頻寬階梯)
 */
export function findBestSlotForCard(player: Player, card: CommsCard): PACESlot {
  const board = player.paceBoard;

  // 1. 如果 P 空著且該卡為 High 或 Medium 頻寬，優先放 P
  if (!board.P && (card.bandwidth === 'High' || card.bandwidth === 'Medium')) return 'P';

  // 2. 如果 A 空著且該卡為 High/Medium 頻寬，且媒介與 P 不同，優先放 A
  if (!board.A && (card.bandwidth === 'High' || card.bandwidth === 'Medium')) {
    if (!board.P || board.P.medium !== card.medium) return 'A';
  }

  // 3. 如果 C 空著，優先放具備抗性或不同媒介的卡
  if (!board.C) {
    const existingMedia = [board.P?.medium, board.A?.medium].filter(Boolean);
    if (!existingMedia.includes(card.medium)) return 'C';
  }

  // 4. 如果 E 空著，優先放免電或強韌光學/人力卡
  if (!board.E) return 'E';

  // 5. 替換現有同質卡或較弱卡
  if (card.bandwidth === 'High' && board.P && board.P.bandwidth !== 'High') return 'P';
  if (card.resilience.empShield && board.C && !board.C.resilience.empShield) return 'C';

  // 預設找第一個空槽位 (P 槽必須具備 Medium 或 High 頻寬)
  if (!board.P && card.bandwidth !== 'Low') return 'P';
  if (!board.A) return 'A';
  if (!board.C) return 'C';

  return card.bandwidth === 'Low' ? 'C' : 'A'; // 覆蓋適當備援槽位
}

/** 防線上是否還有空槽，或有被天災打斷的裝備（值得補強） */
function boardNeedsUpgrade(player: Player, event: DisasterEvent | null): boolean {
  return Object.values(player.paceBoard).some(c => c === null || isCardBlockedByEvent(c, event, player));
}

/**
 * V2 啟發式 AI 決策引擎（每次呼叫回傳一個動作；每個動作都會消耗 AP、改變狀態或結束回合，不會卡死）
 */
export function computeV2AIDecision(
  aiPlayer: Player,
  market: CommsCard[],
  tacticMarket: TacticCard[],
  activeMissions: CrisisMission[],
  activeEvent: DisasterEvent | null
): AIDecision {
  const personality: Personality = aiPlayer.aiPersonality || 'Balanced';
  const buffs = aiPlayer.activeBuffs || {};
  const hasAP = aiPlayer.actionPoints >= 1;

  const transmittableMission = activeMissions.find(
    m => evaluateV2PACETransmission(aiPlayer, m, activeEvent).canTransmit
  );
  const affordableCards = market.filter(c => c.cost <= aiPlayer.credits);

  // 1. 戰術卡（0 AP）：只在真的用得到時才打出，避免白白浪費
  const findTactic = (type: TacticCard['effectType']) => aiPlayer.handTactics.find(t => t.effectType === type);

  const rechargeTactic = findTactic('RECHARGE_BATTERY');
  if (rechargeTactic && aiPlayer.energy <= 2) {
    return { actionType: 'PLAY_TACTIC', targetTactic: rechargeTactic };
  }
  const supplyTactic = findTactic('AIRDROP_CREDITS');
  if (supplyTactic && aiPlayer.credits <= 2) {
    return { actionType: 'PLAY_TACTIC', targetTactic: supplyTactic };
  }
  const empShieldTactic = findTactic('FARADAY_SHIELD');
  if (empShieldTactic && activeEvent?.id === EMP_EVENT_ID && !buffs.faradayEmpArmor) {
    return { actionType: 'PLAY_TACTIC', targetTactic: empShieldTactic };
  }
  // 中繼台只對 C/E 接手的任務有意義：有任務可通且會由 C/E 接手時才打
  const relayTactic = findTactic('COMMUNITY_RELAY');
  if (relayTactic && !buffs.communityRelayActive && transmittableMission) {
    const result = evaluateV2PACETransmission(aiPlayer, transmittableMission, activeEvent);
    if (result.successfulSlot === 'C' || result.successfulSlot === 'E') {
      return { actionType: 'PLAY_TACTIC', targetTactic: relayTactic };
    }
  }
  // 突發通訊令：沒 AP 但有任務可通時才打
  const burstTactic = findTactic('FREE_TRANSMISSION');
  if (burstTactic && !buffs.freeTransmissionActive && !hasAP && transmittableMission) {
    return { actionType: 'PLAY_TACTIC', targetTactic: burstTactic };
  }
  // 後勤通道：沒 AP 但買得起需要的裝備時才打
  const freeBuyTactic = findTactic('FREE_MARKET_PURCHASE');
  if (freeBuyTactic && !buffs.freeMarketPurchaseActive && !hasAP && affordableCards.length > 0 && boardNeedsUpgrade(aiPlayer, activeEvent)) {
    return { actionType: 'PLAY_TACTIC', targetTactic: freeBuyTactic };
  }
  // 敏捷協議（對調/倉庫 0 AP）：AI 不做對調與倉庫調配，保留不打

  // 2. 有任務可通就發起通訊檢定
  if (transmittableMission && (hasAP || buffs.freeTransmissionActive)) {
    return { actionType: 'TRANSMIT', targetMission: transmittableMission };
  }

  // 3. 電量歸零時野戰充電
  if (aiPlayer.energy <= 0 && hasAP) {
    return { actionType: 'RECHARGE' };
  }

  // 4. 防線需要補強且買得起：依個性挑裝備（後勤通道生效時 0 AP 也能買）
  if ((hasAP || buffs.freeMarketPurchaseActive) && affordableCards.length > 0 && boardNeedsUpgrade(aiPlayer, activeEvent)) {
    const targetCard = [...affordableCards].sort(
      (a, b) => scoreCardForPersonality(b, aiPlayer, personality) - scoreCardForPersonality(a, aiPlayer, personality)
    )[0];
    return { actionType: 'BUY_EQUIPMENT', targetCard, targetSlot: findBestSlotForCard(aiPlayer, targetCard) };
  }

  // 5. 防線需要補強但買不起：申請緊急後勤調撥 (+2 物資)
  if (hasAP && affordableCards.length === 0 && boardNeedsUpgrade(aiPlayer, activeEvent) && aiPlayer.actionPoints >= 2) {
    return { actionType: 'REQUISITION' };
  }

  // 6. 場上任務全部無解且還有 AP：重新偵察災情（刷新任務）
  if (!transmittableMission && aiPlayer.actionPoints >= 2 && activeMissions.length > 0) {
    return { actionType: 'REFRESH_MISSIONS' };
  }

  // 7. 物資充裕時買戰術卡
  if (hasAP && aiPlayer.credits >= 2) {
    const affordableTactics = tacticMarket.filter(t => t.cost <= aiPlayer.credits);
    if (affordableTactics.length > 0) {
      return { actionType: 'BUY_TACTIC', targetTactic: affordableTactics[0] };
    }
  }

  // 8. 電量不滿時補充
  if (aiPlayer.energy < aiPlayer.maxEnergy - 1 && hasAP) {
    return { actionType: 'RECHARGE' };
  }

  // 9. 無可執行行動，結束回合
  return { actionType: 'END_TURN' };
}
