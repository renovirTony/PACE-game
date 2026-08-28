import React, { useState } from 'react';
import { Player, WorldviewType } from '../../types/game';
import { Radio, Sparkles, Globe, Shield, RefreshCw, Zap, Coins, Award, Layers, BookOpen, GraduationCap, AlertTriangle, X } from 'lucide-react';

interface V2TurnHeaderProps {
  round: number;
  maxRounds: number;
  targetScore: number;
  activePlayer: Player;
  isAI: boolean;
  worldview: WorldviewType;
  onChangeWorldview: (wv: WorldviewType) => void;
  onSwitchToV1?: () => void;
  onReturnToMenu: () => void;
  onOpenCompendium: () => void;
  onOpenGuide: () => void;
  onStartTutorial: () => void;
  roomCode?: string;
}

export function V2TurnHeader({
  round,
  maxRounds,
  targetScore,
  activePlayer,
  isAI,
  worldview,
  onChangeWorldview,
  onSwitchToV1,
  onReturnToMenu,
  onOpenCompendium,
  onOpenGuide,
  onStartTutorial,
  roomCode,
}: V2TurnHeaderProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const worldviewLabels: Record<WorldviewType, { label: string; icon: string }> = {
    CivilDefense: { label: '社區民防自救', icon: '🏠' },
    IslandResilience: { label: '海島極端天災', icon: '🌊' },
    CyberDisconnect: { label: '大斷網廢土', icon: '⚡' },
  };

  const handleSafeReturnToMenu = () => {
    setConfirmDialog({
      isOpen: true,
      title: '確定返回主選單？',
      message: '返回主選單將會結束當前演習並遺失進行中的作戰進度。確定要返回嗎？',
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        onReturnToMenu();
      },
    });
  };

  const handleSafeSwitchToV1 = () => {
    setConfirmDialog({
      isOpen: true,
      title: '切換至經典 v1.0 對照？',
      message: '即將切換至經典原版 v1.0。當前的 v2 演習進度將會重置。確定要切換嗎？',
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        if (onSwitchToV1) onSwitchToV1();
      },
    });
  };

  const handleSafeStartTutorial = () => {
    setConfirmDialog({
      isOpen: true,
      title: '啟動實戰新手教學？',
      message: '啟動新手教學將會重置當前戰局並開啟 8 步驟手把手引導。確定要開始教學嗎？',
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        onStartTutorial();
      },
    });
  };

  return (
    <header className="rounded-3xl border border-cyan-500/30 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3 font-mono relative">
      {/* Top Bar: Title, Worldview Switcher, Utility Tools, Version Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wider text-slate-100 font-orbitron">
                PACE <span className="text-cyan-400">通訊先鋒 v2.0</span>
              </h1>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                自組防線 · 媒介獨立
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              真實民防應急通訊規劃 · 物理天災與 Fallback 降級演練
            </p>
          </div>
        </div>

        {/* Action Controls & Worldview Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Worldview Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <span className="text-slate-400 text-[10px] px-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> 世界觀:
            </span>
            {(['CivilDefense', 'IslandResilience', 'CyberDisconnect'] as WorldviewType[]).map((wv) => (
              <button
                key={wv}
                onClick={() => onChangeWorldview(wv)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  worldview === wv
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {worldviewLabels[wv].icon} {worldviewLabels[wv].label}
              </button>
            ))}
          </div>

          {/* Quick Utility Tools: Compendium, Guide, Tutorial */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={onOpenCompendium}
              className="px-2 py-1 rounded-lg hover:bg-purple-950 text-purple-300 flex items-center gap-1 text-[11px] font-bold transition-all"
              title="查看卡牌圖鑑 (不中斷演習)"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">全圖鑑</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="px-2 py-1 rounded-lg hover:bg-cyan-950 text-cyan-300 flex items-center gap-1 text-[11px] font-bold transition-all"
              title="查看 PACE 原理說明 (不中斷演習)"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">說明手冊</span>
            </button>

            <button
              onClick={handleSafeStartTutorial}
              className="px-2 py-1 rounded-lg hover:bg-amber-950 text-amber-300 flex items-center gap-1 text-[11px] font-bold transition-all"
              title="啟動新手教學"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">新手教學</span>
            </button>
          </div>

          {/* Switch to V1 Button */}
          {onSwitchToV1 && (
            <button
              onClick={handleSafeSwitchToV1}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all active:scale-95"
              title="切換回經典原版 v1.0 進行對照"
            >
              🏛️ 經典 v1.0 對照
            </button>
          )}

          {/* Return to Menu */}
          <button
            onClick={handleSafeReturnToMenu}
            className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-bold transition-all active:scale-95"
          >
            主選單
          </button>
        </div>
      </div>

      {/* Bottom Bar: Active Player Stats HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Round & Active Player */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">災難週期 (Round)</span>
            <span className="text-sm sm:text-base font-black text-cyan-400">
              第 {round} / {maxRounds} 輪
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xl">{activePlayer.avatar}</span>
            <div>
              <span className="text-xs sm:text-sm font-black text-slate-200 block">
                {activePlayer.name} {isAI && <span className="text-[10px] text-purple-400 font-normal">(AI 決策中)</span>}
              </span>
              <span className="text-[10px] text-slate-400">
                目標積分：🏆 {targetScore} 分
              </span>
            </div>
          </div>
        </div>

        {/* Right: Resources (AP, Energy, Credits, Score) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Action Points */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
            <span className="text-xs font-black">行動點 (AP):</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: activePlayer.maxActionPoints }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border ${
                    i < activePlayer.actionPoints
                      ? 'bg-cyan-400 border-cyan-300 shadow-sm shadow-cyan-400/50'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black">電量:</span>
            <span className="text-sm font-black">
              {activePlayer.energy} / {activePlayer.maxEnergy}⚡
            </span>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black">物資:</span>
            <span className="text-sm font-black">💰 {activePlayer.credits}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/50 text-purple-200">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-black">救援分:</span>
            <span className="text-sm font-black text-purple-300">🏆 {activePlayer.score}</span>
          </div>
        </div>
      </div>

      {/* Safe Action Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl border border-red-500/40 bg-slate-950 p-6 shadow-2xl flex flex-col gap-4 text-slate-100 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-950/60 border border-red-500/40">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-black text-slate-100">
                {confirmDialog.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-all"
              >
                取消並繼續遊戲
              </button>

              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-md active:scale-95"
              >
                確認離開
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
