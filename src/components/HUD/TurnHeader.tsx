import React, { useState } from 'react';
import { Player, FontSizeMode } from '../../types/game';
import { Radio, Volume2, VolumeX, BookOpen, Shield, Home, Type, GraduationCap, Layers } from 'lucide-react';
import { audioManager } from '../../engine/audio';

interface TurnHeaderProps {
  round: number;
  maxRounds: number;
  targetScore: number;
  activePlayer: Player;
  isAI: boolean;
  isTutorialMode?: boolean;
  fontSize: FontSizeMode;
  onChangeFontSize: (size: FontSizeMode) => void;
  onOpenTutorial: () => void;
  onOpenGuide: () => void;
  onOpenCompendium: () => void;
  onReturnToMenu: () => void;
}

export const TurnHeader: React.FC<TurnHeaderProps> = ({
  round,
  maxRounds,
  targetScore,
  activePlayer,
  isAI,
  isTutorialMode = false,
  fontSize,
  onChangeFontSize,
  onOpenTutorial,
  onOpenGuide,
  onOpenCompendium,
  onReturnToMenu,
}) => {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());

  const handleToggleMute = () => {
    const nextState = audioManager.toggleMute();
    setIsMuted(nextState);
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') onChangeFontSize('large');
    else if (fontSize === 'large') onChangeFontSize('xlarge');
    else onChangeFontSize('normal');
  };

  return (
    <header className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-xl backdrop-blur-md flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
      {/* Game Logo & Round Status */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-xl font-black tracking-wider text-slate-100 font-orbitron">
              PACE <span className="text-cyan-400">COMMS PROTOCOL</span>
            </h1>
            {isTutorialMode ? (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/50 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> 實戰新手引導
              </span>
            ) : (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                戰術通訊桌遊
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
            {isTutorialMode ? (
              <span className="text-cyan-300 font-bold">教學模式：跟隨畫面指引完成 7 步核心操作</span>
            ) : (
              <>
                目標積分: <span className="text-amber-400 font-bold">{targetScore} VP</span> 獲勝 · 當前第{' '}
                <span className="text-cyan-400 font-bold">{round}</span> / {maxRounds} 回合
              </>
            )}
          </p>
        </div>
      </div>

      {/* Active Commander Indicator */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 self-stretch xl:self-auto justify-between xl:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-2xl">
            {activePlayer.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-mono">目前行動指揮官:</span>
              {isAI && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-mono">
                  BOT
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-100">{activePlayer.name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-800 text-xs sm:text-sm font-mono">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">戰術積分</span>
            <span className="font-bold text-amber-400 text-base">{activePlayer.score} VP</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Font Size, Sound, Rulebook, PACE Guide, Home */}
      <div className="flex items-center gap-2 flex-wrap w-full xl:w-auto justify-end">
        {/* Font Size Adjuster */}
        <button
          onClick={cycleFontSize}
          title={`目前字體大小: ${fontSize === 'normal' ? '標準' : fontSize === 'large' ? '大' : '特大'} (點擊切換)`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs sm:text-sm font-mono font-bold transition-all"
        >
          <Type className="w-4 h-4" />
          <span>字體: {fontSize === 'normal' ? '標準' : fontSize === 'large' ? '大' : '特大'}</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={handleToggleMute}
          title={isMuted ? '開啟戰術音效' : '靜音'}
          className={`p-2.5 rounded-xl border text-xs font-mono transition-all ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Card Compendium Modal */}
        <button
          onClick={onOpenCompendium}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-mono font-semibold transition-all"
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>卡片圖鑑</span>
        </button>

        {/* Rulebook Modal */}
        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-mono font-semibold transition-all"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>規則書</span>
        </button>

        {/* PACE Guide Modal */}
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-mono font-semibold transition-all"
        >
          <Shield className="w-4 h-4 text-blue-400" />
          <span>PACE原理</span>
        </button>

        {/* Home / Return to Menu */}
        <button
          onClick={onReturnToMenu}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-mono font-bold transition-all"
          title="回到主選單重新設定人數或模式"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>主選單</span>
        </button>
      </div>
    </header>
  );
};
