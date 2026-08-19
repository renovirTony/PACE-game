import React from 'react';
import { Player } from '../../types/game';
import { Trophy, Award, Zap, Shield, Radio, Phone, Satellite } from 'lucide-react';

interface ScoreBoardProps {
  players: Player[];
  activePlayerId: string;
  targetScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, activePlayerId, targetScore }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-slate-200">指揮官積分排行 (Leaderboard)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">獲勝門檻: {targetScore} VP</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {players.map(p => {
          const isActive = p.id === activePlayerId;
          const progressPercent = Math.min(100, Math.round((p.score / targetScore) * 100));

          return (
            <div
              key={p.id}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-lg">
                    {p.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.credits} 💰 · {p.energy}/{p.maxEnergy} ⚡
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black font-mono text-amber-400">{p.score}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">VP</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* PACE Mini Slot Badges */}
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                <div
                  className={`py-0.5 rounded border ${
                    p.paceBoard.P
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                  title={p.paceBoard.P ? `[P] ${p.paceBoard.P.name}` : '[P] 未裝備'}
                >
                  P
                </div>
                <div
                  className={`py-0.5 rounded border ${
                    p.paceBoard.A
                      ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                  title={p.paceBoard.A ? `[A] ${p.paceBoard.A.name}` : '[A] 未裝備'}
                >
                  A
                </div>
                <div
                  className={`py-0.5 rounded border ${
                    p.paceBoard.C
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}
                  title={p.paceBoard.C ? `[C] ${p.paceBoard.C.name}` : '[C] 未裝備'}
                >
                  C
                </div>
                <div
                  className={`py-0.5 rounded border ${
                    p.paceBoard.E
                      ? 'bg-red-950 text-red-300 border-red-500/40'
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
