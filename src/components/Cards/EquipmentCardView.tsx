import React from 'react';
import { CommsCard, PACESlot, RangeType, BandwidthType } from '../../types/game';
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
  P: { bg: 'bg-cyan-950/70', text: 'text-cyan-400', border: 'border-cyan-500/50', label: '主要 Primary' },
  A: { bg: 'bg-blue-950/70', text: 'text-blue-400', border: 'border-blue-500/50', label: '備用 Alternate' },
  C: { bg: 'bg-amber-950/70', text: 'text-amber-400', border: 'border-amber-500/50', label: '應急 Contingency' },
  E: { bg: 'bg-red-950/70', text: 'text-red-400', border: 'border-red-500/50', label: '緊急 Emergency' },
};

const RANGE_LABELS: Record<RangeType, string> = {
  Local: '近距 (Local)',
  Tactical: '戰術 (Tactical)',
  Global: '全球 (Global)',
  Penetrating: '穿透 (Penetrating)',
};

const BANDWIDTH_LABELS: Record<BandwidthType, { text: string; color: string }> = {
  High: { text: '高頻寬', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' },
  Medium: { text: '中頻寬', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
  Low: { text: '低頻寬', color: 'text-slate-300 bg-slate-900 border-slate-700' },
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
  const bw = BANDWIDTH_LABELS[card.bandwidth];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border transition-all duration-200 overflow-hidden w-full ${
        highlight ? 'tutorial-spotlight ring-2 ring-cyan-400' : slotTheme.border
      } ${slotTheme.bg} ${
        isEquipped ? 'shadow-lg' : 'hover:scale-[1.01] shadow-md'
      } p-3.5 sm:p-4`}
    >
      <div>
        {/* Top Header: Slot Tag & Cost */}
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 text-xs font-bold font-mono rounded tracking-wider border ${
                slotTheme.border
              } ${slotTheme.text} bg-black/50`}
            >
              [{card.slot}] {slotTheme.label.split(' ')[0]}
            </span>
            {card.bonusVP ? (
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                +{card.bonusVP} VP
              </span>
            ) : null}
          </div>

          {!isEquipped && (
            <div className="flex items-center gap-1 text-xs sm:text-sm font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/40 shrink-0">
              <span>{card.cost}</span>
              <span className="text-xs">💰</span>
            </div>
          )}
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className={`p-2 rounded-lg bg-black/50 ${slotTheme.text} border border-white/10 shrink-0`}>
            <IconRenderer name={card.iconName} className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug break-words">{card.name}</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5 break-words">{card.category}</p>
          </div>
        </div>

        {/* Specs: Bandwidth, Range, Power in clear responsive pill chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5 text-xs font-mono">
          <span className={`px-2 py-0.5 rounded border font-semibold ${bw.color}`}>
            {bw.text}
          </span>
          <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900/80 text-slate-200">
            {RANGE_LABELS[card.range] || card.range}
          </span>
          <span className="px-2 py-0.5 rounded border border-amber-500/30 bg-amber-950/50 text-amber-300 flex items-center gap-1 font-bold">
            <Zap className="w-3 h-3 text-amber-400" />
            {card.powerCost} ⚡
          </span>
        </div>

        {/* Resilience Perks */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {card.resilience.empShield && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              <Shield className="w-3 h-3 text-cyan-400" /> 抗EMP
            </span>
          )}
          {card.resilience.weatherResistant && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/40">
              <CloudLightning className="w-3 h-3 text-blue-400" /> 全天候
            </span>
          )}
          {card.resilience.subterranean && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              <Activity className="w-3 h-3 text-emerald-400" /> 地底穿透
            </span>
          )}
        </div>

        {/* Full Effect Description */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2 bg-slate-900/70 p-2.5 rounded-lg border border-white/5 break-words">
          {card.effectDesc}
        </p>

        {!compact && card.flavorText && (
          <p className="text-xs text-slate-400/90 italic leading-normal mb-3 pl-1 break-words">
            "{card.flavorText}"
          </p>
        )}
      </div>

      {/* Action Button */}
      {onBuy && (
        <button
          onClick={onBuy}
          disabled={disabled || !canAfford}
          className={`w-full mt-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow ${
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
