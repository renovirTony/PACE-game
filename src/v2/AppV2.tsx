import React, { useState, useEffect } from 'react';
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
import { LogViewer } from '../components/HUD/LogViewer';
import { V2ScoreBoard } from './components/HUD/V2ScoreBoard';
import { Radio, Bot, Users, Globe, Shield, Sparkles, Layers, BookOpen, GraduationCap, Sliders } from 'lucide-react';

interface AppV2Props {
  onSwitchToV1?: () => void;
}

export function AppV2({ onSwitchToV1 }: AppV2Props) {
  const gameState = useV2GameState();
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState(false);
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false);
  const [selectedBotCount, setSelectedBotCount] = useState(2);

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
                  <span>視覺與字體偏好</span>
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
        />
      </div>
    );
  }

  // Active Game Arena
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-mono">
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

        {/* Interactive Step-by-Step Tutorial Overlay (Hidden when Debrief Modal is open) */}
        {gameState.isTutorialMode && !gameState.lastTransmission && (
          <V2InteractiveTutorial
            step={gameState.tutorialStep}
            onNext={gameState.nextTutorialStep}
            onPrev={gameState.prevTutorialStep}
            onFinish={gameState.finishTutorial}
          />
        )}

        {/* Modals */}
        <V2TransmissionResultModal
          data={gameState.lastTransmission}
          worldview={gameState.worldview}
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
        />
      </div>
    </div>
  );
}

export default AppV2;
