import { 
  CommsCard, 
  CrisisMission, 
  DisasterEvent, 
  PACESlot, 
  Player, 
  TransmissionResult,
  WorldviewType 
} from '../types/game';

const PACE_ORDER: PACESlot[] = ['P', 'A', 'C', 'E'];

/**
 * 檢查裝備卡是否符合槽位規範門檻
 * [P] 主要防線：必須具備日常通訊能力，最低頻寬需為 Medium 或 High（不可放置 Low 頻寬純應急工具）
 * [A], [C], [E]：開放自由配置
 */
export function canPlaceCardInSlot(
  card: CommsCard | null,
  slot: PACESlot
): { valid: boolean; reason?: string } {
  if (!card) return { valid: true };
  if (slot === 'P' && card.bandwidth === 'Low') {
    return {
      valid: false,
      reason: '⚠️ [P] 主要防線需具備日常通聯能力（最低頻寬需為 Medium 或 High），不能配置 Low 頻寬純應急工具！',
    };
  }
  return { valid: true };
}

/**
 * 檢查單張設備卡是否符合任務要求及物理環境限制
 */
export function checkCardEligibilityV2(
  card: CommsCard,
  slot: PACESlot,
  mission: CrisisMission,
  event: DisasterEvent | null,
  player: Player,
  worldview: WorldviewType = 'CivilDefense'
): { eligible: boolean; blockedReason?: string; expertDetail?: string } {
  const cardName = card.translations[worldview]?.name || card.id;

  // 1. 檢查電量消耗 (含大停電等全域耗電增加)
  const effectivePowerCost = card.powerCost + (event?.powerDrainBonus || 0);
  if (player.energy < effectivePowerCost) {
    return {
      eligible: false,
      blockedReason: `⚡ 電量不足 (需 ${effectivePowerCost}⚡，目前僅有 ${player.energy}⚡)`,
      expertDetail: `【${cardName}】需要電力驅動。在大停電或電池耗盡時，未備有發電機或備用電池將無法啟動！`,
    };
  }

  // 計算有效 EMP 抗性 (含法拉第防護袋 Buff)
  const hasEmpShield = Boolean(
    card.resilience.empShield || player.activeBuffs?.faradayEmpArmor
  );

  // 2. 檢查物理媒介受災中斷 (Physical Medium Targeted by Disaster)
  if (event && event.targetedMedia.includes(card.medium)) {
    // 若為 EMP 事件且設備有防護 (或開了法拉第袋)，可豁免
    if (event.id === 'evt_emp_strike' && hasEmpShield) {
      // 免疫 EMP
    } else {
      const mediumNameMap: Record<string, string> = {
        Cellular: '公眾網/基地台',
        Satellite: '衛星通訊',
        Radio: '無線電波',
        Wired: '實體有線',
        PhysicalOptical: '人力與光學',
      };
      return {
        eligible: false,
        blockedReason: `🌪️ 災難【${event.translations[worldview]?.title}】阻斷了【${mediumNameMap[card.medium]}】媒介！`,
        expertDetail: `受災事件直接摧毀了【${cardName}】所依賴的物理通道（如基地台停電、暴風雨散射衛星微波、或電磁波過載）。`,
      };
    }
  }

  // 3. 檢查頻寬需求 (Bandwidth Gate - 核心機制！)
  if (mission.requiredBandwidth === 'High' && card.bandwidth !== 'High') {
    return {
      eligible: false,
      blockedReason: `📊 頻寬不足 (任務需 High 高畫質傳輸，當前設備僅為 ${card.bandwidth})`,
      expertDetail: `【${cardName}】傳輸速率受物理限制，無法即時承載 4K 空照圖或大量視訊數據。`,
    };
  }
  if (mission.requiredBandwidth === 'Medium' && card.bandwidth === 'Low') {
    return {
      eligible: false,
      blockedReason: `📊 頻寬不足 (任務需 Medium 語音級頻寬，當前設備僅為 Low 座標/代碼級)`,
      expertDetail: `【${cardName}】只能傳送短文字或摩斯碼，無法支援多方連續語音通聯。`,
    };
  }

  // 4. 檢查通訊距離 (Range)
  let effectiveRange = card.range;
  // 若啟動八木天線增益且為無線電
  if (player.activeBuffs?.antennaBoostRange && card.medium === 'Radio') {
    if (effectiveRange === 'Local') effectiveRange = 'LineOfSight';
    else if (effectiveRange === 'LineOfSight') effectiveRange = 'LongRange';
  }
  // 若遇颱風且為光學設備，距離降為 Local
  if (event?.rangePenalty && card.medium === 'PhysicalOptical' && effectiveRange === 'LineOfSight') {
    effectiveRange = 'Local';
  }

  const rangeLevels: Record<string, number> = {
    Local: 1,
    LineOfSight: 2,
    LongRange: 3,
    Penetrating: 99,
  };

  const meetsRange = mission.requiredRange.some(req => {
    if (req === 'Penetrating') return card.resilience.subterranean;
    const reqLevel = rangeLevels[req] || 1;
    const curLevel = rangeLevels[effectiveRange] || 1;
    return curLevel >= reqLevel;
  });

  if (!meetsRange) {
    return {
      eligible: false,
      blockedReason: `📡 通訊距離不足 (任務需 ${mission.requiredRange.join('/')}，當前為 ${effectiveRange})`,
      expertDetail: `地形山脈阻隔或視距超出【${cardName}】的物理發射極限。`,
    };
  }

  // 5. 檢查特殊抗性要求 (全天候 / 地底穿透 / EMP防護)
  if (mission.requiresWeatherResist && !card.resilience.weatherResistant) {
    return {
      eligible: false,
      blockedReason: `🌧️ 缺乏全天候耐候防護 (設備遭暴風雨或土石流浸濕受損)`,
      expertDetail: `非耐候裝備在強風暴雨中極易短路或信號嚴重衰減。`,
    };
  }

  if (mission.requiresSubterranean && !card.resilience.subterranean) {
    return {
      eligible: false,
      blockedReason: `🕳️ 無法穿透地底掩體 (鋼筋水泥屏蔽了常規電波)`,
      expertDetail: `地下深層掩體具備嚴密金屬遮蔽效應，常規射頻完全無法穿透，需依靠地底震波或多跳網狀節點。`,
    };
  }

  if (mission.requiresEmpShield && !hasEmpShield) {
    return {
      eligible: false,
      blockedReason: `⚡ 缺乏 EMP 抗性防護 (晶片遭強電磁脈衝燒毀)`,
      expertDetail: `現代微電子晶片在 EMP 爆震下會被感應高壓瞬間擊穿，必須使用加固抗 EMP 或手搖純機械線路。`,
    };
  }

  // 6. 檢查特定物理媒介專屬要求 (例如黑夜純視距光學、全頻干擾純實體有線)
  if (mission.requiresOptical && (card.medium !== 'PhysicalOptical' || card.id !== 'eq_aldis_light_mirror')) {
    return {
      eligible: false,
      blockedReason: `🔦 此任務處於黑夜電磁靜默，必須使用【光學信號燈/摩斯光碼】！`,
      expertDetail: `黑夜視距引導需使用強光信號燈閃爍光碼，非光學發射手段無法被對岸或直升機肉眼辨識。`,
    };
  }

  if (mission.requiresWired && card.medium !== 'Wired') {
    return {
      eligible: false,
      blockedReason: `🔌 此任務遭全頻段射頻干擾，必須使用【實體有線】專線或手搖電話！`,
      expertDetail: `空中無線電訊號遭到全頻段壓制，唯有地下實體雙絞銅線能傳送指令。`,
    };
  }

  return { eligible: true };
}

/**
 * PACE V2 核心判定演算法：
 * 依序檢驗 P -> A -> C -> E
 * 採用階梯降級回報率 (P: 100%, A: 100%, C: 70%, E: 50%)
 */
export function evaluateV2PACETransmission(
  player: Player,
  mission: CrisisMission,
  event: DisasterEvent | null,
  worldview: WorldviewType = 'CivilDefense'
): TransmissionResult {
  const slotEvaluations: TransmissionResult['slotEvaluations'] = [];

  // 檢查媒介多樣性弱點 (共因失效預警)
  const pCard = player.paceBoard.P;
  const aCard = player.paceBoard.A;
  let commonModeWarning = '';
  if (pCard && aCard && pCard.medium === aCard.medium) {
    commonModeWarning = `⚠️ 警告：你的 [P] 與 [A] 槽位皆依賴【${pCard.medium}】媒介！一旦該媒介遭天災破壞，前兩道防線將同時連鎖崩潰！`;
  }

  for (let i = 0; i < PACE_ORDER.length; i++) {
    const slot = PACE_ORDER[i];
    const card = player.paceBoard[slot];

    if (!card) {
      slotEvaluations.push({
        slot,
        card: null,
        passed: false,
        failReason: '未配置任何通訊裝備',
      });
      continue;
    }

    const { eligible, blockedReason, expertDetail } = checkCardEligibilityV2(
      card,
      slot,
      mission,
      event,
      player,
      worldview
    );

    slotEvaluations.push({
      slot,
      card,
      passed: eligible,
      failReason: blockedReason,
    });

    if (eligible) {
      // 計算降級回報率
      let degradationRate = 1.0;
      if (slot === 'C') {
        degradationRate = player.activeBuffs?.communityRelayActive ? 0.85 : 0.7;
      } else if (slot === 'E') {
        degradationRate = player.activeBuffs?.communityRelayActive ? 0.75 : 0.5;
      }

      const earnedVP = Math.max(1, Math.round(mission.vpReward * degradationRate));
      const earnedCredits = Math.max(1, Math.round(mission.creditReward * degradationRate));

      const cardName = card.translations[worldview]?.name || card.id;
      let reasonText = '';
      let expertDebrief = '';

      if (slot === 'P') {
        reasonText = `✅ [P 主要防線] 順暢連通！以最高頻寬與零延遲完成任務！`;
        expertDebrief = `完美執行！平時妥善規劃高頻寬主要手段【${cardName}】，以 100% 效率獲取最大救災資源。`;
      } else if (slot === 'A') {
        reasonText = `🔄 主要手段受阻，成功切換至 [A 備用防線]！`;
        expertDebrief = `備援生效！當主要通道失靈時，【${cardName}】成功接替，維持 100% 任務達成率。`;
      } else if (slot === 'C') {
        reasonText = `🛡️ 前兩道防線中斷，成功啟動 [C 應急防線]！（通訊降級獲得 ${Math.round(degradationRate * 100)}% 收益）`;
        expertDebrief = `應急止血成功！在常規手段全倒下，依靠強韌的【${cardName}】救回危機！雖然傳輸受限而有些微降級，但守住了生命防線。`;
      } else if (slot === 'E') {
        reasonText = `🚨 全線常規崩潰，依靠終極 [E 緊急防線] 逆轉生還！（緊急降級獲得 ${Math.round(degradationRate * 100)}% 收益）`;
        expertDebrief = `終極保命！在電磁與電網全毀的絕境中，最原始的【${cardName}】送出了最後的生還座標！這就是為什麼 PACE 必須保留最後一道物理防線！`;
      }

      if (commonModeWarning) {
        expertDebrief += `\n\n${commonModeWarning}`;
      }

      return {
        canTransmit: true,
        successfulSlot: slot,
        usedCard: card,
        fallbackDepth: i,
        degradationRate,
        earnedVP,
        earnedCredits,
        reason: reasonText,
        expertDebrief,
        slotEvaluations,
      };
    }
  }

  // 四道防線全部陣亡
  const expertTip = mission.translations[worldview]?.expertTip || '需建立跨媒介的獨立備援方案。';
  return {
    canTransmit: false,
    successfulSlot: null,
    usedCard: null,
    fallbackDepth: -1,
    degradationRate: 0,
    earnedVP: 0,
    earnedCredits: 0,
    reason: `❌ 通訊全數中斷！所有四道 PACE 防線皆無法克服當前災難或達到任務門檻！`,
    expertDebrief: `【通訊專家復盤報告】\n本次任務要求需「頻寬：${mission.requiredBandwidth}、距離：${mission.requiredRange.join('/')}」。\n${expertTip}\n\n建議檢視你的 PACE 槽位：是否過度依賴單一媒介（如全部依賴市電基地台），或缺乏能在極端環境下運作的低階應急工具？`,
    slotEvaluations,
  };
}
