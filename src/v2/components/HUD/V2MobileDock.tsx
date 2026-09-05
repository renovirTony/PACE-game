import React from 'react';
import { Zap, ArrowRight, Shield, Radio, ShoppingBag, Layers } from 'lucide-react';

export type MobileTab = 'defense' | 'missions' | 'market' | 'tactics';

interface V2MobileDockProps {
  currentTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  actionPoints: number;
  energy: number;
  maxEnergy: number;
  credits: number;
  canRecharge: boolean;
  onRecharge: () => void;
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
  canRecharge,
  onRecharge,
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b16]/95 border-t border-slate-800 backdrop-blur-xl px-3 pt-2 pb-safe max-w-lg mx-auto shadow-[0_-10px_35px_rgba(0,0,0,0.6)] font-mono">
      {/* Top Row: Quick Vitals, Scoreboard Trigger & Instant Thumb Action Buttons */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        {/* Left Side: Resource Vitals & Integrated Scoreboard Trigger */}
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
          {/* Resource Vitals Micro-Pill */}
          <div className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-xl bg-black/60 border border-white/5 font-bold shadow-inner shrink-0">
            <span className="text-cyan-400 flex items-center gap-1 font-black" title="剩餘行動點數 AP">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block"></span>
              AP: {actionPoints}
            </span>
            <span className="text-amber-400" title="電力存量">
              ⚡ {energy}/{maxEnergy}
            </span>
            <span className="text-emerald-400" title="物資存量">
              💰 {credits}
            </span>
          </div>

          {/* Integrated Rescue Progress Score Trigger (Tap to open full BottomSheet) */}
          {onOpenScoreboard && typeof playerScore === 'number' && typeof targetScore === 'number' && (
            <button
              onClick={onOpenScoreboard}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold transition-all shadow-sm active:scale-95 shrink-0"
              title="點擊展開全員救援進度排行榜"
            >
              <span>🏆</span>
              <span className="text-[11px] font-black text-purple-200">{playerScore}</span>
              <span className="text-[9px] text-purple-400">/{targetScore}</span>
              {!isCurrentPlayer && activePlayerAvatar && (
                <span className="text-[9px] text-cyan-300 font-normal ml-0.5">
                  ({activePlayerAvatar})
                </span>
              )}
              <span className="text-[8px] text-purple-400 ml-0.5">▴</span>
            </button>
          )}
        </div>

        {/* Right Side: Thumb-Reach Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Recharge (+2 Energy) */}
          <button
            data-tutorial="recharge-btn"
            onClick={onRecharge}
            disabled={disabled || !canRecharge}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 shadow-sm active:scale-95 shrink-0 whitespace-nowrap ${
              canRecharge && !disabled
                ? 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
            }`}
            title={canRecharge ? "緊急充電 (+2⚡ | 消耗 1 AP)" : "電量已滿或 AP 不足"}
          >
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">充電</span>
            <span className="text-[9px] opacity-80 whitespace-nowrap">(1AP)</span>
          </button>

          {/* End Turn */}
          <button
            data-tutorial="end-turn-btn"
            onClick={onEndTurn}
            disabled={disabled}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-black border border-cyan-400/40 shadow-md shadow-cyan-500/20 active:scale-95 flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">結束回合</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
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
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-purple-400 ring-2 ring-slate-950"></span>
          )}
        </button>
      </div>
    </div>
  );
}
