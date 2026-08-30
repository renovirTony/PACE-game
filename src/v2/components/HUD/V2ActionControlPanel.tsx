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
  const canActWithAP = isCurrentPlayer && !isAI && player.actionPoints > 0;
  const canPlayTactic = isCurrentPlayer && !isAI;
  const canRecharge = canActWithAP && player.energy < player.maxEnergy;

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
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-400" /> 手牌戰術卡 ({player.handTactics.length} 張)
          </span>
          <span className="text-[10px] text-purple-400 font-bold">
            ⚡ 手牌戰術打出為 0 AP 即時生效！
          </span>
        </div>

        {player.handTactics.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            手牌無戰術卡（可至右側市場採購）
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {player.handTactics.map((tactic) => {
              const content = tactic.translations[worldview];
              return (
                <div
                  key={tactic.id}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-purple-300">
                        {content?.name}
                      </span>
                      {tactic.effectType === 'RECHARGE_BATTERY' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-950 text-amber-300 border border-amber-500/30">
                          ⚡ +{tactic.value || 3} 電力
                        </span>
                      )}
                      {tactic.effectType === 'AIRDROP_CREDITS' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          💰 +{tactic.value || 3} 物資
                        </span>
                      )}
                      {tactic.effectType === 'DEPLOY_ANTENNA' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-950 text-blue-300 border border-blue-500/30">
                          📡 距離 +1
                        </span>
                      )}
                      {tactic.effectType === 'FARADAY_SHIELD' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-950 text-blue-300 border border-blue-500/30">
                          🛡️ 免疫 EMP
                        </span>
                      )}
                      {tactic.effectType === 'COMMUNITY_RELAY' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          👥 降級減半
                        </span>
                      )}
                      {tactic.effectType === 'SCOUT_AHEAD' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-950 text-purple-300 border border-purple-500/30">
                          🔍 偵察 +1⚡+1💰
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {content?.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onPlayTactic(tactic)}
                    disabled={!canPlayTactic}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
                      canPlayTactic
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                        : 'bg-slate-900 text-slate-600 opacity-50 cursor-not-allowed border border-slate-800'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>即時發動 (0 AP)</span>
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
