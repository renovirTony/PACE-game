import { useState } from 'react';
import { Bot, Users, GraduationCap, Sliders, Layers, BookOpen, ChevronDown, Landmark } from 'lucide-react';

/**
 * 開始畫面的主要動作（手機與桌面共用，MAPS S：由簡入繁）
 *  第一層：新手教學（第一次玩的人）→ 單人對戰（先選 AI 人數再開始）
 *  次要：同機雙人輪流
 */
export function SetupModeActions({
  botCount,
  onChangeBotCount,
  onStartSingle,
  onStartPassAndPlay,
  onStartTutorial,
  size = 'md',
}: {
  botCount: number;
  onChangeBotCount: (n: number) => void;
  onStartSingle: () => void;
  onStartPassAndPlay: () => void;
  onStartTutorial: () => void;
  size?: 'sm' | 'md';
}) {
  const big = size === 'md';
  return (
    <div className="flex flex-col gap-3">
      {/* 1. 第一次玩：教學 */}
      <button
        onClick={onStartTutorial}
        className={`tutorial-launch-btn w-full ${big ? 'p-4' : 'p-3.5'} rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-black ${big ? 'text-sm' : 'text-sm'} flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98]`}
      >
        <GraduationCap className="w-5 h-5 shrink-0" />
        <span className="flex flex-col items-start leading-tight">
          <span>第一次玩？從新手教學開始</span>
          <span className="text-[11px] font-bold text-purple-100/80">8 個步驟，約 5 分鐘學會 PACE 備援</span>
        </span>
      </button>

      {/* 2. 單人對戰：先選人數，再開始 */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-bold">AI 對手人數</span>
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="AI 對手人數">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                role="radio"
                aria-checked={botCount === count}
                onClick={() => onChangeBotCount(count)}
                className={`px-3 min-h-[36px] min-w-[44px] rounded-lg border text-xs font-bold transition-all ${
                  botCount === count
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {count} 人
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onStartSingle}
          className={`w-full ${big ? 'p-3.5' : 'p-3'} rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all active:scale-[0.98]`}
        >
          <Bot className="w-5 h-5 shrink-0" />
          <span>開始單人對戰（vs {botCount} 位 AI）</span>
        </button>
      </div>

      {/* 3. 次要：同機雙人 */}
      <button
        onClick={onStartPassAndPlay}
        className="w-full p-2.5 rounded-xl bg-transparent hover:bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Users className="w-4 h-4 shrink-0" />
        <span>同一台裝置兩人輪流玩</span>
      </button>
    </div>
  );
}

/** 「更多 ▾」：手冊、圖鑑、視覺設定、v1 經典版（預設收合） */
export function SetupMoreTools({
  onOpenGuide,
  onOpenCompendium,
  onOpenSettings,
  onSwitchToV1,
}: {
  onOpenGuide: () => void;
  onOpenCompendium: () => void;
  onOpenSettings: () => void;
  onSwitchToV1?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const itemClass =
    'flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 font-bold text-xs transition-all';

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="self-center flex items-center gap-1 text-xs text-slate-300 hover:text-slate-100 font-bold px-3 min-h-[40px] rounded-xl hover:bg-slate-900"
      >
        <span>更多：玩法手冊、卡牌圖鑑、設定</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-2 animate-fadeIn">
          <button onClick={onOpenGuide} className={itemClass}>
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>玩法手冊</span>
          </button>
          <button onClick={onOpenCompendium} className={itemClass}>
            <Layers className="w-4 h-4 text-purple-400" />
            <span>卡牌圖鑑</span>
          </button>
          <button onClick={onOpenSettings} className={itemClass}>
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>字體與配色</span>
          </button>
          {onSwitchToV1 && (
            <button onClick={onSwitchToV1} className={itemClass}>
              <Landmark className="w-4 h-4 text-slate-400" />
              <span>v1.0 經典版</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
