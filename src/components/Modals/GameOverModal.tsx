import React, { useEffect } from 'react';
import { Player } from '../../types/game';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface GameOverModalProps {
  winner: Player | null;
  players: Player[];
  targetScore?: number;
  onRestart: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  players,
  onRestart,
  onReturnToMenu,
}) => {
  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 120,
        spread: 80,
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

        <h2 className="text-xl sm:text-2xl font-black font-orbitron text-slate-100 mb-1">
          作戰任務圓滿達成！
        </h2>
        <p className="text-xs sm:text-sm text-amber-400 font-mono mb-4">
          冠軍指揮官：【{winner.name}】以 {winner.score} VP 奪得全場最高榮譽！
        </p>

        {/* Leaderboard Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 mb-5 text-left font-mono text-xs sm:text-sm">
          <span className="text-xs text-slate-400 block mb-2 font-bold">最終戰績排名榜:</span>
          <div className="space-y-2">
            {sortedPlayers.map((p, rank) => (
              <div
                key={p.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  rank === 0
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-black/30 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-400">#{rank + 1}</span>
                  <span className="text-xl">{p.avatar}</span>
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{p.name}</h4>
                    <span className="text-[11px] sm:text-xs text-slate-400 block mt-0.5">
                      連通成功 {p.stats.transmissions} 次 · 觸發備援 {p.stats.fallbacksTriggered} 次
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-amber-400">{p.score}</span>
                  <span className="text-xs text-slate-400 block">VP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: Restart with same settings OR Return to Menu */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black font-mono text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>以當前設定再玩一局</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold font-mono text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>回到主選單配置人數</span>
          </button>
        </div>
      </div>
    </div>
  );
};
