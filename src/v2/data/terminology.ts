import { BandwidthType, CommsCard, DisasterEvent, PhysicalMedium } from '../types/game';

/**
 * 全遊戲共用詞彙表（單一事實來源）
 *
 * 玩家可見的「物理媒介 / 通訊距離 / 頻寬門檻」文字一律由此取用，
 * 嚴禁在元件或規則引擎中直接輸出型別原始值（如 LongRange、Medium、Cellular）。
 */

export interface MediumMetaItem {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const PHYSICAL_MEDIUM_META: Record<PhysicalMedium, MediumMetaItem> = {
  Cellular: {
    label: '公眾網/基地台',
    icon: '🏙️',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
  },
  Satellite: {
    label: '衛星通訊',
    icon: '🛰️',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/40',
  },
  Radio: {
    label: '無線電波',
    icon: '📻',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
  },
  Wired: {
    label: '實體有線',
    icon: '🔌',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
  },
  PhysicalOptical: {
    label: '人力/光學/聲波',
    icon: '🏃',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
  },
};

/** 光學信號類裝備（強光手電筒、信號燈）：能完成「需光學」任務。以卡片 tag「光學信號」標記。 */
export function isOpticalSignalCard(card: CommsCard): boolean {
  return card.medium === 'PhysicalOptical' && card.tags.includes('光學信號');
}

/** 地底聲學類裝備（敲擊/震波）。以卡片 tag「聲學震波」標記。 */
export function isAcousticCard(card: CommsCard): boolean {
  return card.medium === 'PhysicalOptical' && card.tags.includes('聲學震波');
}

/** 取得裝備卡的媒介標示（人力/光學/聲波會再細分為光學摩斯、地底聲學、物理信差） */
export function getCommsCardMediumInfo(card: CommsCard | null): MediumMetaItem | null {
  if (!card) return null;
  if (card.medium === 'PhysicalOptical') {
    if (isOpticalSignalCard(card)) {
      return {
        label: '光學摩斯',
        icon: '🔦',
        color: 'text-amber-300',
        bgColor: 'bg-amber-950/50',
        borderColor: 'border-amber-500/50',
      };
    }
    if (isAcousticCard(card)) {
      return {
        label: '地底聲學',
        icon: '🔊',
        color: 'text-emerald-300',
        bgColor: 'bg-emerald-950/50',
        borderColor: 'border-emerald-500/50',
      };
    }
    return {
      label: '物理信差',
      icon: '🏃',
      color: 'text-purple-300',
      bgColor: 'bg-purple-950/50',
      borderColor: 'border-purple-500/50',
    };
  }
  return PHYSICAL_MEDIUM_META[card.medium] || PHYSICAL_MEDIUM_META.Cellular;
}

/** [P] 主要防線的放置限制標示（與 rules.ts 的 canPlaceCardInSlot 一致：不可放 Low 代碼級） */
export const P_SLOT_RULE_LABEL = '🔒 限中/高頻寬';

/** 媒介短名（手機天災膠囊等極窄空間用） */
export const MEDIUM_SHORT_LABEL: Record<PhysicalMedium, string> = {
  Cellular: '基地台',
  Satellite: '衛星',
  Radio: '無線電',
  Wired: '有線',
  PhysicalOptical: '光學',
};

export interface DisasterEffectChip {
  kind: 'media' | 'power' | 'range' | 'bonus';
  icon: string;
  text: string;
  tone: 'hazard' | 'warning' | 'bonus';
}

/**
 * 把天災的所有機制效果轉成玩家看得懂的標籤（單一事實來源）。
 * 手機膠囊、桌面 Header 與天災詳情視窗都用這裡，避免某端漏掉「耗電 +1」或「光學距離縮短」。
 */
export function describeDisasterEffects(event: DisasterEvent | null): {
  isHazard: boolean;
  chips: DisasterEffectChip[];
  /** 手機膠囊用的極短摘要，例：「基地台失效 +1⚡」 */
  shortSummary: string;
} {
  if (!event) return { isHazard: false, chips: [], shortSummary: '☀️ 氣候良好' };

  const chips: DisasterEffectChip[] = [];
  if (event.targetedMedia.length > 0) {
    chips.push({
      kind: 'media',
      icon: '✕',
      text: `阻斷：${event.targetedMedia.map(m => PHYSICAL_MEDIUM_META[m].label).join('、')}`,
      tone: 'hazard',
    });
  }
  if (event.powerDrainBonus) {
    chips.push({ kind: 'power', icon: '⚡', text: `需電設備耗電 +${event.powerDrainBonus}（免電裝備不受影響）`, tone: 'warning' });
  }
  if (event.rangePenalty) {
    chips.push({ kind: 'range', icon: '🌫️', text: '光學通訊距離降為短距', tone: 'warning' });
  }
  if (event.creditBonus) {
    chips.push({ kind: 'bonus', icon: '💰', text: `成功通訊額外 +${event.creditBonus} 物資`, tone: 'bonus' });
  }

  const isHazard = chips.some(c => c.tone !== 'bonus');
  const parts: string[] = [];
  if (event.targetedMedia.length >= 3) {
    // 三種以上媒介時名稱太長，手機膠囊會被截斷；改顯示數量，點開詳情再看是哪幾種
    parts.push(`${event.targetedMedia.length} 種媒介失效`);
  } else if (event.targetedMedia.length > 0) {
    parts.push(`${event.targetedMedia.map(m => MEDIUM_SHORT_LABEL[m]).join('/')}失效`);
  }
  if (event.powerDrainBonus) parts.push(`+${event.powerDrainBonus}⚡`);
  if (parts.length === 0 && event.rangePenalty) parts.push('光學距離縮短');
  const shortSummary = parts.length > 0 ? parts.join(' ') : event.creditBonus ? `☀️ 通訊黃金期 +${event.creditBonus}💰` : '☀️ 氣候良好';

  return { isHazard, chips, shortSummary };
}

export interface RangeMetaItem {
  label: string;
  fullLabel: string;
  desc: string;
}

export const RANGE_META: Record<string, RangeMetaItem & { shortLabel: string }> = {
  Local: {
    shortLabel: '短距',
    label: '短距通聯',
    fullLabel: '短距通聯 (同區/現場)',
    desc: '現場/同營區/避難所',
  },
  LineOfSight: {
    shortLabel: '視距',
    label: '視距通聯',
    fullLabel: '視距通聯 (LOS)',
    desc: '目視直線無遮蔽',
  },
  LongRange: {
    shortLabel: '跨區',
    label: '跨區長程',
    fullLabel: '跨區長程 (超視距)',
    desc: '跨縣市或超視距長程',
  },
  Penetrating: {
    shortLabel: '地底',
    label: '地底穿透',
    fullLabel: '地底穿透 (耐障礙)',
    desc: '穿透地下室與隧道倒塌掩體',
  },
};

/** 取得通訊距離標示（未知值時回退為原字串，避免畫面空白） */
export function getRangeLabel(range: string): string {
  return RANGE_META[range]?.label || range;
}

export interface BandwidthMetaItem {
  /** 敘述句與失敗訊息用（英文全稱，例：Medium 語音級） */
  label: string;
  /** 三欄屬性矩陣等寬度受限處專用（Medium 縮寫為 Med） */
  compactLabel: string;
  color: string;
}

export const BANDWIDTH_META: Record<BandwidthType, BandwidthMetaItem> = {
  High: {
    label: 'High 視訊級',
    compactLabel: 'High 視訊級',
    color: 'text-cyan-400',
  },
  Medium: {
    label: 'Medium 語音級',
    compactLabel: 'Med 語音級',
    color: 'text-amber-400',
  },
  Low: {
    label: 'Low 代碼級',
    compactLabel: 'Low 代碼級',
    color: 'text-emerald-400',
  },
};
