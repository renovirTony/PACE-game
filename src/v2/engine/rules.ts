import { 
  CommsCard, 
  CrisisMission, 
  DisasterEvent, 
  PACESlot, 
  Player, 
  TransmissionResult,
  WorldviewType
} from '../types/game';
import { BANDWIDTH_META, PHYSICAL_MEDIUM_META, getRangeLabel, isOpticalSignalCard } from '../data/terminology';
import { EMP_EVENT_ID } from '../data/disasterEvents';

const PACE_ORDER: PACESlot[] = ['P', 'A', 'C', 'E'];

/**
 * 計算裝備在當前天災下的實際耗電。
 * 大停電等事件的額外耗電只加在「需電設備」上；0⚡ 免電裝備（哨子、光碼、信差）永遠免電。
 */
export function getEffectivePowerCost(card: CommsCard, event: DisasterEvent | null): number {
  if (card.powerCost <= 0) return 0;
  return card.powerCost + (event?.powerDrainBonus || 0);
}

/**
 * 槽位收益率：P/A 100%、C 70%、E 50%。
 * 本回合啟動【志願者中繼台】時，C 與 E 也享 100% 滿額收益。防線面板的收益標籤也用這個值。
 */
export function getSlotRevenueRate(slot: PACESlot, player: Player): number {
  if (slot === 'C' || slot === 'E') {
    if (player.activeBuffs?.communityRelayActive) return 1.0;
    return slot === 'C' ? 0.7 : 0.5;
  }
  return 1.0;
}

/** 拆解倉庫裝備的回收值：買價折半（無條件進位）；0 元的起始裝備回收 0，避免白拿物資 */
export function getRecycleRefund(cost: number): number {
  return cost <= 0 ? 0 : Math.ceil(cost / 2);
}

/** 裝備是否具備有效的 EMP 抗性（本身加固，或本回合開了法拉第防護袋） */
export function hasEffectiveEmpShield(card: CommsCard, player: Player): boolean {
  return Boolean(card.resilience.empShield || player.activeBuffs?.faradayEmpArmor);
}

/**
 * 裝備是否被當前天災打斷（媒介遭破壞；EMP 事件下具抗 EMP 者豁免）。
 * 引擎、防線面板與市場的紅燈標示共用這一個判斷，避免各處算法不一致。
 */
export function isCardBlockedByEvent(card: CommsCard, event: DisasterEvent | null, player: Player): boolean {
  if (!event || !event.targetedMedia.includes(card.medium)) return false;
  if (event.id === EMP_EVENT_ID && hasEffectiveEmpShield(card, player)) return false;
  return true;
}

/**
 * 通訊受阻原因代碼，數字為檢定階段（與 checkCardEligibilityV2 的檢查順序一致）。
 * 階段越後面代表該裝備越接近成功。
 */
export type BlockCode = NonNullable<TransmissionResult['slotEvaluations'][number]['blockCode']>;
const BLOCK_STAGE: Record<BlockCode, number> = {
  power: 0,
  disaster: 1,
  requirement: 2,
  bandwidth: 3,
  range: 4,
};

/**
 * 檢查裝備卡是否符合槽位規範門檻
 * [P] 主要防線：必須具備日常通訊能力，最低頻寬需為 Medium 語音級（不可放置 Low 代碼級純應急工具）
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
      reason: `⚠️ [P] 槽需 ${BANDWIDTH_META.Medium.label}以上頻寬 (純應急工具不可居首)`,
    };
  }
  return { valid: true };
}

/**
 * 檢查單張設備卡是否符合任務要求及物理環境限制
 */
export function checkCardEligibilityV2(
  card: CommsCard,
  mission: CrisisMission,
  event: DisasterEvent | null,
  player: Player,
  worldview: WorldviewType = 'CivilDefense'
): { eligible: boolean; blockedReason?: string; blockCode?: BlockCode; expertDetail?: string } {
  const cardName = card.translations[worldview]?.name || card.id;

  // 1. 檢查電量消耗 (含大停電等全域耗電增加；免電裝備不受影響)
  const effectivePowerCost = getEffectivePowerCost(card, event);
  if (player.energy < effectivePowerCost) {
    return {
      eligible: false,
      blockCode: 'power',
      blockedReason: `⚡ 設備缺電 (需 ${effectivePowerCost}⚡)`,
      expertDetail: `【${cardName}】需要電力驅動。在大停電或電池耗盡時，未備有發電機或備用電池將無法啟動！`,
    };
  }

  const hasEmpShield = hasEffectiveEmpShield(card, player);

  // 2. 檢查物理媒介受災中斷 (Physical Medium Targeted by Disaster)
  if (isCardBlockedByEvent(card, event, player)) {
    return {
      eligible: false,
      blockCode: 'disaster',
      blockedReason: `🌪️ 【${PHYSICAL_MEDIUM_META[card.medium].label}】媒介中斷！`,
      expertDetail: `受災事件直接摧毀了【${cardName}】所依賴的物理通道（如基地台停電、暴風雨散射衛星微波、或電磁波過載）。`,
    };
  }

  // 3. 檢查任務的特殊抗性 / 媒介要求 (耐天候 / 地底穿透 / 抗 EMP / 光學 / 有線)
  //    先於頻寬與距離檢查：這類要求是「換哪種工具」的根本原因，對玩家最有指導性。
  if (mission.requiresWeatherResist && !card.resilience.weatherResistant) {
    return {
      eligible: false,
      blockCode: 'requirement',
      blockedReason: `🌧️ 缺乏耐天候防護 (設備遭暴風雨或土石流浸濕受損)`,
      expertDetail: `非耐天候裝備在強風暴雨中極易短路或信號嚴重衰減。`,
    };
  }

  if (mission.requiresSubterranean && !card.resilience.subterranean) {
    return {
      eligible: false,
      blockCode: 'requirement',
      blockedReason: `🕳️ 無法穿透地底掩體 (鋼筋水泥屏蔽了常規電波)`,
      expertDetail: `地下深層掩體具備嚴密金屬遮蔽效應，常規射頻完全無法穿透，需依靠地底震波或多跳網狀節點。`,
    };
  }

  if (mission.requiresEmpShield && !hasEmpShield) {
    return {
      eligible: false,
      blockCode: 'requirement',
      blockedReason: `⚡ 缺乏 EMP 抗性防護 (晶片遭強電磁脈衝燒毀)`,
      expertDetail: `現代微電子晶片在 EMP 爆震下會被感應高壓瞬間擊穿，必須使用加固抗 EMP 或手搖純機械線路。`,
    };
  }

  if (mission.requiresOptical && !isOpticalSignalCard(card)) {
    return {
      eligible: false,
      blockCode: 'requirement',
      blockedReason: `🔦 此任務處於黑夜電磁靜默，必須使用【光學信號燈/摩斯光碼】（機車信差等實體載體無法發送視距光碼）！`,
      expertDetail: `黑夜視距引導需使用強光手電筒或阿爾迪斯信號燈閃爍光碼，非光學發射手段（如機車巡守隊）無法被對岸肉眼辨識。`,
    };
  }

  if (mission.requiresWired && card.medium !== 'Wired') {
    return {
      eligible: false,
      blockCode: 'requirement',
      blockedReason: `🔌 此任務遭全頻段射頻干擾，必須使用【實體有線】專線或手搖電話！`,
      expertDetail: `空中無線電訊號遭到全頻段壓制，唯有地下實體雙絞銅線能傳送指令。`,
    };
  }

  // 4. 檢查頻寬需求 (Bandwidth Gate - 核心機制！)
  if (mission.requiredBandwidth === 'High' && card.bandwidth !== 'High') {
    return {
      eligible: false,
      blockCode: 'bandwidth',
      blockedReason: `📊 頻寬不足 (任務需 ${BANDWIDTH_META.High.label}頻寬，當前設備僅為 ${BANDWIDTH_META[card.bandwidth].label})`,
      expertDetail: `【${cardName}】傳輸速率受物理限制，無法即時承載 4K 空照圖或大量視訊數據。`,
    };
  }
  if (mission.requiredBandwidth === 'Medium' && card.bandwidth === 'Low') {
    return {
      eligible: false,
      blockCode: 'bandwidth',
      blockedReason: `📊 頻寬不足 (任務需 ${BANDWIDTH_META.Medium.label}頻寬，當前設備僅為 ${BANDWIDTH_META.Low.label})`,
      expertDetail: `【${cardName}】只能傳送短文字或摩斯碼，無法支援多方連續語音通聯。`,
    };
  }

  // 5. 檢查通訊距離 (Range)
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
      blockCode: 'range',
      blockedReason: `📡 通訊距離不足 (任務需 ${mission.requiredRange.map(getRangeLabel).join('/')}，當前為 ${getRangeLabel(effectiveRange)})`,
      expertDetail: `地形山脈阻隔或視距超出【${cardName}】的物理發射極限。`,
    };
  }

  return { eligible: true };
}

/** 防線上用了幾種不同的物理媒介（0–4） */
export function countUniqueMedia(player: Player): number {
  return new Set(
    Object.values(player.paceBoard)
      .filter((c): c is CommsCard => c !== null)
      .map(c => c.medium)
  ).size;
}

/**
 * 玩家排名比較：分數 → 完成任務數 → 防線媒介多樣性 → 降級通訊次數較少者。
 * 同分時不再由陣列順序決定（原本人類玩家永遠勝出）。
 */
function comparePlayers(a: Player, b: Player): number {
  return (
    b.score - a.score ||
    b.completedMissions.length - a.completedMissions.length ||
    countUniqueMedia(b) - countUniqueMedia(a) ||
    a.stats.degradedTransmissions - b.stats.degradedTransmissions
  );
}

export function rankPlayers(players: Player[]): Player[] {
  return [...players].sort(comparePlayers);
}

/** 所有比較條件都相同的並列冠軍名單（只有一人時代表沒有並列） */
export function getCoWinners(players: Player[]): Player[] {
  const ranked = rankPlayers(players);
  if (ranked.length === 0) return [];
  return ranked.filter(p => comparePlayers(p, ranked[0]) === 0);
}

/**
 * 從各槽位的檢定結果中，挑出最值得告訴玩家的單一受阻原因（供任務卡顯示）。
 * 取「檢定走得最遠」的那個槽位：它離成功最近，它卡住的原因就是玩家最該補的那一塊。
 * 例：黑夜光碼任務中，手機卡在「需光學」、手電筒只卡在「距離」→ 顯示距離不足。
 * 同階段時取較前面的槽位。
 */
export function pickPrimaryBlock(
  slotEvaluations: TransmissionResult['slotEvaluations']
): { failReason: string; blockCode: BlockCode } | null {
  let best: { failReason: string; blockCode: BlockCode } | null = null;
  for (const s of slotEvaluations) {
    if (!s.card || !s.blockCode || !s.failReason) continue;
    if (!best || BLOCK_STAGE[s.blockCode] > BLOCK_STAGE[best.blockCode]) {
      best = { failReason: s.failReason, blockCode: s.blockCode };
    }
  }
  return best;
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
    commonModeWarning = `⚠️ 警告：你的 [P] 與 [A] 槽位皆依賴【${PHYSICAL_MEDIUM_META[pCard.medium].label}】媒介！一旦該媒介遭天災破壞，前兩道防線將同時連鎖崩潰！`;
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

    const { eligible, blockedReason, blockCode, expertDetail } = checkCardEligibilityV2(
      card,
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
      blockCode,
      expertDetail,
    });

    if (eligible) {
      // 計算降級回報率 (若啟動志願者中繼台，C 與 E 槽位均視同 A 槽享有 100% 滿額收益！)
      const degradationRate = getSlotRevenueRate(slot, player);

      const earnedVP = Math.max(1, Math.round(mission.vpReward * degradationRate));
      // 天候加成（如通訊黃金期 +1 物資）在降級計算後另外加上
      const earnedCredits = Math.max(1, Math.round(mission.creditReward * degradationRate)) + (event?.creditBonus || 0);

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
        reasonText = player.activeBuffs?.communityRelayActive 
          ? `🛡️ 啟動 [C 應急防線]！因【志願者中繼台】加持，獲得 100% 滿額收益！`
          : `🛡️ 前兩道防線中斷，成功啟動 [C 應急防線]！（通訊降級獲得 ${Math.round(degradationRate * 100)}% 收益）`;
        expertDebrief = `應急止血成功！在常規手段全倒下，依靠強韌的【${cardName}】救回危機！${player.activeBuffs?.communityRelayActive ? '志願者中繼節點成功將應急訊號補償至滿額 100% 傳輸率！' : '雖然傳輸受限而有些微降級，但守住了生命防線。'}`;
      } else if (slot === 'E') {
        reasonText = player.activeBuffs?.communityRelayActive
          ? `🚨 啟動終極 [E 緊急防線]！因【志願者中繼台】加持，獲得 100% 滿額收益！`
          : `🚨 全線常規崩潰，依靠終極 [E 緊急防線] 逆轉生還！（緊急降級獲得 ${Math.round(degradationRate * 100)}% 收益）`;
        expertDebrief = `終極保命！在電磁與電網全毀的絕境中，最原始的【${cardName}】送出了最後的生還座標！${player.activeBuffs?.communityRelayActive ? '志願者中繼站完成了全線轉發，救難收益達到滿額 100%！' : '這就是為什麼 PACE 必須保留最後一道物理防線！'}`;
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
    expertDebrief: `【通訊專家復盤報告】\n本次任務要求需「頻寬：${BANDWIDTH_META[mission.requiredBandwidth].label}、距離：${mission.requiredRange.map(getRangeLabel).join('/')}」。\n${expertTip}\n\n建議檢視你的 PACE 槽位：是否過度依賴單一媒介（如全部依賴市電基地台），或缺乏能在極端環境下運作的低階應急工具？`,
    slotEvaluations,
  };
}
