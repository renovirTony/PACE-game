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
  selectedSlot?: PACESlot;
  onSlotSelect?: (slot: PACESlot) => void;
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
  compact = false
}) => {
  const slotTheme = SLOT_STYLES[card.slot];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border transition-all duration-200 overflow-hidden ${
        slotTheme.border
      } ${slotTheme.bg} ${
        isEquipped ? 'shadow-lg' : 'hover:scale-[1.02] shadow-md'
      } ${compact ? 'p-2.5 min-h-[140px]' : 'p-4 min-h-[220px]'}`}
    >
      {/* Top Header: Slot Tag & Cost */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 text-xs font-bold font-mono rounded tracking-wider border ${
                slotTheme.border
              } ${slotTheme.text} bg-black/40`}
            >
              [{card.slot}] {compact ? '' : slotTheme.label.split(' ')[0]}
            </span>
            {card.bonusVP ? (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                +{card.bonusVP} VP
              </span>
            ) : null}
          </div>

          {!isEquipped && (
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
              <span>{card.cost}</span>
              <span className="text-[10px]">💰</span>
            </div>
          )}
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-2 mb-2">
          <div className={`p-1.5 rounded-lg bg-black/40 ${slotTheme.text} border border-white/5 shrink-0`}>
            <IconRenderer name={card.iconName} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 leading-snug line-clamp-1">{card.name}</h4>
            <p className="text-[11px] text-slate-400 font-mono">{card.category}</p>
          </div>
        </div>

        {/* Specs: Bandwidth, Range, Power */}
        <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-lg bg-black/30 text-[11px] font-mono mb-2 border border-white/5">
          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-400 text-[10px]">頻寬</span>
            <span className={`font-semibold ${card.bandwidth === 'High' ? 'text-emerald-400' : card.bandwidth === 'Medium' ? 'text-cyan-300' : 'text-slate-300'}`}>
              {card.bandwidth}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center border-x border-white/10">
            <span className="text-slate-400 text-[10px]">距離</span>
            <span className="font-semibold text-slate-200">{card.range}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-400 text-[10px]">耗電</span>
            <span className="font-semibold text-amber-400 flex items-center gap-0.5">
              {card.powerCost} <Zap className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Resilience Perks */}
        <div className="flex flex-wrap gap-1 mb-2">
          {card.resilience.empShield && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              <Shield className="w-2.5 h-2.5 text-cyan-400" /> 抗EMP
            </span>
          )}
          {card.resilience.weatherResistant && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
              <CloudLightning className="w-2.5 h-2.5 text-blue-400" /> 全天候
            </span>
          )}
          {card.resilience.subterranean && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              <Activity className="w-2.5 h-2.5 text-emerald-400" /> 地底穿透
            </span>
          )}
        </div>

        {!compact && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2 bg-slate-900/40 p-1.5 rounded">
            {card.effectDesc}
          </p>
        )}
      </div>

      {/* Action Button */}
      {onBuy && (
        <button
          onClick={onBuy}
          disabled={disabled || !canAfford}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow ${
            canAfford && !disabled
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <span>裝備至 [{card.slot}] 槽位</span>
        </button>
      )}
    </div>
  );
};
