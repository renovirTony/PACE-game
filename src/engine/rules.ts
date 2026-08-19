import { CommsCard, CrisisMission, GlobalEvent, PACESlot, Player, TransmissionResult } from '../types/game';

const PACE_ORDER: PACESlot[] = ['P', 'A', 'C', 'E'];

/**
 * 檢查單張設備卡是否符合任務要求及環境限制
 */
export function checkCardEligibility(
  card: CommsCard,
  slot: PACESlot,
  mission: CrisisMission,
  event: GlobalEvent | null,
  player: Player
): { eligible: boolean; blockedReason?: string } {
  // 1. 檢查電量
  const effectivePowerCost = card.powerCost + (event?.powerDrainBonus || 0);
  if (player.energy < effectivePowerCost) {
    return { eligible: false, blockedReason: `電量不足 (需 ${effectivePowerCost}⚡，目前 ${player.energy}⚡)` };
  }

  // 2. 檢查全域環境事件封鎖
  if (event) {
    if (event.jammedSlots && event.jammedSlots.includes(slot)) {
      return { eligible: false, blockedReason: `環境事件 [${event.title}] 封鎖了 ${slot} 槽位` };
    }
    if (event.blockedCategories && event.blockedCategories.includes(card.category)) {
      return { eligible: false, blockedReason: `環境事件封鎖了 ${card.category} 類別設備` };
    }
  }

  // 3. 檢查任務特定限制
  if (mission.restrictedSlots && mission.restrictedSlots.includes(slot)) {
    return { eligible: false, blockedReason: `任務限制：無法使用 ${slot} 槽位` };
  }

  if (mission.minSlotRequirement) {
    const minIndex = PACE_ORDER.indexOf(mission.minSlotRequirement);
    const currentIndex = PACE_ORDER.indexOf(slot);
    if (currentIndex < minIndex) {
      return { eligible: false, blockedReason: `任務指定最低必須使用 [${mission.minSlotRequirement}] 級別或更強韌之應急手段` };
    }
  }

  if (mission.requiredCategory && !mission.requiredCategory.includes(card.category)) {
    return { eligible: false, blockedReason: `任務指定設備類型不符 (需: ${mission.requiredCategory.join('/')})` };
  }

  // 4. 檢查覆蓋範圍 (Range)
  if (mission.requiredRange && mission.requiredRange.length > 0) {
    const rangeMatch = mission.requiredRange.includes(card.range);
    if (!rangeMatch) {
      return { eligible: false, blockedReason: `通訊距離不足 (需 ${mission.requiredRange.join('或')})` };
    }
  }

  // 5. 檢查頻寬需求 (Bandwidth)
  if (mission.requiredBandwidth) {
    if (mission.requiredBandwidth === 'High' && card.bandwidth !== 'High') {
      return { eligible: false, blockedReason: `頻寬不足 (需 High 高頻寬)` };
    }
    if (mission.requiredBandwidth === 'Medium' && card.bandwidth === 'Low') {
      return { eligible: false, blockedReason: `頻寬不足 (需 Medium 以上)` };
    }
  }

  // 6. 檢查抗性要求 (EMP / 天候 / 地底)
  if (mission.requiresEmpShield && !card.resilience.empShield) {
    return { eligible: false, blockedReason: `缺乏 EMP / 抗電磁脈衝防護` };
  }
  if (mission.requiresWeatherResist && !card.resilience.weatherResistant) {
    return { eligible: false, blockedReason: `缺乏惡劣天候耐受力 (風暴/極溫)` };
  }
  if (mission.requiresSubterranean && !card.resilience.subterranean) {
    return { eligible: false, blockedReason: `缺乏地底/穿透掩體能力` };
  }

  return { eligible: true };
}

/**
 * PACE 核心判定演算法：
 * 依序檢查 Primary -> Alternate -> Contingency -> Emergency
 * 若 Primary 受阻，自動切換至 Alternate，以此類推！
 */
export function evaluatePACETransmission(
  player: Player,
  mission: CrisisMission,
  event: GlobalEvent | null
): TransmissionResult {
  const slotDetails: TransmissionResult['slotDetails'] = [];

  for (let i = 0; i < PACE_ORDER.length; i++) {
    const slot = PACE_ORDER[i];
    const card = player.paceBoard[slot];

    if (!card) {
      slotDetails.push({
        slot,
        card: null,
        available: false,
        blockedReason: '未裝備設備'
      });
      continue;
    }

    const { eligible, blockedReason } = checkCardEligibility(card, slot, mission, event, player);
    slotDetails.push({
      slot,
      card,
      available: eligible,
      blockedReason
    });

    // 如果此槽位可通訊，立即連通並回傳 (PACE Fallback 命中)
    if (eligible) {
      let bonusPoints = (card.bonusVP || 0);
      
      // Fallback 應變獎勵加分 (使用 C 或 E 成功應變可獲額外防衛分)
      if (slot === 'C') bonusPoints += 1;
      if (slot === 'E') bonusPoints += 2;

      let fallbackText = '';
      if (i === 0) fallbackText = '主要通訊 [P] 順暢連通！';
      else if (i === 1) fallbackText = '主要通訊受阻，成功切換至備用通訊 [A]！';
      else if (i === 2) fallbackText = '主/備通訊皆中斷，成功觸發應急通訊 [C]！';
      else if (i === 3) fallbackText = '全線常規崩潰，依靠終極緊急防線 [E] 力挽狂瀾！';

      return {
        canTransmit: true,
        successfulSlot: slot,
        usedCard: card,
        fallbackDepth: i,
        reason: fallbackText,
        bonusPoints,
        slotDetails
      };
    }
  }

  // 四個槽位皆無法通訊
  return {
    canTransmit: false,
    successfulSlot: null,
    usedCard: null,
    fallbackDepth: -1,
    reason: '所有 PACE 通訊手段皆無法克服當前危機與環境限制！',
    bonusPoints: 0,
    slotDetails
  };
}
