import React from 'react';
import { CommsCard, PACESlot } from '../../types/game';
import { IconRenderer } from '../Common/IconRenderer';
import { Shield, Zap, CloudLightning, Activity } from 'lucide-react';

interface EquipmentCardViewProps {
  card: CommsCard;
  isEquipped?: boolean;
  onBuy?: () => void;
  canAfford?: boolean;
  disabled?: boolean;
  compact?: boolean;
  highlight?: boolean;
}

const SLOT_STYLES: Record<PACESlot, { bg: string; text: string; border: string; label: string }> = {
  P: { bg: 'bg-cyan-950/80', text: 'text-cyan-400', border: 'border-cyan-500/50', label: '主要 (Primary)' },
  A: { bg: 'bg-blue-950/80', text: 'text-blue-400', border: 'border-blue-500/50', label: '備用 (Alternate)' },
  C: { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-500/50', label: '應急 (Contingency)' },
  E: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-500/50', label: '緊急 (Emergency)' },
};

export const EquipmentCardView: React.FC<EquipmentCardViewProps> = ({
  card,
  isEquipped = false,
  onBuy,
  canAfford = true,
  disabled = false,
  compact = false,
  highlight = false,
}) => {
  const slotTheme = SLOT_STYLES[card.slot];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border transition-all duration-200 overflow-hidden ${
        highlight ? 'tutorial-spotlight ring-2 ring-cyan-400' : slotTheme.border
      } ${slotTheme.bg} ${
        isEquipped ? 'shadow-lg' : 'hover:scale-[1.01] shadow-md'
      } ${compact ? 'p-3 min-h-[160px]' : 'p-4 min-h-[260px]'}`}
    >
      {/* Top Header: Slot Tag & Cost */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-1 text-xs font-bold font-mono rounded tracking-wider border ${
                slotTheme.border
              } ${slotTheme.text} bg-black/50`}
            >
              [{card.slot}] {slotTheme.label.split(' ')[0]}
            </span>
            {card.bonusVP ? (
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                +{card.bonusVP} VP
              </span>
            ) : null}
          </div>

          {!isEquipped && (
            <div className="flex items-center gap-1 text-xs sm:text-sm font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/40">
              <span>{card.cost}</span>
              <span className="text-xs">💰</span>
            </div>
          )}
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className={`p-2 rounded-lg bg-black/40 ${slotTheme.text} border border-white/10 shrink-0`}>
            <IconRenderer name={card.iconName} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">{card.name}</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{card.category}</p>
          </div>
        </div>

        {/* Specs: Bandwidth, Range, Power */}
        <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-black/40 text-xs font-mono mb-2.5 border border-white/10">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 text-[11px]">頻寬</span>
            <span className={`font-bold text-xs sm:text-sm ${card.bandwidth === 'High' ? 'text-emerald-400' : card.bandwidth === 'Medium' ? 'text-cyan-300' : 'text-slate-300'}`}>
              {card.bandwidth}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-x border-white/10">
            <span className="text-slate-400 text-[11px]">距離</span>
            <span className="font-bold text-xs sm:text-sm text-slate-200">{card.range}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-slate-400 text-[11px]">耗電</span>
            <span className="font-bold text-xs sm:text-sm text-amber-400 flex items-center gap-0.5">
              {card.powerCost} <Zap className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Resilience Perks */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {card.resilience.empShield && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              <Shield className="w-3 h-3 text-cyan-400" /> 抗EMP
            </span>
          )}
          {card.resilience.weatherResistant && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
              <CloudLightning className="w-3 h-3 text-blue-400" /> 全天候
            </span>
          )}
          {card.resilience.subterranean && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              <Activity className="w-3 h-3 text-emerald-400" /> 地底穿透
            </span>
          )}
        </div>

        {/* Full Effect Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2 bg-slate-900/60 p-2 rounded-lg border border-white/5">
          {card.effectDesc}
        </p>

        {!compact && (
          <p className="text-xs text-slate-400/90 italic leading-normal mb-3 pl-1">
            "{card.flavorText}"
          </p>
        )}
      </div>

      {/* Action Button */}
      {onBuy && (
        <button
          onClick={onBuy}
          disabled={disabled || !canAfford}
          className={`w-full py-2 px-3 rounded-lg text-xs sm:text-sm font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow ${
            canAfford && !disabled
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <span>裝備至 [{card.slot}] 槽位 (消耗 1 AP)</span>
        </button>
      )}
    </div>
  );
};
