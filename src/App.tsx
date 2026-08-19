import React, { useState } from 'react';
import { useGameState } from './engine/gameState';
import { TurnHeader } from './components/HUD/TurnHeader';
import { EventBanner } from './components/Cards/EventBanner';
import { MissionCardView } from './components/Cards/MissionCardView';
import { PACEBoard } from './components/Board/PACEBoard';
import { MarketArea } from './components/Market/MarketArea';
import { ActionControlPanel } from './components/HUD/ActionControlPanel';
import { LogViewer } from './components/HUD/LogViewer';
import { ScoreBoard } from './components/HUD/ScoreBoard';
import { TutorialModal } from './components/Modals/TutorialModal';
import { PACEGuideModal } from './components/Modals/PACEGuideModal';
import { TransmissionResultModal } from './components/Modals/TransmissionResultModal';
import { GameOverModal } from './components/Modals/GameOverModal';
import { Radio, Users, Bot, Shield, Play, Sparkles, BookOpen } from 'lucide-react';

export function App() {
  const gameState = useGameState();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedBotCount, setSelectedBotCount] = useState<number>(2);

  // Setup / Welcome Screen
  if (gameState.phase === 'SETUP') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#070A13] text-slate-100 relative overflow-hidden">
        {/* Background decorative radars */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-blue-500/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full rounded-3xl border border-cyan-500/30 bg-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
          {/* Logo */}
          <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-inner">
            <Radio className="w-12 h-12 animate-pulse" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-orbitron tracking-wider text-slate-100 mb-2">
            PACE <span className="text-cyan-400">通訊先鋒</span>
          </h1>
          <p className="text-xs sm:text-sm text-cyan-300/80 font-mono mb-6 tracking-widest uppercase">
            Comms Protocol · 戰術應急通訊網頁桌遊
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-left">
            在充滿突發危機、電磁脈衝 (EMP)、雪崩與全頻干擾的極端戰場中，組建屬於你的{' '}
            <strong className="text-cyan-400">[P] 主要</strong>、
            <strong className="text-blue-400">[A] 備用</strong>、
            <strong className="text-amber-400">[C] 應急</strong>、
            <strong className="text-red-400">[E] 緊急</strong> 四重通訊防線，
            即時連通搜救與戰術任務，奪得全場最高榮譽！
          </p>

          {/* Mode Selection */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => gameState.startGame('SinglePlayer', selectedBotCount)}
                className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black font-mono text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98]"
              >
                <Bot className="w-5 h-5" />
                <span>單人作戰 vs AI 指揮官</span>
              </button>

              <button
                onClick={() => gameState.startGame('PassAndPlay')}
                className="flex-1 p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold font-mono text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
              >
                <Users className="w-5 h-5" />
                <span>同機雙人對戰 (Pass & Play)</span>
              </button>
            </div>

            {/* AI Bot Count Setting */}
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400 pt-2">
              <span>AI 對手數量:</span>
              {[1, 2, 3].map(count => (
                <button
                  key={count}
                  onClick={() => setSelectedBotCount(count)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                    selectedBotCount === count
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {count} 位 AI
                </button>
              ))}
            </div>
          </div>

          {/* Quick Guide Actions */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-850 text-xs font-mono">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-all"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>遊戲規則手冊</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-all"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>PACE 原理科普</span>
            </button>
          </div>
        </div>

        <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
        <PACEGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      </div>
    );
  }

  // Active Game Arena
  return (
    <div className="min-h-screen p-3 sm:p-5 flex flex-col gap-4 max-w-[1600px] mx-auto text-slate-100">
      {/* Turn Header */}
      <TurnHeader
        round={gameState.round}
        maxRounds={gameState.maxRounds}
        targetScore={gameState.targetScore}
        activePlayer={gameState.activePlayer}
        isAI={gameState.activePlayer.isAI}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Global Environmental Hazard Banner */}
      <EventBanner event={gameState.activeEvent} />

      {/* Main Tactical Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Active Missions & Market (7 cols on xl) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          {/* Crisis Missions Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono font-bold text-slate-200">
                  當前突發危機任務 (Active Crisis Missions)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                點擊「發起廣播」驗證並獲取積分
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {gameState.activeMissions.map(mission => (
                <MissionCardView
                  key={mission.id}
                  mission={mission}
                  activePlayer={gameState.activePlayer}
                  activeEvent={gameState.activeEvent}
                  disabled={gameState.activePlayer.isAI || gameState.activePlayer.actionPoints <= 0}
                  onTransmit={gameState.transmitMission}
                />
              ))}
            </div>
          </div>

          {/* Market & Equipment Deck Area */}
          <MarketArea
            player={gameState.activePlayer}
            market={gameState.market}
            tacticMarket={gameState.tacticMarket}
            onBuyEquipment={gameState.buyEquipment}
            onBuyTactic={gameState.buyTactic}
            disabled={gameState.activePlayer.isAI}
          />
        </div>

        {/* Right Column: Player PACE Board & Action Controls (5 cols on xl) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* PACE Board */}
          <PACEBoard
            player={gameState.activePlayer}
            isCurrentPlayer={!gameState.activePlayer.isAI}
          />

          {/* Action Control Panel */}
          <ActionControlPanel
            player={gameState.activePlayer}
            isCurrentPlayer={!gameState.activePlayer.isAI}
            isAI={gameState.activePlayer.isAI}
            onPlayTactic={gameState.playTactic}
            onRecharge={gameState.rechargeEnergy}
            onEndTurn={gameState.endTurn}
          />

          {/* Log Viewer */}
          <LogViewer logs={gameState.logs} />
        </div>
      </div>

      {/* Bottom ScoreBoard */}
      <ScoreBoard
        players={gameState.players}
        activePlayerId={gameState.activePlayer.id}
        targetScore={gameState.targetScore}
      />

      {/* Modals */}
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <PACEGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <TransmissionResultModal
        data={gameState.lastTransmission}
        onClose={gameState.clearLastTransmission}
      />
      <GameOverModal
        winner={gameState.winner}
        players={gameState.players}
        targetScore={gameState.targetScore}
        onRestart={gameState.restartGame}
      />
    </div>
  );
}

export default App;
