import React from 'react';
import { Player, TacticCard } from '../../types/game';
import { SkipForward, BatteryCharging } from 'lucide-react';
import { TacticCardView } from '../Cards/TacticCardView';

interface ActionControlPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
  isAI: boolean;
  onPlayTactic: (card: TacticCard) => boolean;
  onRecharge: () => boolean;
  onEndTurn: () => void;
  tutorialHighlightRecharge?: boolean;
  tutorialHighlightTactic?: boolean;
  tutorialHighlightEndTurn?: boolean;
}

export const ActionControlPanel: React.FC<ActionControlPanelProps> = ({
  player,
  isCurrentPlayer,
  isAI,
  onPlayTactic,
  onRecharge,
  onEndTurn,
  tutorialHighlightRecharge = false,
  tutorialHighlightTactic = false,
  tutorialHighlightEndTurn = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md flex flex-col gap-3.5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        {/* Action Points Gauge */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">本回合行動點數 (AP):</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: player.maxActionPoints }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono border transition-all ${
                  i < player.actionPoints
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Recharge Button */}
          <button
            onClick={onRecharge}
            disabled={!isCurrentPlayer || isAI || player.actionPoints <= 0 || player.energy >= player.maxEnergy}
            className={`flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold font-mono flex items-center justify-center gap-2 border transition-all ${
              tutorialHighlightRecharge ? 'tutorial-spotlight ring-2 ring-amber-400' : ''
            } ${
              isCurrentPlayer && !isAI && player.actionPoints > 0 && player.energy < player.maxEnergy
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 active:scale-95'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <BatteryCharging className="w-4 h-4 text-amber-400" />
            <span>野戰充能 (+2⚡) [1 AP]</span>
          </button>

          {/* End Turn Button */}
          <button
            onClick={onEndTurn}
            disabled={!isCurrentPlayer || isAI}
            className={`flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono flex items-center justify-center gap-2 transition-all shadow ${
              tutorialHighlightEndTurn ? 'tutorial-spotlight ring-2 ring-red-400' : ''
            } ${
              isCurrentPlayer && !isAI
                ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-amber-500/20 active:scale-95'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <SkipForward className="w-4 h-4" />
            <span>結束本回合</span>
          </button>
        </div>
      </div>

      {/* Hand Tactics */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-mono font-bold text-purple-300 flex items-center gap-1.5">
            <span>戰術手牌 ({player.handTactics.length}/4)</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">點擊卡牌啟動戰術效果 (消耗 1 AP)</span>
        </div>

        {player.handTactics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {player.handTactics.map(tactic => (
              <TacticCardView
                key={tactic.id}
                card={tactic}
                isHand={true}
                highlight={tutorialHighlightTactic}
                disabled={!isCurrentPlayer || isAI || player.actionPoints <= 0}
                onAction={() => onPlayTactic(tactic)}
              />
            ))}
          </div>
        ) : (
          <div className="py-4 px-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs sm:text-sm font-mono">
            手牌為空，可至下方商場採購戰術卡
          </div>
        )}
      </div>
    </div>
  );
};
