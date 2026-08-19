import React, { useEffect } from 'react';
import { Player } from '../../types/game';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Shield, Radio, Flame } from 'lucide-react';

interface GameOverModalProps {
  winner: Player | null;
  players: Player[];
  targetScore: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  players,
  targetScore,
  onRestart,
}) => {
  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [winner]);

  if (!winner) return null;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl border border-amber-500/50 bg-slate-950 p-6 shadow-2xl overflow-hidden flex flex-col text-center">
        {/* Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 mx-auto mb-3 shadow-lg shadow-amber-500/30 flex items-center justify-center text-slate-950">
          <Trophy className="w-9 h-9" />
        </div>

        <h2 className="text-xl font-black font-orbitron text-slate-100 mb-1">
          作戰任務圓滿達成！
        </h2>
        <p className="text-xs text-amber-400 font-mono mb-4">
          冠軍指揮官：【{winner.name}】以 {winner.score} VP 奪得全場最高榮譽！
        </p>

        {/* Leaderboard Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 mb-4 text-left font-mono text-xs">
          <span className="text-[10px] text-slate-400 block mb-2">最終戰績排名榜:</span>
          <div className="space-y-1.5">
            {sortedPlayers.map((p, rank) => (
              <div
                key={p.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  rank === 0
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-black/30 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-400">#{rank + 1}</span>
                  <span className="text-lg">{p.avatar}</span>
                  <div>
                    <h4 className="font-bold text-slate-100">{p.name}</h4>
                    <span className="text-[10px] text-slate-400">
                      連通成功 {p.stats.transmissions} 次 · 應變觸發 {p.stats.fallbacksTriggered} 次
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-amber-400">{p.score}</span>
                  <span className="text-[10px] text-slate-400 block">VP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black font-mono text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重新開始新的戰局</span>
        </button>
      </div>
    </div>
  );
};
