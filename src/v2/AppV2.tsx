import React, { useState, useEffect, useCallback } from 'react';
import { useV2GameState } from './engine/gameState';
import { V2TurnHeader } from './components/HUD/V2TurnHeader';
import { V2DisasterBanner } from './components/Cards/V2DisasterBanner';
import { CustomPaceBoard } from './components/Board/CustomPaceBoard';
import { V2MissionCardView } from './components/Cards/V2MissionCardView';
import { V2MarketArea } from './components/Market/V2MarketArea';
import { V2ActionControlPanel } from './components/HUD/V2ActionControlPanel';
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
import { LogViewer } from '../components/HUD/LogViewer';
import { V2ScoreBoard } from './components/HUD/V2ScoreBoard';
import { Radio, Bot, Users, Globe, Shield, Sparkles, Layers, BookOpen, GraduationCap, Sliders, Smartphone, Monitor, Menu, X } from 'lucide-react';

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
  const [selectedBotCount, setSelectedBotCount] = useState(2);

  // Mobile Layout & Navigation State
  const [mobileTab, setMobileTab] = useState<MobileTab>('defense');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScoreboardDrawerOpen, setIsScoreboardDrawerOpen] = useState(false);

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
      return params.get('mobile') === '1' || localStorage.getItem('pace_force_mobile') === 'true';
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
      localStorage.setItem('pace_force_mobile', String(next));
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
      }
    }
  }, [gameState.isTutorialMode, gameState.tutorialStep]);

  const isMobileActive = isSmallScreen || forceMobileView;

  // Font Size state with localStorage persistence (Default to 'large' for enhanced desktop readability)
  const [fontSize, setFontSize] = useState<FontSizeMode>(() => {
    const saved = localStorage.getItem('pace_font_size');
    return (saved === 'normal' || saved === 'large' || saved === 'xlarge') ? saved : 'large';
  });

  // Color Theme state with localStorage persistence (3 curated modes: tactical-dark, soft-muted, daylight)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('pace_theme');
    return (saved === 'tactical-dark' || saved === 'soft-muted' || saved === 'daylight')
      ? (saved as ThemeMode)
      : 'tactical-dark';
  });

  // Apply font scale class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    root.classList.add(`font-scale-${fontSize}`);
    localStorage.setItem('pace_font_size', fontSize);
  }, [fontSize]);

  // Apply color theme data-attribute to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('pace_theme', theme);
  }, [theme]);

  // Auto-detect room parameter from URL (?v=2&room=CODE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && gameState.phase === 'SETUP') {
      setIsMultiplayerModalOpen(true);
    }
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
                  <span className="font-bold block mt-0.5 text-[10px]">廢土斷網</span>
                </button>
              </div>
            </div>

            {/* Primary Game Mode Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => gameState.startGame('SinglePlayer', selectedBotCount)}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98"
              >
                <Bot className="w-5 h-5" />
                <span>單人作戰 vs AI</span>
              </button>

              {/* AI Bot Count Setting */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                <span>AI 對手數量:</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedBotCount(count)}
                      className={`px-2.5 py-0.5 rounded-lg border text-xs font-bold transition-all ${
                        selectedBotCount === count
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      {count} 人
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => gameState.startGame('PassAndPlay')}
                className="w-full p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <Users className="w-4 h-4" />
                <span>同機雙人輪流作戰</span>
              </button>

              <button
                onClick={gameState.startTutorial}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 to-slate-900 border border-purple-500/50 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>實戰新手教學 (8步驟指引)</span>
              </button>

              <button
                onClick={() => setIsMultiplayerModalOpen(true)}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>建立/加入 遠端連線 (WebRTC P2P)</span>
              </button>
            </div>

            {/* Utilities Row */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800 text-[11px] flex-wrap">
              <button
                onClick={() => setIsDisplaySettingsOpen(true)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold px-2 py-1 rounded-lg hover:bg-cyan-950/30"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>視覺偏好</span>
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setIsCompendiumOpen(true)}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold px-2 py-1 rounded-lg hover:bg-purple-950/30"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>卡片圖鑑</span>
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold px-2 py-1 rounded-lg hover:bg-cyan-950/30"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>玩法手冊</span>
              </button>
            </div>

            {/* Switch to V1 */}
            {onSwitchToV1 && (
              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  onClick={onSwitchToV1}
                  className="text-[11px] text-slate-500 hover:text-cyan-400 underline"
                >
                  切換至 v1.0 經典原版 ➔
                </button>
              </div>
            )}
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
                <Sparkles className="w-4 h-4 text-cyan-400" /> 選擇演習作戰模式
              </span>

              {/* Mode Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => gameState.startGame('SinglePlayer', selectedBotCount)}
                  className="p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98]"
                >
                  <Bot className="w-5 h-5 text-white" />
                  <span>單人作戰 vs AI</span>
                </button>

                <button
                  onClick={() => gameState.startGame('PassAndPlay')}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
                >
                  <Users className="w-5 h-5" />
                  <span>同機雙人輪流</span>
                </button>
              </div>

              {/* AI Bot Count Setting */}
              <div className="flex items-center justify-between gap-3 text-xs text-slate-400 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/5">
                <span>AI 對手數量:</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedBotCount(count)}
                      className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                        selectedBotCount === count
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {count} 人
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Tutorial Button */}
              <button
                onClick={gameState.startTutorial}
                className="tutorial-launch-btn w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 hover:from-purple-900 hover:to-purple-900 border border-purple-500/50 text-purple-200 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-md shadow-purple-950/40"
              >
                <GraduationCap className="w-5 h-5 text-purple-400 animate-bounce" />
                <span>🎓 進入實戰新手教學 (8 步驟手把手引導)</span>
              </button>

              {/* Online Multiplayer Lobby Button */}
              <button
                onClick={() => setIsMultiplayerModalOpen(true)}
                className="multiplayer-launch-btn w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/50 text-cyan-200 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-md shadow-cyan-950/40"
              >
                <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                <span>🌐 建立/加入 遠端多人連線房間 (WebRTC P2P)</span>
              </button>

              {/* Utility Tools in Setup */}
              <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-slate-800 text-xs flex-wrap">
                <button
                  onClick={() => setIsDisplaySettingsOpen(true)}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-all px-2.5 py-1 rounded-lg hover:bg-cyan-950/40 border border-cyan-500/20"
                  title="調整字體大小與護眼主題配色"
                >
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>視覺與偏好設定</span>
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => setIsCompendiumOpen(true)}
                  className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold transition-all px-2.5 py-1 rounded-lg hover:bg-purple-950/30"
                >
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>卡片全圖鑑</span>
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-all px-2.5 py-1 rounded-lg hover:bg-cyan-950/30"
                  title="閱讀完整遊戲規則與玩法手冊"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>📖 遊戲玩法手冊</span>
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={toggleMobileMode}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-all px-2.5 py-1 rounded-lg hover:bg-amber-950/40 border border-amber-500/30"
                  title="在電腦螢幕上模擬手機直式操作介面"
                >
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>{forceMobileView ? '📱 手機模擬開啟中' : '📱 測試手機版直式'}</span>
                </button>
              </div>

              {/* Footer Switch to V1 */}
              {onSwitchToV1 && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-center">
                  <button
                    onClick={onSwitchToV1}
                    className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-all"
                  >
                    <span>想查看經典軍規原版？</span>
                    <span className="underline font-bold text-cyan-400">切換至 v1.0 經典原版 ➔</span>
                  </button>
                </div>
              )}
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
        <div className={`w-full max-w-md flex flex-col gap-3 relative pb-28 pt-2 px-3.5 ${forceMobileView && !isSmallScreen ? 'border border-slate-800 rounded-3xl bg-[#060913] shadow-2xl overflow-hidden' : ''}`}>
          {/* 1. Mobile Sticky Top Header with ☰ Menu Button */}
          <div className="sticky top-0 z-30 -mx-3.5 px-3 py-2 bg-[#060913]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shadow-md gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 flex items-center gap-1 text-xs font-black shadow-sm active:scale-95 shrink-0 whitespace-nowrap"
                title="展開指揮官工具選單"
              >
                <Menu className="w-4 h-4 shrink-0" />
                <span className="text-[11px] whitespace-nowrap">選單</span>
              </button>

              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <span className="text-xs font-black text-slate-100 font-orbitron whitespace-nowrap">
                  PACE <span className="text-cyan-400">先鋒</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold whitespace-nowrap">
                  第 {gameState.round}/{gameState.maxRounds} 輪
                </span>
              </div>
            </div>

            {/* Mini Disaster Pill with tap to view briefing */}
            <div className="flex items-center gap-1.5 text-[10px] shrink-0">
              {(() => {
                const event = gameState.activeEvent;
                const isSunny = !event || event.id === 'evt_optimal_calm' || event.targetedMedia.length === 0;
                if (isSunny) {
                  return (
                    <button
                      onClick={() => setIsDisasterModalOpen(true)}
                      className="px-2.5 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1 shrink-0 whitespace-nowrap transition-all shadow-sm active:scale-95"
                      title="點擊查看天氣情資"
                    >
                      <span className="whitespace-nowrap">☀️ 晴朗和平</span>
                      <span className="text-[9px] opacity-70">ℹ️</span>
                    </button>
                  );
                }
                const rawTitle = event.translations[gameState.worldview]?.title || '天災襲擊';
                const shortTitle = rawTitle.split(' (')[0].split('（')[0].trim();
                return (
                  <button
                    onClick={() => setIsDisasterModalOpen(true)}
                    className="px-2.5 py-1 rounded-full bg-red-950/90 hover:bg-red-900 text-red-300 border border-red-500/40 font-bold text-[10px] flex items-center gap-1 animate-pulse shrink-0 whitespace-nowrap transition-all shadow-sm active:scale-95"
                    title="點擊查看天災受災詳情"
                  >
                    <span className="whitespace-nowrap">🌪️ {shortTitle}</span>
                    <span className="text-[9px] opacity-70">ℹ️</span>
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
              isCurrentPlayer={!gameState.activePlayer.isAI}
              worldview={gameState.worldview}
              onSwapSlots={(slotA, slotB) => {
                const res = gameState.swapSlots(slotA, slotB);
                if (gameState.isTutorialMode && gameState.tutorialStep === 4) {
                  gameState.nextTutorialStep();
                }
                return res;
              }}
              onStoreCard={(slot) => {
                gameState.storeCard(slot);
                if (gameState.isTutorialMode && gameState.tutorialStep === 4) {
                  gameState.nextTutorialStep();
                }
              }}
              onEquipFromInventory={(card, slot) => {
                const res = gameState.equipFromInventory(card, slot);
                if (gameState.isTutorialMode && gameState.tutorialStep === 4) {
                  gameState.nextTutorialStep();
                }
                return res;
              }}
              onDiscardFromInventory={gameState.discardFromInventory}
            />
          )}

          {mobileTab === 'missions' && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-3 sm:p-4 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                    當前突發危機任務 (常駐 3 題)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">
                  自動階梯 Fallback 檢驗
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {gameState.activeMissions.map((mission, idx) => (
                  <V2MissionCardView
                    key={mission.id}
                    mission={mission}
                    activePlayer={gameState.activePlayer}
                    activeEvent={gameState.activeEvent}
                    worldview={gameState.worldview}
                    disabled={
                      gameState.activePlayer.isAI ||
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
              disabled={gameState.activePlayer.isAI}
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
                isCurrentPlayer={!gameState.activePlayer.isAI}
                isAI={gameState.activePlayer.isAI}
                worldview={gameState.worldview}
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
                onEndTurn={() => {
                  gameState.endTurn();
                  if (gameState.isTutorialMode && gameState.tutorialStep === 7) {
                    gameState.nextTutorialStep();
                  }
                }}
              />

              <LogViewer logs={gameState.logs} />
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
            canRecharge={gameState.activePlayer.actionPoints > 0 && gameState.activePlayer.energy < gameState.activePlayer.maxEnergy}
            onRecharge={() => {
              const res = gameState.rechargeEnergy();
              if (res && gameState.isTutorialMode && gameState.tutorialStep === 6) {
                gameState.nextTutorialStep();
              }
            }}
            onEndTurn={() => {
              gameState.endTurn();
              if (gameState.isTutorialMode && gameState.tutorialStep === 7) {
                gameState.nextTutorialStep();
              }
            }}
            handTacticsCount={gameState.activePlayer.handTactics.length}
            disabled={gameState.activePlayer.isAI}
            playerScore={gameState.activePlayer.score}
            targetScore={gameState.targetScore}
            activePlayerName={gameState.activePlayer.name}
            activePlayerAvatar={gameState.activePlayer.avatar}
            isCurrentPlayer={!gameState.activePlayer.isAI}
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

          {/* 7. Mobile Disaster Detail BottomSheet */}
          {isDisasterModalOpen && (
            <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex flex-col justify-end animate-fadeIn font-mono">
              <div onClick={() => setIsDisasterModalOpen(false)} className="flex-1" />
              <div className="w-full max-w-lg mx-auto rounded-t-3xl border-t border-red-500/40 bg-slate-950 p-5 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto animate-slideUp">
                <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1" />
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                    <span className="text-red-400">🌪️</span>
                    <span>當前全域天災環境情報</span>
                  </h3>
                  <button
                    onClick={() => setIsDisasterModalOpen(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 text-xs transition-all"
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
                  關閉天災情報 ➔
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* B. DESKTOP WIDE SCREEN VIEW (Command Center)                             */
        /* ========================================================================= */
        <div className="p-3 sm:p-5 flex flex-col gap-4 max-w-[1700px] w-full mx-auto relative">
          {/* 1. Header with Worldview Switcher and Modals */}
          <V2TurnHeader
            round={gameState.round}
            maxRounds={gameState.maxRounds}
            targetScore={gameState.targetScore}
            activePlayer={gameState.activePlayer}
            isAI={gameState.activePlayer.isAI}
            worldview={gameState.worldview}
            onChangeWorldview={gameState.setWorldview}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
            theme={theme}
            onOpenDisplaySettings={() => setIsDisplaySettingsOpen(true)}
            onSwitchToV1={onSwitchToV1}
            onReturnToMenu={gameState.returnToMenu}
            onOpenCompendium={() => setIsCompendiumOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onStartTutorial={gameState.startTutorial}
            onToggleMobileView={toggleMobileMode}
            isMobileViewForced={forceMobileView}
          />

          {/* 2. Disaster Environmental Hazard Banner */}
          <V2DisasterBanner
            event={gameState.activeEvent}
            worldview={gameState.worldview}
          />

          {/* 3. Commander Custom PACE Defense Board */}
          <CustomPaceBoard
            player={gameState.activePlayer}
            activeEvent={gameState.activeEvent}
            isCurrentPlayer={!gameState.activePlayer.isAI}
            worldview={gameState.worldview}
            onSwapSlots={(slotA, slotB) => {
              const res = gameState.swapSlots(slotA, slotB);
              if (gameState.isTutorialMode && gameState.tutorialStep === 4) {
                gameState.nextTutorialStep();
              }
              return res;
            }}
            onStoreCard={(slot) => {
              gameState.storeCard(slot);
              if (gameState.isTutorialMode && gameState.tutorialStep === 4) {
                gameState.nextTutorialStep();
              }
            }}
            onEquipFromInventory={(card, slot) => {
              const res = gameState.equipFromInventory(card, slot);
              if (gameState.isTutorialMode && gameState.tutorialStep === 4) {
                gameState.nextTutorialStep();
              }
              return res;
            }}
            onDiscardFromInventory={gameState.discardFromInventory}
          />

          {/* 4. Operational Area: Left (Missions + Market) / Right (Actions + Log) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Left Column (7 cols): Active Missions + Market */}
            <div className="xl:col-span-7 flex flex-col gap-4">
              {/* Active Crisis Missions */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-100">
                      當前突發危機任務 (Crisis Missions)
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    點擊發起檢驗，系統自動逐層 Fallback (常駐 3 題無限輪替)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {gameState.activeMissions.map((mission, idx) => (
                    <V2MissionCardView
                      key={mission.id}
                      mission={mission}
                      activePlayer={gameState.activePlayer}
                      activeEvent={gameState.activeEvent}
                      worldview={gameState.worldview}
                      disabled={
                        gameState.activePlayer.isAI ||
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

              {/* Equipment & Tactic Market */}
              <V2MarketArea
                player={gameState.activePlayer}
                activeEvent={gameState.activeEvent}
                market={gameState.market}
                tacticMarket={gameState.tacticMarket}
                worldview={gameState.worldview}
                disabled={gameState.activePlayer.isAI}
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

            {/* Right Column (5 cols): Action Controls + Combat Log */}
            <div className="xl:col-span-5 flex flex-col gap-4">
              <V2ActionControlPanel
                player={gameState.activePlayer}
                isCurrentPlayer={!gameState.activePlayer.isAI}
                isAI={gameState.activePlayer.isAI}
                worldview={gameState.worldview}
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
                onEndTurn={() => {
                  gameState.endTurn();
                  if (gameState.isTutorialMode && gameState.tutorialStep === 7) {
                    gameState.nextTutorialStep();
                  }
                }}
              />

              <LogViewer logs={gameState.logs} />
            </div>
          </div>

          {/* 5. Bottom Leaderboard */}
          <V2ScoreBoard
            players={gameState.players}
            activePlayerId={gameState.activePlayer.id}
            targetScore={gameState.targetScore}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* C. SHARED OVERLAYS & MODALS                                               */}
      {/* ========================================================================= */}
      {/* Interactive Step-by-Step Tutorial Overlay (Hidden when Debrief Modal is open) */}
      {gameState.isTutorialMode && !gameState.lastTransmission && (
        <V2InteractiveTutorial
          step={gameState.tutorialStep}
          onNext={gameState.nextTutorialStep}
          onPrev={gameState.prevTutorialStep}
          onFinish={gameState.finishTutorial}
        />
      )}

      {/* Mobile Scoreboard Leaderboard BottomSheet Drawer */}
      <V2MobileScoreboardDrawer
        isOpen={isScoreboardDrawerOpen}
        onClose={() => setIsScoreboardDrawerOpen(false)}
        players={gameState.players}
        activePlayerId={gameState.activePlayer.id}
        targetScore={gameState.targetScore}
      />

      {/* Transmission Result Modal (Adapts as BottomSheet on mobile) */}
      <V2TransmissionResultModal
        data={gameState.lastTransmission}
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
        worldview={gameState.worldview}
        onRestart={gameState.restartGame}
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
