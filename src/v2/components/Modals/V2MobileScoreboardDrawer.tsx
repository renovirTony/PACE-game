import React from 'react';
import { Player } from '../../types/game';
import { Trophy, X, Shield, Radio, CheckCircle, Flame } from 'lucide-react';

interface V2MobileScoreboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  activePlayerId: string;
  targetScore: number;
}

export function V2MobileScoreboardDrawer({
  isOpen,
  onClose,
  players,
  activePlayerId,
  targetScore,
}: V2MobileScoreboardDrawerProps) {
  if (!isOpen) return null;

  // Sort players by score descending
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const highestScore = sorted[0]?.score || 0;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fadeIn font-mono">
      {/* Click backdrop to dismiss */}
      <div onClick={onClose} className="flex-1" />

      {/* Slide-up BottomSheet Body */}
      <div className="w-full max-w-lg mx-auto rounded-t-3xl border-t border-purple-500/40 bg-slate-950 p-4 shadow-2xl flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto animate-slideUp text-slate-100">
        {/* Drag Handle Bar */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                <span>全員作戰救援進度</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                  優勝目標 {targetScore} 分
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                點擊空白處或向下滑動關閉 · 即時同步全體戰況
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Players Leaderboard List */}
        <div className="flex flex-col gap-2">
          {sorted.map((player, idx) => {
            const isActive = player.id === activePlayerId;
            const isLeader = player.score > 0 && player.score === highestScore;
            const progressPercent = Math.min(100, Math.round((player.score / targetScore) * 100));

            // Count equipped slots
            const equippedCount = Object.values(player.paceBoard).filter(Boolean).length;

            return (
              <div
                key={player.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 ${
                  isActive
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                {/* Row 1: Rank, Avatar, Name, Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-black shrink-0 ${
                      idx === 0 ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="text-base shrink-0">{player.avatar}</span>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-black text-slate-100 truncate">
                        {player.name}
                      </span>
                      {isActive && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[9px] font-bold shrink-0">
                          行動中
                        </span>
                      )}
                      {isLeader && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-950 border border-amber-500/40 text-amber-300 text-[9px] font-bold shrink-0 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> 領先
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 shrink-0 ml-2">
                    <span className="text-base font-black text-purple-300">
                      🏆 {player.score}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      /{targetScore}
                    </span>
                  </div>
                </div>

                {/* Progress Bar towards Target */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLeader
                        ? 'bg-gradient-to-r from-amber-500 to-purple-500'
                        : isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Row 2: Tactical Details */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                  <span>防線配置: <b className="text-cyan-300">{equippedCount}/4 槽</b></span>
                  <span>通訊成功: <b className="text-slate-200">{player.stats.transmissions} 次</b></span>
                  <span>物資存量: <b className="text-emerald-300">💰 {player.credits}</b></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs transition-all active:scale-[0.98] mt-1"
        >
          返回作戰盤面
        </button>
      </div>
    </div>
  );
}
