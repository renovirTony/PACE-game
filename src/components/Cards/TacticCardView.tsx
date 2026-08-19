import React from 'react';
import { TacticCard } from '../../types/game';
import { IconRenderer } from '../Common/IconRenderer';

interface TacticCardViewProps {
  card: TacticCard;
  isHand?: boolean;
  onAction?: () => void;
  canAfford?: boolean;
  disabled?: boolean;
  highlight?: boolean;
}

export const TacticCardView: React.FC<TacticCardViewProps> = ({
  card,
  isHand = false,
  onAction,
  canAfford = true,
  disabled = false,
  highlight = false,
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border transition-all p-3.5 shadow-md w-full ${
        highlight ? 'tutorial-spotlight ring-2 ring-purple-400' : 'border-purple-500/40 hover:border-purple-400'
      } bg-gradient-to-b from-purple-950/40 to-slate-950`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            戰術支援
          </span>
          {!isHand && (
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
              {card.cost} 💰
            </span>
          )}
        </div>

        <div className="flex items-start gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/30 shrink-0">
            <IconRenderer name={card.iconName} className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug break-words">{card.name}</h4>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2 bg-black/40 p-2.5 rounded-lg border border-white/5 break-words">
          {card.description}
        </p>

        {card.flavorText && (
          <p className="text-xs text-purple-300/80 italic leading-normal mb-3 pl-1 break-words">
            "{card.flavorText}"
          </p>
        )}
      </div>

      {onAction && (
        <button
          onClick={onAction}
          disabled={disabled || (!isHand && !canAfford)}
          className={`w-full mt-2 py-2 px-2.5 rounded-lg text-xs sm:text-sm font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1 shadow ${
            isHand
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25 active:scale-[0.98]'
              : canAfford && !disabled
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <span>{isHand ? '啟動戰術 (消耗 1 AP)' : '購買戰術卡'}</span>
        </button>
      )}
    </div>
  );
};
