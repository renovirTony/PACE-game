import React from 'react';
import { Player } from '../../types/game';
import { Trophy } from 'lucide-react';

interface ScoreBoardProps {
  players: Player[];
  activePlayerId: string;
  targetScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, activePlayerId, targetScore }) => {
  // Sort players by score for rank badges
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">指揮官戰術積分排行 (Leaderboard)</span>
        </div>
        <span className="text-xs font-mono text-amber-300 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
          勝出門檻: {targetScore} VP
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {players.map(p => {
          const isActive = p.id === activePlayerId;
          const rankIndex = sortedPlayers.findIndex(sp => sp.id === p.id);
          const rankBadge = rankIndex === 0 ? '🥇' : rankIndex === 1 ? '🥈' : rankIndex === 2 ? '🥉' : `#${rankIndex + 1}`;
          const progressPercent = Math.min(100, Math.round((p.score / targetScore) * 100));

          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-slate-900/95 border-cyan-500/70 shadow-lg shadow-cyan-950/50 ring-2 ring-cyan-400/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-inner">
                      {p.avatar}
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 text-xs">{rankBadge}</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1">
                      <span>{p.name}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {p.credits} 💰 · {p.energy}/{p.maxEnergy} ⚡
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base sm:text-lg font-black font-mono text-amber-400">{p.score}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">VP</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 mb-2.5 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-amber-400 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* PACE Mini Slot Badges */}
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono text-center font-bold">
                <div
                  className={`py-1 rounded-lg border transition-all ${
                    p.paceBoard.P
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                  title={p.paceBoard.P ? `[P] ${p.paceBoard.P.name}` : '[P] 未裝備'}
                >
                  P
                </div>
                <div
                  className={`py-1 rounded-lg border transition-all ${
                    p.paceBoard.A
                      ? 'bg-blue-950 text-blue-300 border-blue-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                  title={p.paceBoard.A ? `[A] ${p.paceBoard.A.name}` : '[A] 未裝備'}
                >
                  A
                </div>
                <div
                  className={`py-1 rounded-lg border transition-all ${
                    p.paceBoard.C
                      ? 'bg-amber-950 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                  title={p.paceBoard.C ? `[C] ${p.paceBoard.C.name}` : '[C] 未裝備'}
                >
                  C
                </div>
                <div
                  className={`py-1 rounded-lg border transition-all ${
                    p.paceBoard.E
                      ? 'bg-red-950 text-red-300 border-red-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                  title={p.paceBoard.E ? `[E] ${p.paceBoard.E.name}` : '[E] 未裝備'}
                >
                  E
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
