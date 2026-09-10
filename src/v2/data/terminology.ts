import { BandwidthType, CommsCard, PhysicalMedium } from '../types/game';

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

/** 取得裝備卡的媒介標示（人力/光學/聲波會再細分為光學摩斯、地底聲學、物理信差） */
export function getCommsCardMediumInfo(card: CommsCard | null): MediumMetaItem | null {
  if (!card) return null;
  if (card.medium === 'PhysicalOptical') {
    if (card.id === 'eq_aldis_light_mirror' || card.tags?.includes('光學信號')) {
      return {
        label: '光學摩斯',
        icon: '🔦',
        color: 'text-amber-300',
        bgColor: 'bg-amber-950/50',
        borderColor: 'border-amber-500/50',
      };
    }
    if (card.id === 'eq_acoustic_thumper' || card.tags?.includes('聲學震波')) {
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

export interface RangeMetaItem {
  label: string;
  fullLabel: string;
  desc: string;
}

export const RANGE_META: Record<string, RangeMetaItem> = {
  Local: {
    label: '短距通聯',
    fullLabel: '短距通聯 (同區/現場)',
    desc: '現場/同營區/避難所',
  },
  LineOfSight: {
    label: '視距通聯',
    fullLabel: '視距通聯 (LOS)',
    desc: '目視直線無遮蔽',
  },
  LongRange: {
    label: '跨區長程',
    fullLabel: '跨區長程 (超視距)',
    desc: '跨縣市或超視距長程',
  },
  Penetrating: {
    label: '地底穿透',
    fullLabel: '地底穿透 (耐障礙)',
    desc: '穿透地下室與隧道倒塌掩體',
  },
  Global: {
    label: '全球覆蓋',
    fullLabel: '全球覆蓋 (衛星)',
    desc: '人造衛星軌道全球無死角',
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
