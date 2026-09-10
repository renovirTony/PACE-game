import React from 'react';
import { Shield, Radio, ShoppingBag, Layers } from 'lucide-react';

export type MobileTab = 'defense' | 'missions' | 'market' | 'tactics';

interface V2MobileDockProps {
  currentTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  actionPoints: number;
  energy: number;
  maxEnergy: number;
  credits: number;
  onEndTurn: () => void;
  handTacticsCount: number;
  disabled?: boolean;
  playerScore?: number;
  targetScore?: number;
  activePlayerName?: string;
  activePlayerAvatar?: string;
  isCurrentPlayer?: boolean;
  onOpenScoreboard?: () => void;
}

export function V2MobileDock({
  currentTab,
  onTabChange,
  actionPoints,
  energy,
  maxEnergy,
  credits,
  onEndTurn,
  handTacticsCount,
  disabled,
  playerScore,
  targetScore,
  activePlayerName,
  activePlayerAvatar,
  isCurrentPlayer = true,
  onOpenScoreboard,
}: V2MobileDockProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b16]/95 border-t border-slate-800 backdrop-blur-xl px-2 pt-2 pb-safe max-w-lg mx-auto shadow-[0_-10px_35px_rgba(0,0,0,0.6)] font-mono">
      {/* Top Row: Quick Vitals, Scoreboard Trigger & Instant Thumb Action Buttons */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        {/* Left Side: Resource Vitals & Integrated Scoreboard Trigger (可壓縮，確保右側操作鈕永不被擠出畫面) */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {/* Resource Vitals Micro-Pill */}
          <div className="flex items-center gap-1 text-[10px] px-1.5 py-1 rounded-xl bg-black/60 border border-white/5 font-bold shadow-inner shrink-0">
            <span className="text-cyan-400 font-black whitespace-nowrap" title="剩餘行動點數 AP">
              AP: {actionPoints}
            </span>
            <span className="text-amber-400 whitespace-nowrap" title="電力存量">
              ⚡ {energy}/{maxEnergy}
            </span>
            <span className="text-emerald-400 whitespace-nowrap" title="物資存量">
              💰 {credits}
            </span>
          </div>

          {/* Integrated Rescue Progress Score Trigger (Tap to open full BottomSheet) */}
          {onOpenScoreboard && typeof playerScore === 'number' && typeof targetScore === 'number' && (
            <button
              onClick={onOpenScoreboard}
              className="flex items-center gap-0.5 text-[10px] px-1.5 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold transition-all shadow-sm active:scale-95 min-w-0 overflow-hidden"
              title={
                isCurrentPlayer
                  ? '點擊展開全員救援進度排行榜'
                  : `目前為【${activePlayerName || 'AI 指揮官'}】的回合 · 點擊展開全員救援進度排行榜`
              }
            >
              {/* 非本人回合時以該玩家頭像取代獎盃圖示（寬度不變，兼作回合指示） */}
              <span className="shrink-0">
                {!isCurrentPlayer && activePlayerAvatar ? activePlayerAvatar : '🏆'}
              </span>
              <span className="text-[11px] font-black text-purple-200 whitespace-nowrap">
                {playerScore}
                <span className="text-[9px] text-purple-400 font-bold">/{targetScore}</span>
              </span>
            </button>
          )}
        </div>

        {/* Right Side: Thumb-Reach Turn Control (整補行動一律收斂至「戰術」分頁) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* End Turn */}
          <button
            data-tutorial="end-turn-btn"
            onClick={onEndTurn}
            disabled={disabled}
            className="px-2 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-black border border-cyan-400/40 shadow-md shadow-cyan-500/20 active:scale-95 flex items-center gap-1 shrink-0 whitespace-nowrap"
            title="結束本回合，換下一位指揮官行動"
          >
            <span className="whitespace-nowrap">結束回合</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: 4 Primary Mobile Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 pt-1 border-t border-white/5 text-[10px]">
        {/* Tab 1: Defense Board */}
        <button
          onClick={() => onTabChange('defense')}
          className={`py-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
            currentTab === 'defense'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="scale-95 font-black">防線</span>
        </button>

        {/* Tab 2: Crisis Missions */}
        <button
          onClick={() => onTabChange('missions')}
          className={`py-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
            currentTab === 'missions'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span className="scale-95 font-black">任務</span>
        </button>

        {/* Tab 3: Market */}
        <button
          onClick={() => onTabChange('market')}
          className={`py-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
            currentTab === 'market'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="scale-95 font-black">市場</span>
        </button>

        {/* Tab 4: Tactics & Hand */}
        <button
          onClick={() => onTabChange('tactics')}
          className={`py-1 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-0.5 relative ${
            currentTab === 'tactics'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="scale-95 font-black">戰術</span>
          {handTacticsCount > 0 && (
            <span className="absolute -top-0.5 right-1 px-1.5 py-0.2 rounded-full bg-purple-500 text-white font-black text-[9px] shadow-sm animate-pulse">
              {handTacticsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
