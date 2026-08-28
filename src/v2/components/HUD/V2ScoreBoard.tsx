import React from 'react';
import { Player } from '../../types/game';
import { Award, Trophy, Users } from 'lucide-react';

interface V2ScoreBoardProps {
  players: Player[];
  activePlayerId: string;
  targetScore: number;
}

export function V2ScoreBoard({
  players,
  activePlayerId,
  targetScore,
}: V2ScoreBoardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-mono flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
            各前進分隊防衛戰報與即時排行 (Leaderboard)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          優勝目標：🏆 {targetScore} 分
        </span>
      </div>

      {/* Players Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sorted.map((player, idx) => {
          const isActive = player.id === activePlayerId;
          const progressPercent = Math.min(100, Math.round((player.score / targetScore) * 100));

          // 媒介獨立性計算
          const usedMedia = Object.values(player.paceBoard)
            .filter(Boolean)
            .map(c => c!.medium);
          const uniqueMedia = new Set(usedMedia).size;

          return (
            <div
              key={player.id}
              className={`rounded-2xl border p-3 flex flex-col justify-between gap-2.5 transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
                  : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              {/* Top Row: Rank, Avatar, Name */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${
                    idx === 0 ? 'text-purple-400' : 'text-slate-500'
                  }`}>
                    #{idx + 1}
                  </span>
                  <span className="text-lg">{player.avatar}</span>
                  <span className="text-xs font-bold text-slate-100 truncate max-w-[120px]">
                    {player.name}
                  </span>
                </div>

                <span className="text-sm font-black text-purple-300">
                  🏆 {player.score}
                </span>
              </div>

              {/* Progress Bar towards Target */}
              <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                <span>媒介多樣性: <b className="text-cyan-300">{uniqueMedia}/4</b></span>
                <span>成功連通: <b className="text-slate-200">{player.stats.transmissions} 次</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
