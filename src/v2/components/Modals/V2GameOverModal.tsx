import React, { useEffect } from 'react';
import { Player, WorldviewType } from '../../types/game';
import confetti from 'canvas-confetti';
import { Award, Trophy, RotateCcw, Home, CheckCircle, AlertTriangle } from 'lucide-react';

interface V2GameOverModalProps {
  winner: Player | null;
  players: Player[];
  worldview: WorldviewType;
  onRestart: () => void;
  onReturnToMenu: () => void;
}

export function V2GameOverModal({
  winner,
  players,
  worldview,
  onRestart,
  onReturnToMenu,
}: V2GameOverModalProps) {
  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [winner]);

  if (!winner) return null;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl border border-purple-500/40 bg-slate-950 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-slate-100 text-center">
        {/* Trophy Icon */}
        <div className="mx-auto p-4 rounded-3xl bg-purple-950/80 border border-purple-500/50 text-purple-300 shadow-xl shadow-purple-950/50">
          <Trophy className="w-12 h-12 text-purple-400 animate-bounce" />
        </div>

        {/* Winner Announcement */}
        <div>
          <span className="text-xs font-bold text-cyan-400 block uppercase tracking-widest">
            演習圓滿結束 · 最終決算
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
            恭喜指揮官【{winner.name}】榮獲最高榮譽！
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            在極端天災與電磁衝擊中，以卓越的 PACE 備援規劃守住了通訊生命線。
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-300 text-left px-1">
            📊 各指揮官最終防衛戰報：
          </span>

          <div className="flex flex-col gap-1.5">
            {sortedPlayers.map((player, idx) => {
              // 媒介獨立性計算
              const usedMedia = Object.values(player.paceBoard)
                .filter(Boolean)
                .map((c) => c!.medium);
              const uniqueMedia = new Set(usedMedia).size;

              return (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    idx === 0
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm">#{idx + 1}</span>
                    <span className="text-base">{player.avatar}</span>
                    <span className="font-bold">{player.name}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[10px] text-slate-400">
                      媒介多樣: {uniqueMedia}/4
                    </span>
                    <span className="text-sm font-black text-purple-300">
                      🏆 {player.score} 分
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onRestart}
            className="py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新開始演習</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>返回主選單</span>
          </button>
        </div>
      </div>
    </div>
  );
}
