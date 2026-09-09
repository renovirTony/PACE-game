import React from 'react';
import { CommsCard, PhysicalMedium, WorldviewType } from '../../types/game';

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

interface UnifiedCommsCardContentProps {
  card: CommsCard;
  worldview: WorldviewType;
  showFlavor?: boolean;
  headerRightBadge?: React.ReactNode;
}

export function UnifiedCommsCardContent({
  card,
  worldview,
  showFlavor = false,
  headerRightBadge,
}: UnifiedCommsCardContentProps) {
  const content = card.translations[worldview];
  const mediumInfo = getCommsCardMediumInfo(card);
  const rangeInfo = RANGE_META[card.range] || { label: card.range, fullLabel: card.range, desc: '' };

  return (
    <div className="flex flex-col gap-2 font-mono w-full">
      {/* Top Metadata Row: Medium Badge (Left) & Cost/Action Badge (Right) */}
      <div className="flex items-center justify-between gap-1.5 w-full flex-wrap">
        {mediumInfo && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
            {mediumInfo.icon} {mediumInfo.label}
          </span>
        )}
        {headerRightBadge && (
          <div className="shrink-0 flex items-center">
            {headerRightBadge}
          </div>
        )}
      </div>

      {/* Full-Width Card Title */}
      <h4 className="text-sm font-black text-slate-100 leading-snug break-words">
        {content?.name || card.id}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed">
        {content?.desc}
      </p>

      {showFlavor && content?.flavor && (
        <p className="text-xs text-slate-400 italic">
          "{content.flavor}"
        </p>
      )}

      {/* Technical Specs Attributes Matrix (MAPS Pattern) */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-xs">
        <div className="p-1.5 rounded-lg bg-black/40 text-center min-w-0 overflow-hidden">
          <span className="text-slate-500 block text-[11px] truncate">頻寬門檻</span>
          <span className={`font-black truncate block ${
            card.bandwidth === 'High' ? 'text-cyan-400' : card.bandwidth === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {card.bandwidth}
          </span>
        </div>

        <div className="p-1.5 rounded-lg bg-black/40 text-center min-w-0 overflow-hidden" title={`通訊距離: ${rangeInfo.fullLabel} (${rangeInfo.desc})`}>
          <span className="text-slate-500 block text-[11px] truncate">通訊距離</span>
          <span className="font-bold text-slate-200 truncate block">
            {rangeInfo.label}
          </span>
        </div>

        <div className="p-1.5 rounded-lg bg-black/40 text-center min-w-0 overflow-hidden">
          <span className="text-slate-500 block text-[11px] truncate">運作耗電</span>
          <span className="font-bold text-amber-300 truncate block">
            {card.powerCost === 0 ? '0⚡ 免電' : `${card.powerCost}⚡`}
          </span>
        </div>
      </div>

      {/* Resilience Badges (MAPS Minimal - Only True Resiliences) */}
      {(card.resilience.empShield || card.resilience.weatherResistant || card.resilience.subterranean) && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap pt-0.5">
          {card.resilience.empShield && (
            <span className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 font-bold whitespace-nowrap shrink-0">
              🛡️ 抗EMP
            </span>
          )}
          {card.resilience.weatherResistant && (
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold whitespace-nowrap shrink-0">
              🌧️ 耐天候
            </span>
          )}
          {card.resilience.subterranean && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap shrink-0">
              🕳️ 地底穿透
            </span>
          )}
        </div>
      )}
    </div>
  );
}
