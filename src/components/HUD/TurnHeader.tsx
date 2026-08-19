import React, { useState } from 'react';
import { Player } from '../../types/game';
import { Radio, Volume2, VolumeX, BookOpen, Info, Shield, Trophy } from 'lucide-react';
import { audioManager } from '../../engine/audio';

interface TurnHeaderProps {
  round: number;
  maxRounds: number;
  targetScore: number;
  activePlayer: Player;
  isAI: boolean;
  onOpenTutorial: () => void;
  onOpenGuide: () => void;
}

export const TurnHeader: React.FC<TurnHeaderProps> = ({
  round,
  maxRounds,
  targetScore,
  activePlayer,
  isAI,
  onOpenTutorial,
  onOpenGuide,
}) => {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());

  const handleToggleMute = () => {
    const nextState = audioManager.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <header className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Game Logo & Round Status */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-wider text-slate-100 font-orbitron">
              PACE <span className="text-cyan-400">COMMS PROTOCOL</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              戰術通訊桌遊 v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            目標積分: <span className="text-amber-400 font-bold">{targetScore} VP</span> 獲勝 · 當前第{' '}
            <span className="text-cyan-400 font-bold">{round}</span> / {maxRounds} 回合
          </p>
        </div>
      </div>

      {/* Active Commander Indicator */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 self-stretch md:self-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-xl">
            {activePlayer.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-mono">目前行動指揮官:</span>
              {isAI && (
                <span className="text-[9px] px-1 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-mono">
                  BOT
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-200">{activePlayer.name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">積分</span>
            <span className="font-bold text-amber-400">{activePlayer.score} VP</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Sound, Rulebook, Guide */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={handleToggleMute}
          title={isMuted ? '開啟戰術音效' : '靜音'}
          className={`p-2 rounded-xl border text-xs font-mono transition-all ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-semibold transition-all"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>遊戲規則</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-all"
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>PACE 原理指南</span>
        </button>
      </div>
    </header>
  );
};
