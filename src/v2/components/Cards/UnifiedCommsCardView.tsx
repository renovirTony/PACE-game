import React from 'react';
import { CommsCard, WorldviewType } from '../../types/game';
import { BANDWIDTH_META, RANGE_META, getCommsCardMediumInfo } from '../../data/terminology';

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
          <span className={`font-black truncate block ${BANDWIDTH_META[card.bandwidth].color}`}>
            {BANDWIDTH_META[card.bandwidth].compactLabel}
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
              🛡️ 抗 EMP
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
