import { useState, useRef, useEffect } from 'react';
import { Player, WorldviewType, DisasterEvent } from '../../types/game';
import { PHYSICAL_MEDIUM_META, describeDisasterEffects } from '../../data/terminology';
import { ConfirmDialog, ConfirmDialogState, DESTRUCTIVE_CONFIRM_COPY } from '../Modals/ConfirmDialog';
import { Radio, Zap, Coins, Layers, BookOpen, GraduationCap, Sliders, Smartphone, ChevronDown } from 'lucide-react';

interface V2TurnHeaderProps {
  round: number;
  maxRounds: number;
  targetScore: number;
  activePlayer: Player;
  worldview: WorldviewType;
  onOpenDisplaySettings: () => void;
  onSwitchToV1?: () => void;
  onReturnToMenu: () => void;
  onOpenCompendium: () => void;
  onOpenGuide: () => void;
  onStartTutorial: () => void;
  onToggleMobileView?: () => void;
  isMobileViewForced?: boolean;
  players?: Player[];
  activeEvent?: DisasterEvent | null;
  onOpenDisasterDetail?: () => void;
  onOpenScoreboard?: () => void;
}

export function V2TurnHeader({
  round,
  maxRounds,
  targetScore,
  activePlayer,
  worldview,
  onOpenDisplaySettings,
  onSwitchToV1,
  onReturnToMenu,
  onOpenCompendium,
  onOpenGuide,
  onStartTutorial,
  onToggleMobileView,
  isMobileViewForced,
  players,
  activeEvent,
  onOpenDisasterDetail,
  onOpenScoreboard,
}: V2TurnHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const askConfirm = (copy: (typeof DESTRUCTIVE_CONFIRM_COPY)[keyof typeof DESTRUCTIVE_CONFIRM_COPY], action: () => void) => {
    setIsMenuOpen(false);
    setConfirmDialog({
      ...copy,
      onConfirm: () => {
        setConfirmDialog(null);
        action();
      },
    });
  };

  const handleSafeReturnToMenu = () => askConfirm(DESTRUCTIVE_CONFIRM_COPY.returnToMenu, onReturnToMenu);
  const handleSafeSwitchToV1 = () => askConfirm(DESTRUCTIVE_CONFIRM_COPY.switchToV1, () => onSwitchToV1?.());
  const handleSafeStartTutorial = () => askConfirm(DESTRUCTIVE_CONFIRM_COPY.startTutorial, onStartTutorial);

  return (
    <>
      <header className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-2 sm:p-2.5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-1.5 font-mono relative z-50 w-full max-w-full text-xs">
        {/* 1. Left: Brand Logo & Round Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-wider text-slate-100 font-orbitron whitespace-nowrap">
                PACE
                <span className="text-cyan-400">
                  {/* 窄桌面 (1024–1279) 只留 PACE 主識別，把寬度讓給天災情資條 */}
                  <span className="hidden xl:inline"> 通訊先鋒</span>
                  <span className="hidden min-[1800px]:inline"> v2.0</span>
                </span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-xs whitespace-nowrap">
                第 {round}/{maxRounds} 輪
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden min-[1800px]:block whitespace-nowrap">
              民防應急通訊規劃 · 物理天災與 Fallback 演練
            </div>
          </div>
        </div>

        {/* 2. Center: Prominent Disaster Status Strip (Fully Clickable to Open Briefing) */}
        {(() => {
          if (!activeEvent) return null;
          const effects = describeDisasterEffects(activeEvent);
          const isSunny = !effects.isHazard;

          if (isSunny) {
            return (
              <button
                onClick={onOpenDisasterDetail}
                className="flex-1 min-w-[220px] max-w-md px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99] text-left"
                title="點擊查看詳細天災情資"
              >
                <span className="font-bold flex items-center gap-1.5 truncate">
                  <span>☀️</span>
                  <span className="truncate">
                    氣候良好 · 通訊媒介全部暢通{activeEvent.creditBonus ? ` · 成功通訊 +${activeEvent.creditBonus}💰` : ''}
                  </span>
                </span>
                <span className="text-xs text-emerald-400 hover:text-emerald-200 font-bold underline underline-offset-2 shrink-0 ml-2">
                  情資 ➔
                </span>
              </button>
            );
          }

          const eventTitle = activeEvent.translations[worldview]?.title || '天災襲擊';
          const shortTitle = eventTitle.split(' (')[0].split('（')[0].trim();
          const affectedMediaNames = activeEvent.targetedMedia
            .map(m => PHYSICAL_MEDIUM_META[m]?.label || m)
            .join(' / ');

          return (
            <button
              onClick={onOpenDisasterDetail}
              className="flex-1 min-w-[280px] max-w-2xl px-3 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-950/90 border border-red-500/50 flex items-center justify-between gap-2 shadow-inner cursor-pointer transition-all active:scale-[0.99] text-left"
              title="點擊查看詳細天災受災情資"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <span className="text-sm animate-pulse shrink-0">🌪️</span>
                {/* 空間不足時優先截斷天災名稱，保住「阻斷哪些媒介」這項戰術關鍵資訊 */}
                <span className="text-xs font-black text-red-200 truncate min-w-0" title={shortTitle}>
                  {shortTitle}
                </span>
                {affectedMediaNames ? (
                  <span className="text-xs font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/40 shrink-0 whitespace-nowrap">
                    ❌ 阻斷：【{affectedMediaNames}】
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-1">
                {activeEvent.powerDrainBonus ? (
                  <span className="text-xs font-black text-red-300 bg-red-900/60 px-1.5 py-0.5 rounded whitespace-nowrap" title="需電設備耗電增加（0⚡ 免電裝備不受影響）">
                    ⚡ 耗電+{activeEvent.powerDrainBonus}
                  </span>
                ) : null}
                {activeEvent.rangePenalty ? (
                  <span className="text-xs font-black text-amber-300 bg-amber-900/50 px-1.5 py-0.5 rounded whitespace-nowrap" title="光學通訊的視距通聯降為短距">
                    🌫️ 光學距離↓
                  </span>
                ) : null}
                <span className="text-xs text-red-300 hover:text-red-100 font-bold underline underline-offset-2 shrink-0 whitespace-nowrap">
                  詳情 ➔
                </span>
              </div>
            </button>
          );
        })()}

        {/* 3. Center-Right: Integrated Real-time Leaderboard Pill (點擊展開完整計分板)
               窄桌面 (<1280) 僅留行動中指揮官的積分，避免擠壓天災情資條；
               寬桌面 (≥1280) 才展開全員頭像 + 積分。兩種型態都可點擊開啟完整計分板。 */}
        {players && players.length > 0 && (
          <button
            onClick={onOpenScoreboard}
            className="flex items-center gap-1 px-1.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 shrink-0 transition-all active:scale-95"
            title="點擊展開全員救援進度完整計分板"
          >
            <span className="text-xs font-black text-purple-300 whitespace-nowrap">
              🏆<span className="hidden min-[1800px]:inline"> 救援榜:</span>
            </span>

            {/* 窄桌面精簡型態：行動中指揮官的積分／目標分 */}
            <span className="xl:hidden px-1 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-black whitespace-nowrap">
              {activePlayer.avatar} {activePlayer.score}
              <span className="text-slate-400 font-bold">/{targetScore}</span>
            </span>

            <div className="hidden xl:flex items-center gap-1 text-xs font-bold">
              {players.map((p) => {
                const isMe = p.id === activePlayer.id;
                return (
                  <span
                    key={p.id}
                    title={`${p.name}${isMe ? '（行動中）' : ''}：救援積分 ${p.score}/${targetScore}`}
                    className={`px-1 min-[1800px]:px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                      isMe
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-black'
                        : 'text-slate-400'
                    }`}
                  >
                    {/* 版面寬度受 max-w-[1700px] 上限約束，此處固定採精簡型態（頭像 + 積分），
                        完整姓名、目標分與戰術細節改由點擊後的完整計分板呈現 */}
                    {p.avatar} {p.score}
                  </span>
                );
              })}
            </div>

            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>
        )}

        {/* 4. Far Right: Consolidated Player Vitals & Utility Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Consolidated Telemetry Capsule */}
          <div className="flex items-center gap-1.5 min-[1800px]:gap-2.5 px-2 min-[1800px]:px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-bold shrink-0">
            {/* Action Points */}
            <div className="flex items-center gap-1">
              <span className="text-cyan-400 font-black">AP</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: activePlayer.maxActionPoints }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full border ${
                      i < activePlayer.actionPoints
                        ? 'bg-cyan-400 border-cyan-300 shadow-sm shadow-cyan-400/50'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                ))}
              </div>
              {/* 圓點已表達 AP 存量，窄桌面下省略重複的數字以讓出空間給天災情資 */}
              <span className="text-cyan-300 text-xs hidden min-[1800px]:inline whitespace-nowrap">
                ({activePlayer.actionPoints}/{activePlayer.maxActionPoints})
              </span>
            </div>

            <span className="text-slate-700 select-none hidden min-[1800px]:inline">|</span>

            {/* Energy */}
            <div className="flex items-center gap-1 text-amber-300 font-black">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{activePlayer.energy}/{activePlayer.maxEnergy}⚡</span>
            </div>

            <span className="text-slate-700 select-none hidden min-[1800px]:inline">|</span>

            {/* Credits */}
            <div className="flex items-center gap-1 text-emerald-300 font-black">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>💰{activePlayer.credits}</span>
            </div>
          </div>

          {/* 5. Utility Menu Popover Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="開啟功能與設定選單"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">設定選單</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-700 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-xl z-[100] flex flex-col gap-1 text-xs animate-scaleUp">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenDisplaySettings();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 font-bold flex items-center gap-2 transition-all"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>偏好設定 (字體/世界觀)</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCompendium();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-purple-950/60 text-slate-200 hover:text-purple-300 font-bold flex items-center gap-2 transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>卡牌圖鑑</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenGuide();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 font-bold flex items-center gap-2 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>玩法手冊與通訊守則</span>
                </button>

                <button
                  onClick={handleSafeStartTutorial}
                  className="w-full px-3 py-2 rounded-xl text-left hover:bg-amber-950/60 text-slate-200 hover:text-amber-300 font-bold flex items-center gap-2 transition-all"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>啟動新手教學</span>
                </button>

                <div className="my-1 border-t border-slate-800" />

                {/* Mobile View Simulation */}
                {onToggleMobileView && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onToggleMobileView();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-amber-950/60 text-amber-300 font-bold flex items-center gap-2 transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isMobileViewForced ? '切換回電腦全景版' : '切換手機版模擬'}</span>
                  </button>
                )}

                {/* Switch to V1 */}
                {onSwitchToV1 && (
                  <button
                    onClick={handleSafeSwitchToV1}
                    className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-bold flex items-center gap-2 transition-all"
                  >
                    <span>🏛️ 切換至經典原版 v1.0</span>
                  </button>
                )}

                <div className="my-1 border-t border-slate-800" />

                {/* Return to Menu */}
                <button
                  onClick={handleSafeReturnToMenu}
                  className="w-full px-3 py-2 rounded-xl text-left bg-red-950/40 hover:bg-red-900/60 text-red-300 font-bold flex items-center gap-2 transition-all"
                >
                  <span>🚪 退出演習返回主選單</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal
          必須留在 <header> 外：header 的 backdrop-blur 會讓它成為後代 fixed 元素的
          containing block，巢狀在內時 inset-0 會相對於 header 而非整個視窗計算。 */}
      <ConfirmDialog dialog={confirmDialog} onCancel={() => setConfirmDialog(null)} />
    </>
  );
}
