import { useState, useEffect, useCallback } from 'react';
import { useV2GameState } from './engine/gameState';
import { V2TurnHeader } from './components/HUD/V2TurnHeader';
import { V2DisasterBanner } from './components/Cards/V2DisasterBanner';
import { CustomPaceBoard } from './components/Board/CustomPaceBoard';
import { V2MissionCardView } from './components/Cards/V2MissionCardView';
import { V2MarketArea } from './components/Market/V2MarketArea';
import { V2ActionControlPanel, ActiveBuffsBanner } from './components/HUD/V2ActionControlPanel';
import { V2TransmissionResultModal } from './components/Modals/V2TransmissionResultModal';
import { MultiplayerLobbyModal } from './components/Modals/MultiplayerLobbyModal';
import { V2GameOverModal } from './components/Modals/V2GameOverModal';
import { V2CardCompendiumModal } from './components/Modals/V2CardCompendiumModal';
import { V2GuideModal } from './components/Modals/V2GuideModal';
import { DisplaySettingsModal, FontSizeMode, ThemeMode } from './components/Modals/DisplaySettingsModal';
import { V2InteractiveTutorial } from './components/Tutorial/V2InteractiveTutorial';
import { V2MobileDock, MobileTab } from './components/HUD/V2MobileDock';
import { V2MobileMenuModal } from './components/Modals/V2MobileMenuModal';
import { V2MobileScoreboardDrawer } from './components/Modals/V2MobileScoreboardDrawer';
import { V2LogViewer } from './components/HUD/V2LogViewer';
import { AITransmissionToast } from './components/HUD/AITransmissionToast';
import { OnlineConnectionBanner } from './components/HUD/OnlineConnectionBanner';
import { useScreenWakeLock } from './hooks/useScreenWakeLock';
import { Radio, Globe, Sparkles, Smartphone, Monitor, Menu, X } from 'lucide-react';
import { safeStorage } from './utils/safeStorage';
import { SetupModeActions, SetupMoreTools } from './components/Setup/SetupActions';
import { CommsCard, PACESlot } from './types/game';
import { describeDisasterEffects } from './data/terminology';

interface AppV2Props {
  onSwitchToV1?: () => void;
}

export function AppV2({ onSwitchToV1 }: AppV2Props) {
  const gameState = useV2GameState();
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState(false);
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false);
  const [isDisasterModalOpen, setIsDisasterModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedBotCount, setSelectedBotCount] = useState(2);

  // 待在線上房間（大廳或對局）時保持螢幕常亮，避免手機鎖屏造成斷線
  useScreenWakeLock(Boolean(gameState.roomCode));

  // Mobile Layout & Navigation State
  const [mobileTab, setMobileTab] = useState<MobileTab>('defense');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScoreboardDrawerOpen, setIsScoreboardDrawerOpen] = useState(false);

  // 桌面版：防線空槽的「去市場選購 ➔」引導（捲動至市場並切回通訊裝備分頁）
  const [marketFocusNonce, setMarketFocusNonce] = useState(0);
  const focusDesktopMarket = () => {
    setMarketFocusNonce((n) => n + 1);
    if (typeof document === 'undefined') return;

    const el = document.getElementById('desktop-market-area');
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 保險機制：若瀏覽器未實際執行平滑捲動（分頁未繪製 / 偏好減少動態效果），改為立即捲動
    window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      if (Math.abs(elCenter - window.innerHeight / 2) > window.innerHeight * 0.35) {
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }, 600);
  };

  // 防線操作（雙端共用）：教學第 4 步只在操作「成功」時才前進，失敗時留在原步驟讓玩家重試
  const advanceTutorialIf = (ok: boolean, step: number) => {
    if (ok && gameState.isTutorialMode && gameState.tutorialStep === step) {
      gameState.nextTutorialStep();
    }
  };
  const handleSwapSlots = (slotA: PACESlot, slotB: PACESlot) => {
    const ok = gameState.swapSlots(slotA, slotB);
    advanceTutorialIf(ok, 4);
    return ok;
  };
  const handleStoreCard = (slot: PACESlot) => {
    const hadCard = Boolean(gameState.activePlayer.paceBoard[slot]);
    gameState.storeCard(slot);
    advanceTutorialIf(hadCard, 4);
  };
  const handleEquipFromInventory = (card: CommsCard, slot: PACESlot) => {
    const ok = gameState.equipFromInventory(card, slot);
    advanceTutorialIf(ok, 4);
    return ok;
  };

  // Detect Mobile View: via ?mobile=1 query parameter OR screen width < 1024px OR manual toggle
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [forceMobileView, setForceMobileView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mobile') === '1' || safeStorage.get('pace_force_mobile') === 'true';
    }
    return false;
  });

  // Track window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMode = useCallback(() => {
    setForceMobileView((prev) => {
      const next = !prev;
      safeStorage.set('pace_force_mobile', String(next));
      return next;
    });
  }, []);

  // Sync Mobile Tabs with Tutorial Steps (Auto-Tab Sync)
  useEffect(() => {
    if (gameState.isTutorialMode) {
      if (gameState.tutorialStep === 1 || gameState.tutorialStep === 4) {
        setMobileTab('defense');
      } else if (gameState.tutorialStep === 2) {
        setMobileTab('market');
      } else if (gameState.tutorialStep === 3) {
        setMobileTab('tactics');
      } else if (gameState.tutorialStep === 5) {
        setMobileTab('missions');
      } else if (gameState.tutorialStep === 6) {
        // 野戰充電按鈕已收斂至戰術分頁，必須切過去教學高亮才找得到目標
        setMobileTab('tactics');
      }
    }
  }, [gameState.isTutorialMode, gameState.tutorialStep]);

  const isMobileActive = isSmallScreen || forceMobileView;

  // Font Size state with localStorage persistence (Default to 'large' for enhanced desktop readability)
  const [fontSize, setFontSize] = useState<FontSizeMode>(() => {
    const saved = safeStorage.get('pace_font_size');
    return (saved === 'normal' || saved === 'large' || saved === 'xlarge') ? saved : 'large';
  });

  // Color Theme state with localStorage persistence (3 curated modes: tactical-dark, soft-muted, daylight)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = safeStorage.get('pace_theme');
    return (saved === 'tactical-dark' || saved === 'soft-muted' || saved === 'daylight')
      ? (saved as ThemeMode)
      : 'tactical-dark';
  });

  // Apply font scale class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    root.classList.add(`font-scale-${fontSize}`);
    safeStorage.set('pace_font_size', fontSize);
  }, [fontSize]);

  // Apply color theme data-attribute to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    safeStorage.set('pace_theme', theme);
  }, [theme]);

  // 邀請連結 ?v=2&room=CODE：開啟大廳並預填房號；只在剛載入時自動開一次，返回主選單後不再跳出
  const [inviteRoomCode] = useState(() => new URLSearchParams(window.location.search).get('room')?.toUpperCase() ?? '');
  useEffect(() => {
    if (inviteRoomCode) setIsMultiplayerModalOpen(true);
  }, [inviteRoomCode]);

  // 客端由房主開局（快照把 phase 帶離 SETUP），大廳視窗要跟著關閉
  useEffect(() => {
    if (gameState.phase !== 'SETUP') setIsMultiplayerModalOpen(false);
  }, [gameState.phase]);

  // Setup / Welcome Screen
  if (gameState.phase === 'SETUP') {
    if (isMobileActive) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-3 bg-[#060913] text-slate-100 font-mono">
          {/* PC Mobile Emulation Indicator Bar */}
          {forceMobileView && !isSmallScreen && (
            <div className="w-full max-w-md mb-2 px-3 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Smartphone className="w-4 h-4 text-amber-400" /> PC 手機直式模擬模式 (390px)
              </span>
              <button
                onClick={toggleMobileMode}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>切換回電腦全景版</span>
              </button>
            </div>
          )}

          {/* Mobile Ergonomic Setup Card */}
          <div className={`w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/95 p-5 shadow-2xl flex flex-col gap-4 text-xs ${forceMobileView && !isSmallScreen ? 'border-cyan-500/30 ring-1 ring-cyan-500/20' : ''}`}>
            {/* Brand Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                    v2.0 重構版
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                    自組防線
                  </span>
                </div>
                <h1 className="text-lg font-black font-orbitron text-slate-100 mt-0.5">
                  PACE <span className="text-cyan-400">通訊先鋒</span>
                </h1>
              </div>
            </div>

            {/* Worldview Selector */}
            <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> 文本世界觀情境：
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  onClick={() => gameState.setWorldview('CivilDefense')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    gameState.worldview === 'CivilDefense'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs block">🏠</span>
                  <span className="font-bold block mt-0.5 text-[10px]">社區民防</span>
                </button>
                <button
                  onClick={() => gameState.setWorldview('IslandResilience')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    gameState.worldview === 'IslandResilience'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs block">🌊</span>
                  <span className="font-bold block mt-0.5 text-[10px]">海島天災</span>
                </button>
                <button
                  onClick={() => gameState.setWorldview('CyberDisconnect')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    gameState.worldview === 'CyberDisconnect'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs block">⚡</span>
                  <span className="font-bold block mt-0.5 text-[10px]">大斷網廢土</span>
                </button>
              </div>
            </div>

            {/* Primary Game Mode Actions（雙端共用：教學 → 單人對戰 → 雙人輪流） */}
            <div className="flex flex-col gap-2.5">
              <SetupModeActions
                size="sm"
                botCount={selectedBotCount}
                onChangeBotCount={setSelectedBotCount}
                onStartSingle={() => gameState.startGame('SinglePlayer', selectedBotCount)}
                onStartPassAndPlay={() => gameState.startGame('PassAndPlay')}
                onStartTutorial={gameState.startTutorial}
              />

              <button
                onClick={() => setIsMultiplayerModalOpen(true)}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>建立/加入 遠端連線 (WebRTC P2P)</span>
              </button>
            </div>

            {/* 次要工具收進「更多」 */}
            <SetupMoreTools
              onOpenGuide={() => setIsGuideOpen(true)}
              onOpenCompendium={() => setIsCompendiumOpen(true)}
              onOpenSettings={() => setIsDisplaySettingsOpen(true)}
              onSwitchToV1={onSwitchToV1}
            />
          </div>

          {/* Render Modals in Setup */}
          <DisplaySettingsModal
            isOpen={isDisplaySettingsOpen}
            onClose={() => setIsDisplaySettingsOpen(false)}
            worldview={gameState.worldview}
            onChangeWorldview={gameState.setWorldview}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
            theme={theme}
            onChangeTheme={setTheme}
          />
          <V2CardCompendiumModal
            isOpen={isCompendiumOpen}
            onClose={() => setIsCompendiumOpen(false)}
            worldview={gameState.worldview}
          />
          <V2GuideModal
            isOpen={isGuideOpen}
            onClose={() => setIsGuideOpen(false)}
          />
          <MultiplayerLobbyModal
            isOpen={isMultiplayerModalOpen}
            onClose={() => setIsMultiplayerModalOpen(false)}
            roomCode={gameState.roomCode}
            isHost={gameState.isHost}
            peers={gameState.peers}
            connectionStatus={gameState.connectionStatus}
            connectionMsg={gameState.connectionMsg}
            onCreateRoom={gameState.createRoom}
            onJoinRoom={gameState.joinRoom}
            initialRoomCode={inviteRoomCode}
            onStartGame={() => {
              setIsMultiplayerModalOpen(false);
              gameState.startGame('OnlineMultiplayer');
            }}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#060913] text-slate-100 relative overflow-hidden font-mono">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/10 pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-blue-500/10 pointer-events-none" />

        <div className="relative z-10 max-w-5xl w-full rounded-3xl border border-cyan-500/30 bg-slate-950/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Brand & Worldview Switcher Preview */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Logo */}
              <div className="inline-flex p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-inner">
                <Radio className="w-10 h-10 animate-pulse" />
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 tracking-wider uppercase">
                  v2.0 全新重構版
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">
                  自組防線 · 媒介獨立
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-orbitron tracking-wider text-slate-100 mb-3">
                PACE <span className="text-cyan-400">通訊先鋒</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                學習民防與真實防救災的核心法則——自由配置 4 道獨立媒介防線，在大停電、暴風雨與電磁脈衝下驗證你的應急備援方案！
              </p>

              {/* Worldview Selection Buttons */}
              <div className="w-full flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" /> 選擇文本世界觀 (一鍵切換體驗)：
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => gameState.setWorldview('CivilDefense')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      gameState.worldview === 'CivilDefense'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm block">🏠</span>
                    <span className="text-xs font-bold block mt-0.5">社區民防</span>
                  </button>

                  <button
                    onClick={() => gameState.setWorldview('IslandResilience')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      gameState.worldview === 'IslandResilience'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm block">🌊</span>
                    <span className="text-xs font-bold block mt-0.5">海島天災</span>
                  </button>

                  <button
                    onClick={() => gameState.setWorldview('CyberDisconnect')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      gameState.worldview === 'CyberDisconnect'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm block">⚡</span>
                    <span className="text-xs font-bold block mt-0.5">大斷網廢土</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Game Modes & Multiplayer */}
            <div className="lg:col-span-6 flex flex-col gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> 開始演習
              </span>

              {/* 雙端共用：教學 → 單人對戰（先選人數）→ 雙人輪流 */}
              <SetupModeActions
                botCount={selectedBotCount}
                onChangeBotCount={setSelectedBotCount}
                onStartSingle={() => gameState.startGame('SinglePlayer', selectedBotCount)}
                onStartPassAndPlay={() => gameState.startGame('PassAndPlay')}
                onStartTutorial={gameState.startTutorial}
              />

              {/* Online Multiplayer Lobby Button */}
              <button
                onClick={() => setIsMultiplayerModalOpen(true)}
                className="multiplayer-launch-btn w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/50 text-cyan-200 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-md shadow-cyan-950/40"
              >
                <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                <span>🌐 建立/加入 遠端多人連線房間 (WebRTC P2P)</span>
              </button>

              {/* 次要工具收進「更多」（手機版模擬鈕移除：網址 ?mobile=1 與遊戲內設定選單仍可切換） */}
              <SetupMoreTools
                onOpenGuide={() => setIsGuideOpen(true)}
                onOpenCompendium={() => setIsCompendiumOpen(true)}
                onOpenSettings={() => setIsDisplaySettingsOpen(true)}
                onSwitchToV1={onSwitchToV1}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <MultiplayerLobbyModal
          isOpen={isMultiplayerModalOpen}
          onClose={() => setIsMultiplayerModalOpen(false)}
          roomCode={gameState.roomCode}
          isHost={gameState.isHost}
          peers={gameState.peers}
          connectionStatus={gameState.connectionStatus}
          connectionMsg={gameState.connectionMsg}
          onCreateRoom={gameState.createRoom}
          onJoinRoom={gameState.joinRoom}
            initialRoomCode={inviteRoomCode}
          onStartGame={() => {
            setIsMultiplayerModalOpen(false);
            gameState.startGame('OnlineMultiplayer');
          }}
        />

        <V2CardCompendiumModal
          isOpen={isCompendiumOpen}
          onClose={() => setIsCompendiumOpen(false)}
          worldview={gameState.worldview}
        />

        <V2GuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        <DisplaySettingsModal
          isOpen={isDisplaySettingsOpen}
          onClose={() => setIsDisplaySettingsOpen(false)}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          theme={theme}
          onChangeTheme={setTheme}
          worldview={gameState.worldview}
          onChangeWorldview={gameState.setWorldview}
        />
      </div>
    );
  }

  // Active Game Arena
  return (
    <div className={`min-h-screen bg-[#060913] text-slate-100 flex flex-col font-mono ${isMobileActive && forceMobileView && !isSmallScreen ? 'py-4 items-center bg-[#03060c]' : ''}`}>
      
      {/* PC Emulation Bar (Only visible when user manually forced mobile view on wide screen) */}
      {isMobileActive && forceMobileView && !isSmallScreen && (
        <div className="w-full max-w-md mb-2 px-3 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Smartphone className="w-4 h-4 text-amber-400" /> PC 手機直式模擬模式 (390px)
          </span>
          <button
            onClick={toggleMobileMode}
            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>切換回電腦全景版</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* A. MOBILE ADAPTIVE VIEW (Active when screen < 1024px or ?mobile=1 forced) */}
      {/* ========================================================================= */}
      {isMobileActive ? (
        <div className={`w-full max-w-md flex flex-col gap-3 relative pb-28 pt-2 px-3 overflow-x-hidden ${forceMobileView && !isSmallScreen ? 'border border-slate-800 rounded-3xl bg-[#060913] shadow-2xl' : ''}`}>
          {/* 1. Mobile Sticky Top Header with ☰ Menu Button (Strict Anti-Overflow) */}
          <div className="sticky top-0 z-30 -mx-3 px-3 py-2 bg-[#060913]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shadow-md gap-1.5 max-w-full overflow-hidden">
            <div className="flex items-center gap-1.5 shrink min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="px-2.5 min-h-[36px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 flex items-center gap-1 text-xs font-black shadow-sm active:scale-95 shrink-0 whitespace-nowrap"
                title="展開指揮官工具選單"
                aria-haspopup="dialog"
              >
                <Menu className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] whitespace-nowrap">選單</span>
              </button>

              {/* 遊戲中不顯示遊戲名稱（窄螢幕只會被截成「P…」），把空間留給回合數與天災狀態 */}
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold shrink-0 whitespace-nowrap">
                  第 {gameState.round}/{gameState.maxRounds} 輪
                </span>
              </div>
            </div>

            {/* Mini Disaster Pill with tap to view briefing */}
            {/* min-w-0 + truncate：空間不足時截斷膠囊文字，而不是把左側標題擠掉或溢出畫面 */}
            <div className="flex items-center gap-1 text-[10px] min-w-0">
              {(() => {
                // 與桌面 Header、天災詳情共用同一份效果描述，避免漏掉「耗電 +1」等效果
                const { isHazard, shortSummary: pillText } = describeDisasterEffects(gameState.activeEvent);

                return (
                  <button
                    onClick={() => setIsDisasterModalOpen(true)}
                    className={`max-w-full min-w-0 px-3 min-h-[36px] rounded-full font-black text-[11px] flex items-center gap-1 whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                      // 不再閃爍（閃爍時文字會淡到看不清），改用實色底 + 亮色字確保對比
                      isHazard
                        ? 'bg-red-900 hover:bg-red-800 text-red-50 border border-red-400'
                        : 'bg-emerald-900 hover:bg-emerald-800 text-emerald-50 border border-emerald-400'
                    }`}
                    title="點擊查看天災受災詳情"
                    aria-label={`本輪天災：${pillText}，點擊查看詳情`}
                  >
                    <span className="whitespace-nowrap truncate min-w-0">{pillText}</span>
                    <span className="text-[10px] shrink-0" aria-hidden="true">ℹ️</span>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* 2. Active Mobile Tab Content */}
          {mobileTab === 'defense' && (
            <CustomPaceBoard
              isMobile={true}
              onGoToMarket={() => setMobileTab('market')}
              player={gameState.activePlayer}
              activeEvent={gameState.activeEvent}
              isCurrentPlayer={gameState.isLocalTurn}
              worldview={gameState.worldview}
              onSwapSlots={handleSwapSlots}
              onStoreCard={handleStoreCard}
              onEquipFromInventory={handleEquipFromInventory}
              onRecycleInventoryCard={gameState.recycleInventoryCard}
            />
          )}

          {mobileTab === 'missions' && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-3 sm:p-4 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-100 whitespace-nowrap">
                    突發危機任務
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  P➔A➔C➔E 依序接手
                </span>
              </div>

              {/* 破局機制：重抽任務 */}
              <button
                onClick={() => gameState.refreshMissions()}
                disabled={!gameState.isLocalTurn || gameState.activePlayer.actionPoints <= 0}
                className={`w-full py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 ${
                  gameState.isLocalTurn && gameState.activePlayer.actionPoints > 0
                    ? 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                }`}
                title="三題都打不下來時，消耗 1 AP 汰換全場危機任務"
              >
                🔄 重抽任務 (1 AP)
              </button>

              <div className="grid grid-cols-1 gap-3">
                {gameState.activeMissions.map((mission, idx) => (
                  <V2MissionCardView
                    key={mission.id}
                    mission={mission}
                    activePlayer={gameState.activePlayer}
                    activeEvent={gameState.activeEvent}
                    worldview={gameState.worldview}
                    disabled={
                      !gameState.isLocalTurn ||
                      (gameState.activePlayer.actionPoints <= 0 &&
                        !gameState.activePlayer.activeBuffs?.freeTransmissionActive)
                    }
                    onTransmit={(m) => {
                      return gameState.transmitMission(m);
                    }}
                    dataTutorial={idx === 0 ? 'mission-card-0' : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {mobileTab === 'market' && (
            <V2MarketArea
              isMobile={true}
              player={gameState.activePlayer}
              activeEvent={gameState.activeEvent}
              market={gameState.market}
              tacticMarket={gameState.tacticMarket}
              worldview={gameState.worldview}
              disabled={!gameState.isLocalTurn}
              onBuyEquipment={(card, slot) => {
                const res = gameState.buyEquipment(card, slot);
                if (res && gameState.isTutorialMode && gameState.tutorialStep === 2) {
                  gameState.nextTutorialStep();
                }
                return res;
              }}
              onBuyTactic={gameState.buyTactic}
            />
          )}

          {mobileTab === 'tactics' && (
            <div className="flex flex-col gap-3">
              <V2ActionControlPanel
                player={gameState.activePlayer}
                isCurrentPlayer={gameState.isLocalTurn}
                isAI={gameState.activePlayer.isAI}
                worldview={gameState.worldview}
                onGoToTab={(tab) => setMobileTab(tab)}
                onPlayTactic={(t) => {
                  const res = gameState.playTactic(t);
                  if (res && gameState.isTutorialMode && gameState.tutorialStep === 3) {
                    gameState.nextTutorialStep();
                  }
                  return res;
                }}
                onRecharge={() => {
                  const res = gameState.rechargeEnergy();
                  if (res && gameState.isTutorialMode && gameState.tutorialStep === 6) {
                    gameState.nextTutorialStep();
                  }
                  return res;
                }}
                onRequisition={gameState.requestEmergencyRequisition}
                onEndTurn={() => {
                  gameState.endTurn();
                  if (gameState.isTutorialMode && gameState.tutorialStep === 7) {
                    gameState.nextTutorialStep();
                  }
                }}
              />

              <V2LogViewer logs={gameState.logs} />
            </div>
          )}

          {/* 5. Sticky Mobile Bottom Dock */}
          <V2MobileDock
            currentTab={mobileTab}
            onTabChange={setMobileTab}
            actionPoints={gameState.activePlayer.actionPoints}
            energy={gameState.activePlayer.energy}
            maxEnergy={gameState.activePlayer.maxEnergy}
            credits={gameState.activePlayer.credits}
            onEndTurn={() => {
              gameState.endTurn();
              if (gameState.isTutorialMode && gameState.tutorialStep === 7) {
                gameState.nextTutorialStep();
              }
            }}
            handTacticsCount={gameState.activePlayer.handTactics.length}
            disabled={!gameState.isLocalTurn}
            playerScore={gameState.activePlayer.score}
            targetScore={gameState.targetScore}
            activePlayerName={gameState.activePlayer.name}
            activePlayerAvatar={gameState.activePlayer.avatar}
            isCurrentPlayer={gameState.isLocalTurn}
            onOpenScoreboard={() => setIsScoreboardDrawerOpen(true)}
          />

          {/* 6. Mobile ☰ Drawer Menu */}
          <V2MobileMenuModal
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onOpenSettings={() => setIsDisplaySettingsOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenCompendium={() => setIsCompendiumOpen(true)}
            onStartTutorial={gameState.startTutorial}
            onSwitchToV1={onSwitchToV1}
            onReturnToMenu={gameState.returnToMenu}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* B. DESKTOP WIDE SCREEN VIEW (2-Tier Zero-Scroll Command Center)          */
        /* ========================================================================= */
        <div className="p-3 sm:p-4 flex flex-col gap-3 max-w-[1700px] w-full mx-auto relative font-mono">
          {/* 1. Header with Integrated Disaster Alert & Leaderboard Pill */}
          <V2TurnHeader
            round={gameState.round}
            maxRounds={gameState.maxRounds}
            targetScore={gameState.targetScore}
            activePlayer={gameState.activePlayer}
            worldview={gameState.worldview}
            onOpenDisplaySettings={() => setIsDisplaySettingsOpen(true)}
            onSwitchToV1={onSwitchToV1}
            onReturnToMenu={gameState.returnToMenu}
            onOpenCompendium={() => setIsCompendiumOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onStartTutorial={gameState.startTutorial}
            onToggleMobileView={toggleMobileMode}
            isMobileViewForced={forceMobileView}
            players={gameState.players}
            activeEvent={gameState.activeEvent}
            onOpenDisasterDetail={() => setIsDisasterModalOpen(true)}
            onOpenScoreboard={() => setIsScoreboardDrawerOpen(true)}
          />

          {/* 2. FIRST SCREEN: 左＝危機任務（主要任務）· 右＝PACE 防線 + 指揮官行動列
                 MAPS：看任務 → 看哪道防線接手 → 發起檢定 / 結束回合，全部在第一屏完成 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* Left: 3 Crisis Missions Stacked as Wide Rows */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                  <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
                  <h2 className="text-sm font-black text-slate-100 whitespace-nowrap">
                    突發危機任務
                  </h2>
                  <span className="text-[11px] text-slate-400 truncate hidden xl:inline">
                    · 右側即時顯示由哪道防線接手
                  </span>
                </div>
                {/* 破局機制：重抽任務 */}
                <button
                  onClick={() => gameState.refreshMissions()}
                  disabled={!gameState.isLocalTurn || gameState.activePlayer.actionPoints <= 0}
                  className="px-2.5 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-300 border border-cyan-500/40 text-[11px] font-black transition-all active:scale-95 shadow-sm whitespace-nowrap shrink-0"
                  title="三題都打不下來時，消耗 1 AP 汰換全場危機任務"
                >
                  🔄 重抽任務 (1 AP)
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {gameState.activeMissions.map((mission, idx) => (
                  <V2MissionCardView
                    key={mission.id}
                    mission={mission}
                    activePlayer={gameState.activePlayer}
                    activeEvent={gameState.activeEvent}
                    worldview={gameState.worldview}
                    variant="desktopRow"
                    disabled={
                      !gameState.isLocalTurn ||
                      (gameState.activePlayer.actionPoints <= 0 &&
                        !gameState.activePlayer.activeBuffs?.freeTransmissionActive)
                    }
                    onTransmit={(m) => {
                      return gameState.transmitMission(m);
                    }}
                    dataTutorial={idx === 0 ? 'mission-card-0' : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Right: PACE Defense Board + Compact Command Bar */}
            <div className="lg:col-span-7 flex flex-col gap-3 min-w-0">
              <CustomPaceBoard
                isVertical={false}
                onGoToMarket={focusDesktopMarket}
                player={gameState.activePlayer}
                activeEvent={gameState.activeEvent}
                isCurrentPlayer={gameState.isLocalTurn}
                worldview={gameState.worldview}
                onSwapSlots={handleSwapSlots}
                onStoreCard={handleStoreCard}
                onEquipFromInventory={handleEquipFromInventory}
                onRecycleInventoryCard={gameState.recycleInventoryCard}
              />

            {/* 指揮官行動列：手牌戰術 + 三個行動鍵 + 最新一筆日誌 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-black text-amber-400 whitespace-nowrap">🎮 指揮官行動</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 shrink-0 whitespace-nowrap">
                  ⚡ 戰術卡使用不消耗 AP
                </span>
              </div>

              {/* 本回合生效中的戰術增益（與手機戰術頁同一元件） */}
              <ActiveBuffsBanner player={gameState.activePlayer} />

              {/* Hand Tactics：有手牌時才佔空間 */}
              <div className="flex flex-col gap-1.5">
                {gameState.activePlayer.handTactics.length === 0 ? (
                  <span className="text-[11px] text-slate-500">
                    手牌戰術 (0)：可至下方市場的「🛡️ 戰術補給」採購
                  </span>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-1.5 max-h-[180px] overflow-y-auto pr-0.5">
                    {gameState.activePlayer.handTactics.map((tactic, idx) => {
                      const tContent = tactic.translations[gameState.worldview];
                      return (
                        <div
                          key={`${tactic.id}-${idx}`}
                          data-tutorial={idx === 0 ? 'tactic-card-0' : undefined}
                          className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/30 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-black text-purple-300 block break-words leading-tight">
                              ⚡ {tContent?.name}
                            </span>
                            <span className="text-[11px] text-slate-300 block break-words leading-snug mt-0.5">
                              {tContent?.desc}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const res = gameState.playTactic(tactic);
                              if (res && gameState.isTutorialMode && gameState.tutorialStep === 3) {
                                gameState.nextTutorialStep();
                              }
                            }}
                            disabled={!gameState.isLocalTurn}
                            className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] shrink-0 shadow-sm active:scale-95 transition-all disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed disabled:active:scale-100"
                          >
                            即時發動 (0 AP)
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Command Buttons：充電、調撥、結束回合同一列（結束回合為主要動作） */}
              <div className="flex flex-col gap-2 shrink-0">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    data-tutorial="recharge-btn"
                    onClick={() => {
                      const res = gameState.rechargeEnergy();
                      if (res && gameState.isTutorialMode && gameState.tutorialStep === 6) {
                        gameState.nextTutorialStep();
                      }
                    }}
                    disabled={!gameState.isLocalTurn || gameState.activePlayer.actionPoints <= 0 || gameState.activePlayer.energy >= gameState.activePlayer.maxEnergy}
                    className="py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 disabled:opacity-50 disabled:cursor-not-allowed text-amber-300 border border-amber-500/40 text-xs font-black transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                    title="緊急野戰充電 (+2⚡ / 1 AP)"
                  >
                    <span>⚡ 野戰充電 (+2⚡ / 1 AP)</span>
                  </button>
                  <button
                    data-tutorial="requisition-btn"
                    onClick={() => gameState.requestEmergencyRequisition()}
                    disabled={!gameState.isLocalTurn || gameState.activePlayer.actionPoints <= 0}
                    className="py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                    title="向應變中心申請緊急後勤調撥 (+2💰 / 1 AP)"
                  >
                    <span>💰 後勤調撥 (+2💰 / 1 AP)</span>
                  </button>
                  <button
                    data-tutorial="end-turn-btn"
                    onClick={() => {
                      gameState.endTurn();
                      if (gameState.isTutorialMode && gameState.tutorialStep === 7) {
                        gameState.nextTutorialStep();
                      }
                    }}
                    disabled={!gameState.isLocalTurn}
                    className="py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-black transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                    title="結束本回合"
                  >
                    <span>⏭️ 結束回合</span>
                  </button>
                </div>
              </div>

              {/* 最新一筆作戰日誌（完整日誌點開看），讓 AI 與天災動態仍看得到但不佔版面 */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 min-w-0">
                <span className="text-[11px] font-bold text-slate-300 whitespace-nowrap shrink-0">📜 最新：</span>
                <span
                  className={`text-[11px] truncate min-w-0 flex-1 ${
                    gameState.logs[0]?.type === 'alert'
                      ? 'text-red-300'
                      : gameState.logs[0]?.type === 'success'
                      ? 'text-emerald-300'
                      : gameState.logs[0]?.type === 'event'
                      ? 'text-amber-300'
                      : 'text-slate-400'
                  }`}
                  title={gameState.logs[0]?.message}
                >
                  {gameState.logs[0] ? `[第 ${gameState.logs[0].round} 輪] ${gameState.logs[0].message}` : '暫無作戰日誌'}
                </span>
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold underline shrink-0 whitespace-nowrap"
                  title="點擊展開完整作戰通訊日誌"
                >
                  完整日誌 ➔
                </button>
              </div>
            </div>
            </div>
          </div>

          {/* 3. SECOND SCREEN: 市場整排（需要補強防線時才往下捲） */}
          <div className="grid grid-cols-1 gap-3">
            {/* Equipment & Tactic Market with Tabs */}
            <div id="desktop-market-area" className="scroll-mt-4">
              <V2MarketArea
                focusEquipNonce={marketFocusNonce}
                player={gameState.activePlayer}
                activeEvent={gameState.activeEvent}
                market={gameState.market}
                tacticMarket={gameState.tacticMarket}
                worldview={gameState.worldview}
                disabled={!gameState.isLocalTurn}
                onBuyEquipment={(card, slot) => {
                  const res = gameState.buyEquipment(card, slot);
                  if (res && gameState.isTutorialMode && gameState.tutorialStep === 2) {
                    gameState.nextTutorialStep();
                  }
                  return res;
                }}
                onBuyTactic={gameState.buyTactic}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* C. SHARED OVERLAYS & MODALS                                               */}
      {/* ========================================================================= */}
      {gameState.isOnlineClient && (
        <OnlineConnectionBanner
          status={gameState.connectionStatus}
          message={gameState.connectionMsg}
          onReturnToMenu={gameState.returnToMenu}
        />
      )}

      {/* Interactive Step-by-Step Tutorial Overlay (Hidden when Debrief Modal is open) */}
      {gameState.isTutorialMode && !(gameState.lastTransmission && !gameState.lastTransmission.isOtherPlayer) && (
        <V2InteractiveTutorial
          step={gameState.tutorialStep}
          onNext={gameState.nextTutorialStep}
          onPrev={gameState.prevTutorialStep}
          onFinish={gameState.finishTutorial}
        />
      )}

      {/* Scoreboard Leaderboard BottomSheet Drawer (手機版底部 Dock 與桌面版 Header 救援榜共用) */}
      <V2MobileScoreboardDrawer
        isOpen={isScoreboardDrawerOpen}
        onClose={() => setIsScoreboardDrawerOpen(false)}
        players={gameState.players}
        activePlayerId={gameState.activePlayer.id}
        targetScore={gameState.targetScore}
      />

      {/* Shared Disaster Detail Modal (BottomSheet on mobile, Centered Modal on desktop) */}
      {isDisasterModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-fadeIn font-mono">
          <div onClick={() => setIsDisasterModalOpen(false)} className="fixed inset-0" />
          <div className="w-full max-w-lg mx-auto rounded-t-3xl sm:rounded-3xl border-t sm:border border-red-500/40 bg-slate-950 p-5 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto animate-slideUp sm:animate-scaleUp relative z-10">
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1 sm:hidden" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <span className="text-red-400">🌪️</span>
                <span>當前全域天災環境情報</span>
              </h3>
              <button
                onClick={() => setIsDisasterModalOpen(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 text-xs transition-all"
                aria-label="關閉天災情報"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <V2DisasterBanner
              event={gameState.activeEvent}
              worldview={gameState.worldview}
            />
            <button
              onClick={() => setIsDisasterModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all mt-1"
            >
              關閉天災情報
            </button>
          </div>
        </div>
      )}

      {/* Shared Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono">
          <div onClick={() => setIsLogModalOpen(false)} className="fixed inset-0" />
          <div className="w-full max-w-2xl mx-auto rounded-3xl border border-cyan-500/40 bg-slate-950 p-5 shadow-2xl flex flex-col gap-3 max-h-[85vh] relative z-10 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <span className="text-cyan-400">📜</span>
                <span>完整作戰指揮通訊日誌</span>
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 text-xs transition-all"
                aria-label="關閉日誌"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <V2LogViewer logs={gameState.logs} />
            </div>
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all mt-1"
            >
              關閉日誌
            </button>
          </div>
        </div>
      )}

      {/* 自己的檢定：完整報告（手機為 BottomSheet）；AI 的檢定：自動消失的提示條 */}
      <AITransmissionToast
        data={gameState.lastTransmission}
        worldview={gameState.worldview}
        isMobile={isMobileActive}
        onDismiss={gameState.clearLastTransmission}
      />
      <V2TransmissionResultModal
        data={gameState.lastTransmission?.isOtherPlayer ? null : gameState.lastTransmission}
        worldview={gameState.worldview}
        isMobile={isMobileActive}
        onClose={() => {
          gameState.clearLastTransmission();
          if (gameState.isTutorialMode && gameState.tutorialStep === 5) {
            gameState.nextTutorialStep();
          }
        }}
      />

      <V2GameOverModal
        winner={gameState.winner}
        players={gameState.players}
        onRestart={gameState.isOnlineClient ? undefined : gameState.restartGame}
        onReturnToMenu={gameState.returnToMenu}
      />

      <V2CardCompendiumModal
        isOpen={isCompendiumOpen}
        onClose={() => setIsCompendiumOpen(false)}
        worldview={gameState.worldview}
      />

      <V2GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <DisplaySettingsModal
        isOpen={isDisplaySettingsOpen}
        onClose={() => setIsDisplaySettingsOpen(false)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        theme={theme}
        onChangeTheme={setTheme}
        worldview={gameState.worldview}
        onChangeWorldview={gameState.setWorldview}
      />
    </div>
  );
}

export default AppV2;
