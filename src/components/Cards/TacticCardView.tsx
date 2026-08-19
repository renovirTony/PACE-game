import React from 'react';
import { TacticCard } from '../../types/game';
import { IconRenderer } from '../Common/IconRenderer';

interface TacticCardViewProps {
  card: TacticCard;
  isHand?: boolean;
  onAction?: () => void;
  canAfford?: boolean;
  disabled?: boolean;
}

export const TacticCardView: React.FC<TacticCardViewProps> = ({
  card,
  isHand = false,
  onAction,
  canAfford = true,
  disabled = false,
}) => {
  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-purple-500/40 bg-gradient-to-b from-purple-950/40 to-slate-950 p-3 shadow-md hover:border-purple-400/80 transition-all">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            戰術支援
          </span>
          {!isHand && (
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">
              {card.cost} 💰
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/30 shrink-0">
            <IconRenderer name={card.iconName} className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-100 leading-snug">{card.name}</h4>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed mb-2 bg-black/30 p-1.5 rounded border border-white/5">
          {card.description}
        </p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          disabled={disabled || (!isHand && !canAfford)}
          className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1 ${
            isHand
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow shadow-purple-500/20 active:scale-[0.98]'
              : canAfford && !disabled
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <span>{isHand ? '啟動戰術' : '購買戰術卡'}</span>
        </button>
      )}
    </div>
  );
};
