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

  return (
    <div className="flex flex-col gap-2.5">
      {/* Top: Name & Medium Badge + Optional Header Right Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <h4 className="text-xs sm:text-sm font-black text-slate-100 leading-snug">
            {content?.name || card.id}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {mediumInfo && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
              {mediumInfo.icon} {mediumInfo.label}
            </span>
          )}
          {headerRightBadge}
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
        {content?.desc}
      </p>

      {showFlavor && content?.flavor && (
        <p className="text-[10px] text-slate-400 italic">
          "{content.flavor}"
        </p>
      )}

      {/* Technical Specs Attributes Matrix (MAPS Pattern) */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[10px]">
        <div className="p-1.5 rounded-lg bg-black/40 text-center">
          <span className="text-slate-500 block text-[9px]">頻寬門檻</span>
          <span className={`font-black ${
            card.bandwidth === 'High' ? 'text-cyan-400' : card.bandwidth === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {card.bandwidth}
          </span>
        </div>

        <div className="p-1.5 rounded-lg bg-black/40 text-center">
          <span className="text-slate-500 block text-[9px]">通訊距離</span>
          <span className="font-bold text-slate-200 truncate block">
            {card.range}
          </span>
        </div>

        <div className="p-1.5 rounded-lg bg-black/40 text-center">
          <span className="text-slate-500 block text-[9px]">運作耗電</span>
          <span className="font-bold text-amber-300">
            {card.powerCost === 0 ? '0⚡ (免電)' : `${card.powerCost}⚡`}
          </span>
        </div>
      </div>

      {/* Resilience & Specific Capability Badges (MAPS Minimal - No Hashtags) */}
      <div className="flex items-center gap-1 text-[9px] text-slate-400 flex-wrap pt-0.5">
        {card.resilience.empShield && (
          <span className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 font-bold">
            🛡️ 抗EMP
          </span>
        )}
        {card.resilience.weatherResistant && (
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
            🌧️ 耐天候
          </span>
        )}
        {card.resilience.subterranean && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
            🕳️ 地底穿透
          </span>
        )}
        {(card.id === 'eq_aldis_light_mirror' || card.tags?.includes('光學信號')) && (
          <span className="px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/40 font-bold">
            🔦 視距光碼
          </span>
        )}
        {(card.id === 'eq_motorcycle_runner' || card.tags?.includes('人力信差')) && (
          <span className="px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-500/40 font-bold">
            🏃 實體載體
          </span>
        )}
        {(card.id === 'eq_acoustic_thumper' || card.tags?.includes('聲學震波')) && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-bold">
            🔊 聲學震波
          </span>
        )}
      </div>
    </div>
  );
}
