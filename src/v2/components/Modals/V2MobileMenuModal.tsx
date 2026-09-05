import React from 'react';
import { Sliders, BookOpen, Layers, GraduationCap, Landmark, Home, X } from 'lucide-react';

interface V2MobileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onOpenCompendium: () => void;
  onStartTutorial: () => void;
  onSwitchToV1?: () => void;
  onReturnToMenu: () => void;
}

export function V2MobileMenuModal({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenGuide,
  onOpenCompendium,
  onStartTutorial,
  onSwitchToV1,
  onReturnToMenu,
}: V2MobileMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex flex-col justify-end animate-fadeIn font-mono">
      {/* Backdrop click */}
      <div onClick={onClose} className="flex-1" />

      {/* Slide-up Drawer Body */}
      <div className="w-full max-w-lg mx-auto rounded-t-3xl border-t border-cyan-500/40 bg-slate-950 p-5 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto animate-slideUp">
        {/* Pull Handle Bar */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <span className="text-cyan-400">☰</span>
            <span>指揮官系統選單</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 text-xs transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons (Clean text only, no gray subtitles) */}
        <div className="grid grid-cols-1 gap-2 text-xs">
          {/* 1. Settings */}
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-black flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-sm">視覺與偏好設定</span>
            </div>
            <span className="text-slate-500 text-sm">➔</span>
          </button>

          {/* 2. Guide */}
          <button
            onClick={() => {
              onClose();
              onOpenGuide();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-black flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-sm">遊戲玩法手冊</span>
            </div>
            <span className="text-slate-500 text-sm">➔</span>
          </button>

          {/* 3. Compendium */}
          <button
            onClick={() => {
              onClose();
              onOpenCompendium();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-black flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-sm">卡牌全圖鑑</span>
            </div>
            <span className="text-slate-500 text-sm">➔</span>
          </button>

          {/* 4. Tutorial */}
          <button
            onClick={() => {
              onClose();
              onStartTutorial();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 font-black flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-sm">實戰新手教學</span>
            </div>
            <span className="text-slate-500 text-sm">➔</span>
          </button>

          {/* 5. Switch to V1 */}
          {onSwitchToV1 && (
            <button
              onClick={() => {
                onClose();
                onSwitchToV1();
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-black flex items-center justify-between transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-sm">切換經典 v1.0 原版</span>
              </div>
              <span className="text-slate-500 text-sm">➔</span>
            </button>
          )}

          {/* 6. Return to Menu */}
          <button
            onClick={() => {
              onClose();
              onReturnToMenu();
            }}
            className="w-full p-3.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-black flex items-center justify-between transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-sm">返回主選單</span>
            </div>
            <span className="text-red-400 text-sm">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
