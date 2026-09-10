import React from 'react';
import { CommsCard } from '../../types/game';
import { BANDWIDTH_META, RANGE_META } from '../../data/terminology';

interface EquipCardSpecsProps {
  card: CommsCard;
  /** 更緊湊的 padding，適用於防線區和市場區 */
  compact?: boolean;
}

/**
 * 共用裝備卡屬性矩陣 + 防護徽章列
 * 遵循圖鑑 (UnifiedCommsCardContent) 的三欄結構：
 *  ┌──────────┬──────────┬──────────┐
 *  │ 頻寬門檻  │ 通訊距離  │ 運作耗電  │
 *  └──────────┴──────────┴──────────┘
 *  🛡️ 抗 EMP  🌧️ 耐天候  🕳️ 地底穿透
 */
export function EquipCardSpecs({ card, compact = false }: EquipCardSpecsProps) {
  const rangeInfo = RANGE_META[card.range] || { label: card.range, fullLabel: card.range, desc: '' };
  const cellPad = compact ? 'p-1' : 'p-1.5';
  const labelSize = compact ? 'text-[10px]' : 'text-[11px]';
  const valueSize = compact ? 'text-xs' : 'text-xs';

  return (
    <>
      {/* 三欄屬性矩陣 (MAPS Pattern — 一致模型) */}
      <div className={`grid grid-cols-3 gap-1.5 pt-1.5 border-t border-white/5 text-xs`}>
        {/* 頻寬門檻 */}
        <div className={`${cellPad} rounded-lg bg-black/40 text-center min-w-0`}>
          <span className={`text-slate-500 block ${labelSize} whitespace-nowrap`}>頻寬門檻</span>
          <span className={`font-black break-words leading-tight block ${valueSize} ${BANDWIDTH_META[card.bandwidth].color}`}>
            {BANDWIDTH_META[card.bandwidth].compactLabel}
          </span>
        </div>

        {/* 通訊距離 */}
        <div
          className={`${cellPad} rounded-lg bg-black/40 text-center min-w-0`}
          title={`通訊距離: ${rangeInfo.fullLabel} (${rangeInfo.desc})`}
        >
          <span className={`text-slate-500 block ${labelSize} whitespace-nowrap`}>通訊距離</span>
          <span className={`font-bold text-slate-200 break-words leading-tight block ${valueSize}`}>
            {rangeInfo.label}
          </span>
        </div>

        {/* 運作耗電 */}
        <div className={`${cellPad} rounded-lg bg-black/40 text-center min-w-0`}>
          <span className={`text-slate-500 block ${labelSize} whitespace-nowrap`}>運作耗電</span>
          <span className={`font-bold text-amber-300 break-words leading-tight block ${valueSize}`}>
            {card.powerCost === 0 ? '0⚡ 免電' : `${card.powerCost}⚡`}
          </span>
        </div>
      </div>

      {/* 防護徽章列 (MAPS Minimal — 僅顯示具備的防護特性) */}
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
    </>
  );
}
