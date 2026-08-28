import React from 'react';
import { Player, TacticCard, WorldviewType } from '../../types/game';
import { Zap, Play, ArrowRight, Shield } from 'lucide-react';

interface V2ActionControlPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
  isAI: boolean;
  worldview: WorldviewType;
  onPlayTactic: (card: TacticCard) => boolean;
  onRecharge: () => boolean;
  onEndTurn: () => void;
}

export function V2ActionControlPanel({
  player,
  isCurrentPlayer,
  isAI,
  worldview,
  onPlayTactic,
  onRecharge,
  onEndTurn,
}: V2ActionControlPanelProps) {
  const canAct = isCurrentPlayer && !isAI && player.actionPoints > 0;
  const canRecharge = canAct && player.energy < player.maxEnergy;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-mono flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          行動與手牌戰術 (Actions & Tactics)
        </h3>
        <span className="text-xs text-slate-400">
          剩餘 AP: <span className="font-bold text-cyan-400">{player.actionPoints}</span>
        </span>
      </div>

      {/* Quick Field Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recharge Action */}
        <button
          onClick={onRecharge}
          disabled={!canRecharge}
          className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
            canRecharge
              ? 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/40 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>緊急野戰充電 (+2 ⚡ | 1 AP)</span>
        </button>

        {/* End Turn Action */}
        <button
          onClick={onEndTurn}
          disabled={!isCurrentPlayer || isAI}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <span>結束作戰回合 (End Turn)</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Hand Tactics Section */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-purple-400" /> 手牌戰術卡 ({player.handTactics.length} 張)
        </span>

        {player.handTactics.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            手牌無戰術卡（可至市場採購）
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {player.handTactics.map((tactic) => {
              const content = tactic.translations[worldview];
              return (
                <div
                  key={tactic.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-purple-300">
                      {content?.name}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {content?.desc}
                    </span>
                  </div>

                  <button
                    onClick={() => onPlayTactic(tactic)}
                    disabled={!canAct}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      canAct
                        ? 'bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    發動 (1 AP)
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
