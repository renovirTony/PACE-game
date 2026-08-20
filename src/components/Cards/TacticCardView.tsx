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
      className={`relative flex flex-col justify-between rounded-2xl border transition-all p-3.5 shadow-md w-full ${
        highlight ? 'tutorial-spotlight ring-2 ring-purple-400' : 'border-purple-500/40 hover:border-purple-400/80'
      } bg-gradient-to-b from-purple-950/40 via-slate-950/90 to-slate-950`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <span className="px-2.5 py-0.5 text-xs font-bold font-mono rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
            戰術支援 · {card.type}
          </span>
          {!isHand && (
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 bg-amber-950/70 px-2.5 py-0.5 rounded-lg border border-amber-500/40 shadow-inner">
              <span className="text-slate-400 text-xs font-normal">需: </span>
              {card.cost} 💰
            </span>
          )}
          {isHand && (
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-lg border border-cyan-500/40">
              發動耗 1 AP
            </span>
          )}
        </div>

        <div className="flex items-start gap-2.5 mb-2">
          <div className="p-2.5 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-500/40 shrink-0 shadow-inner">
            <IconRenderer name={card.iconName} className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug break-words">{card.name}</h4>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/5 break-words">
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
          className={`w-full mt-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 shadow ${
            isHand
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25 active:scale-[0.98]'
              : canAfford && !disabled
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black shadow-cyan-500/25 active:scale-[0.98]'
              : 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
          }`}
        >
          <span>{isHand ? '啟動戰術 (消耗 1 AP)' : '購入手牌 (消耗 1 AP)'}</span>
        </button>
      )}
    </div>
  );
};
