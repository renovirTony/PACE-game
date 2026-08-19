import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  CommsCard, 
  CrisisMission, 
  GameLog, 
  GamePhase, 
  GlobalEvent, 
  PACESlot, 
  Player, 
  TacticCard, 
  TransmissionResult 
} from '../types/game';
import { EQUIPMENT_CARDS, STARTER_PRIMARY_CARDS } from '../data/equipmentCards';
import { CRISIS_MISSIONS } from '../data/missionCards';
import { GLOBAL_EVENTS } from '../data/eventCards';
import { TACTIC_CARDS } from '../data/tacticCards';
import { evaluatePACETransmission } from './rules';
import { computeAIDecision } from './ai';
import { audioManager } from './audio';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface UseGameStateReturn {
  round: number;
  maxRounds: number;
  targetScore: number;
  phase: GamePhase;
  players: Player[];
  activePlayerIndex: number;
  activePlayer: Player;
  market: CommsCard[];
  tacticMarket: TacticCard[];
  activeMissions: CrisisMission[];
  activeEvent: GlobalEvent | null;
  logs: GameLog[];
  winner: Player | null;
  lastTransmission: { result: TransmissionResult; mission: CrisisMission; playerName: string } | null;
  isAITurn: boolean;
  gameMode: 'SinglePlayer' | 'PassAndPlay';
  botCount: number;
  
  // Interactive Tutorial
  isTutorialMode: boolean;
  tutorialStep: number;
  setTutorialStep: (step: number) => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  startTutorial: () => void;
  finishTutorial: () => void;

  // Actions
  startGame: (mode: 'SinglePlayer' | 'PassAndPlay', botCount?: number) => void;
  buyEquipment: (card: CommsCard, targetSlot?: PACESlot) => boolean;
  buyTactic: (card: TacticCard) => boolean;
  playTactic: (card: TacticCard) => boolean;
  rechargeEnergy: () => boolean;
  transmitMission: (mission: CrisisMission) => TransmissionResult;
  endTurn: () => void;
  clearLastTransmission: () => void;
  restartGame: () => void;
  returnToMenu: () => void;
}

export function useGameState(): UseGameStateReturn {
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(8);
  const [targetScore] = useState(18);
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [gameMode, setGameMode] = useState<'SinglePlayer' | 'PassAndPlay'>('SinglePlayer');
  const [botCount, setBotCount] = useState<number>(2);

  // Tutorial state
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);

  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const [equipmentDeck, setEquipmentDeck] = useState<CommsCard[]>([]);
  const [market, setMarket] = useState<CommsCard[]>([]);

  const [tacticDeck, setTacticDeck] = useState<TacticCard[]>([]);
  const [tacticMarket, setTacticMarket] = useState<TacticCard[]>([]);

  const [missionDeck, setMissionDeck] = useState<CrisisMission[]>([]);
  const [activeMissions, setActiveMissions] = useState<CrisisMission[]>([]);

  const [eventDeck, setEventDeck] = useState<GlobalEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<GlobalEvent | null>(null);

  const [logs, setLogs] = useState<GameLog[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [lastTransmission, setLastTransmission] = useState<{ result: TransmissionResult; mission: CrisisMission; playerName: string } | null>(null);

  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((type: GameLog['type'], message: string, playerId?: string, playerName?: string, details?: string) => {
    const newLog: GameLog = {
      id: Math.random().toString(36).substring(2, 9),
      round,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      playerId,
      playerName,
      message,
      details
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, [round]);

  // 初始化並開始遊戲
  const startGame = useCallback((mode: 'SinglePlayer' | 'PassAndPlay', bots: number = 2) => {
    setGameMode(mode);
    setBotCount(bots);
    setIsTutorialMode(false);

    // 準備卡牌庫
    const shuffledEquip = shuffleArray(EQUIPMENT_CARDS);
    const initialMarket = shuffledEquip.slice(0, 4);
    const restEquip = shuffledEquip.slice(4);

    const shuffledTactics = shuffleArray(TACTIC_CARDS);
    const initialTacticMarket = shuffledTactics.slice(0, 3);
    const restTactics = shuffledTactics.slice(3);

    const shuffledMissions = shuffleArray(CRISIS_MISSIONS);
    const initialMissions = shuffledMissions.slice(0, 3);
    const restMissions = shuffledMissions.slice(3);

    const shuffledEvents = shuffleArray(GLOBAL_EVENTS);
    const initialEvent = shuffledEvents[0];
    const restEvents = shuffledEvents.slice(1);

    // 玩家配置
    const newPlayers: Player[] = [];
    
    // 主玩家
    const starterCard1 = STARTER_PRIMARY_CARDS[0];
    newPlayers.push({
      id: 'player_1',
      name: '指揮官 (Player 1)',
      isAI: false,
      avatar: '🛡️',
      color: '#06B6D4',
      score: 0,
      credits: 4,
      actionPoints: 3,
      maxActionPoints: 3,
      energy: 4,
      maxEnergy: 6,
      paceBoard: {
        P: starterCard1,
        A: null,
        C: null,
        E: null
      },
      handTactics: [shuffledTactics[0]],
      completedMissions: [],
      stats: {
        transmissions: 0,
        fallbacksTriggered: 0,
        pSuccesses: 0,
        aSuccesses: 0,
        cSuccesses: 0,
        eSuccesses: 0
      }
    });

    if (mode === 'SinglePlayer') {
      const botConfigs = [
        { name: 'AI 戰術核心-阿爾法', avatar: '🤖', color: '#3B82F6', personality: 'Resilient' as const },
        { name: 'AI 訊號尖兵-貝塔', avatar: '🛰️', color: '#F59E0B', personality: 'Aggressive' as const },
        { name: 'AI 應急指揮-伽瑪', avatar: '📡', color: '#10B981', personality: 'Balanced' as const }
      ];

      for (let i = 0; i < bots; i++) {
        const cfg = botConfigs[i % botConfigs.length];
        const botStarter = STARTER_PRIMARY_CARDS[(i + 1) % STARTER_PRIMARY_CARDS.length];
        newPlayers.push({
          id: `bot_${i + 1}`,
          name: cfg.name,
          isAI: true,
          aiPersonality: cfg.personality,
          avatar: cfg.avatar,
          color: cfg.color,
          score: 0,
          credits: 4,
          actionPoints: 3,
          maxActionPoints: 3,
          energy: 4,
          maxEnergy: 6,
          paceBoard: {
            P: botStarter,
            A: null,
            C: null,
            E: null
          },
          handTactics: [shuffledTactics[i + 1]],
          completedMissions: [],
          stats: {
            transmissions: 0,
            fallbacksTriggered: 0,
            pSuccesses: 0,
            aSuccesses: 0,
            cSuccesses: 0,
            eSuccesses: 0
          }
        });
      }
    } else {
      // 本地 Pass & Play
      for (let i = 2; i <= 2; i++) {
        const pStarter = STARTER_PRIMARY_CARDS[(i - 1) % STARTER_PRIMARY_CARDS.length];
        newPlayers.push({
          id: `player_${i}`,
          name: `指揮官 (Player ${i})`,
          isAI: false,
          avatar: '🎖️',
          color: '#3B82F6',
          score: 0,
          credits: 4,
          actionPoints: 3,
          maxActionPoints: 3,
          energy: 4,
          maxEnergy: 6,
          paceBoard: {
            P: pStarter,
            A: null,
            C: null,
            E: null
          },
          handTactics: [shuffledTactics[i]],
          completedMissions: [],
          stats: {
            transmissions: 0,
            fallbacksTriggered: 0,
            pSuccesses: 0,
            aSuccesses: 0,
            cSuccesses: 0,
            eSuccesses: 0
          }
        });
      }
    }

    setEquipmentDeck(restEquip);
    setMarket(initialMarket);
    setTacticDeck(restTactics);
    setTacticMarket(initialTacticMarket);
    setMissionDeck(restMissions);
    setActiveMissions(initialMissions);
    setEventDeck(restEvents);
    setActiveEvent(initialEvent);
    setPlayers(newPlayers);
    setActivePlayerIndex(0);
    setRound(1);
    setWinner(null);
    setLastTransmission(null);
    setPhase('PLAYER_ACTION');

    addLog('info', `遊戲開始！當前環境事件：【${initialEvent.title}】`);
    audioManager.playAlertSound();
  }, [addLog]);

  // 啟動實戰新手教學模式
  const startTutorial = useCallback(() => {
    setIsTutorialMode(true);
    setTutorialStep(1);
    setGameMode('SinglePlayer');
    setBotCount(1);

    // 準備固定且具教學意義的卡牌組合
    const starterP = STARTER_PRIMARY_CARDS[0]; // 5G Mesh Cell
    const vhfCard = EQUIPMENT_CARDS.find(c => c.id === 'a_vhf_sincgars') || EQUIPMENT_CARDS[4];
    const wireCard = EQUIPMENT_CARDS.find(c => c.id === 'c_field_wire_ta312') || EQUIPMENT_CARDS[8];
    const aldisCard = EQUIPMENT_CARDS.find(c => c.id === 'e_aldis_lamp') || EQUIPMENT_CARDS[12];
    const otherEquips = EQUIPMENT_CARDS.filter(c => c.id !== vhfCard.id && c.id !== wireCard.id && c.id !== aldisCard.id);

    const tutorialMarket = [vhfCard, wireCard, aldisCard, otherEquips[0]];
    const restEquip = otherEquips.slice(1);

    const genTactic = TACTIC_CARDS.find(t => t.id === 'tac_power_generator') || TACTIC_CARDS[0];
    const airTactic = TACTIC_CARDS.find(t => t.id === 'tac_supply_airdrop') || TACTIC_CARDS[1];
    const restTactics = TACTIC_CARDS.filter(t => t.id !== genTactic.id && t.id !== airTactic.id);

    const mission1 = CRISIS_MISSIONS.find(m => m.id === 'mis_mountain_avalanche') || CRISIS_MISSIONS[1];
    const mission2 = CRISIS_MISSIONS.find(m => m.id === 'mis_hostile_jamming_breakthrough') || CRISIS_MISSIONS[6];
    const mission3 = CRISIS_MISSIONS.find(m => m.id === 'mis_high_res_recon') || CRISIS_MISSIONS[0];
    const restMissions = CRISIS_MISSIONS.filter(m => m.id !== mission1.id && m.id !== mission2.id && m.id !== mission3.id);

    const clearEvent = GLOBAL_EVENTS.find(e => e.id === 'evt_clear_skies') || GLOBAL_EVENTS[5];

    const tutorialPlayer: Player = {
      id: 'player_1',
      name: '新晉指揮官 (學員)',
      isAI: false,
      avatar: '🛡️',
      color: '#06B6D4',
      score: 0,
      credits: 6,
      actionPoints: 3,
      maxActionPoints: 3,
      energy: 2, // 刻意設低，讓玩家體驗使用戰術發電機
      maxEnergy: 6,
      paceBoard: {
        P: starterP,
        A: null,
        C: null,
        E: null
      },
      handTactics: [genTactic],
      completedMissions: [],
      stats: {
        transmissions: 0,
        fallbacksTriggered: 0,
        pSuccesses: 0,
        aSuccesses: 0,
        cSuccesses: 0,
        eSuccesses: 0
      }
    };

    const dummyBot: Player = {
      id: 'bot_instructor',
      name: '作戰教官-席格諾',
      isAI: true,
      aiPersonality: 'Balanced',
      avatar: '👨‍🏫',
      color: '#3B82F6',
      score: 0,
      credits: 4,
      actionPoints: 3,
      maxActionPoints: 3,
      energy: 4,
      maxEnergy: 6,
      paceBoard: {
        P: starterP,
        A: null,
        C: null,
        E: null
      },
      handTactics: [airTactic],
      completedMissions: [],
      stats: {
        transmissions: 0,
        fallbacksTriggered: 0,
        pSuccesses: 0,
        aSuccesses: 0,
        cSuccesses: 0,
        eSuccesses: 0
      }
    };

    setPlayers([tutorialPlayer, dummyBot]);
    setActivePlayerIndex(0);
    setMarket(tutorialMarket);
    setEquipmentDeck(restEquip);
    setTacticMarket([airTactic]);
    setTacticDeck(restTactics);
    setActiveMissions([mission1, mission2, mission3]);
    setMissionDeck(restMissions);
    setActiveEvent(clearEvent);
    setRound(1);
    setWinner(null);
    setLastTransmission(null);
    setPhase('PLAYER_ACTION');

    addLog('info', '🎓 歡迎進入 PACE 通訊先鋒實戰新手引導！請跟隨畫面指示完成各項操作。');
    audioManager.playAlertSound();
  }, [addLog]);

  const nextTutorialStep = useCallback(() => {
    setTutorialStep(prev => prev + 1);
  }, []);

  const prevTutorialStep = useCallback(() => {
    setTutorialStep(prev => Math.max(1, prev - 1));
  }, []);

  const finishTutorial = useCallback(() => {
    setIsTutorialMode(false);
    setPhase('SETUP');
    addLog('success', '🎉 恭喜完成新手實戰教學！您已具備成為頂尖應急指揮官的所有基本觀念！');
  }, [addLog]);

  const activePlayer = players[activePlayerIndex] || players[0];
  const isAITurn = Boolean(activePlayer && activePlayer.isAI && phase === 'PLAYER_ACTION' && !isTutorialMode);

  // 購買設備
  const buyEquipment = useCallback((card: CommsCard, targetSlot?: PACESlot): boolean => {
    if (!activePlayer || activePlayer.actionPoints <= 0) {
      addLog('alert', '行動點數 (AP) 不足！', activePlayer?.id, activePlayer?.name);
      return false;
    }
    if (activePlayer.credits < card.cost) {
      addLog('alert', `物資資金不足！(需要 ${card.cost} 💰，現有 ${activePlayer.credits} 💰)`, activePlayer.id, activePlayer.name);
      return false;
    }

    const slotToEquip = targetSlot || card.slot;
    const oldCard = activePlayer.paceBoard[slotToEquip];

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        credits: p.credits - card.cost,
        actionPoints: p.actionPoints - 1,
        paceBoard: {
          ...p.paceBoard,
          [slotToEquip]: card
        }
      };
    }));

    // 市場遞補
    setMarket(prev => {
      const nextMarket = prev.filter(c => c.id !== card.id);
      if (equipmentDeck.length > 0) {
        const [nextCard, ...rest] = equipmentDeck;
        setEquipmentDeck(rest);
        return [...nextMarket, nextCard];
      }
      return nextMarket;
    });

    audioManager.playEquipSound();
    addLog(
      'action',
      `裝備了【${slotToEquip} 槽位】：${card.name} ${oldCard ? `(替換 ${oldCard.name})` : ''}`,
      activePlayer.id,
      activePlayer.name
    );

    // 教學步驟推進
    if (isTutorialMode && tutorialStep === 2) {
      setTutorialStep(3);
    }

    return true;
  }, [activePlayer, activePlayerIndex, equipmentDeck, isTutorialMode, tutorialStep, addLog]);

  // 購買戰術卡
  const buyTactic = useCallback((card: TacticCard): boolean => {
    if (!activePlayer || activePlayer.actionPoints <= 0) return false;
    if (activePlayer.credits < card.cost) {
      addLog('alert', `物資資金不足！(需要 ${card.cost} 💰)`, activePlayer.id, activePlayer.name);
      return false;
    }
    if (activePlayer.handTactics.length >= 4) {
      addLog('alert', '戰術手牌已達上限 (最多 4 張)！', activePlayer.id, activePlayer.name);
      return false;
    }

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        credits: p.credits - card.cost,
        actionPoints: p.actionPoints - 1,
        handTactics: [...p.handTactics, card]
      };
    }));

    setTacticMarket(prev => {
      const nextM = prev.filter(t => t.id !== card.id);
      if (tacticDeck.length > 0) {
        const [nextCard, ...rest] = tacticDeck;
        setTacticDeck(rest);
        return [...nextM, nextCard];
      }
      return nextM;
    });

    audioManager.playClick();
    addLog('action', `購買了戰術手牌【${card.name}】`, activePlayer.id, activePlayer.name);
    return true;
  }, [activePlayer, activePlayerIndex, tacticDeck, addLog]);

  // 使用戰術卡
  const playTactic = useCallback((card: TacticCard): boolean => {
    if (!activePlayer || activePlayer.actionPoints <= 0) return false;

    let successMessage = '';
    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;

      let energy = p.energy;
      let credits = p.credits;

      switch (card.effectType) {
        case 'GAIN_ENERGY':
          energy = Math.min(p.maxEnergy, energy + (card.value || 3));
          successMessage = `啟動柴油發電機，電量補充至 ${energy}⚡！`;
          break;
        case 'GAIN_CREDITS':
          credits += (card.value || 3);
          successMessage = `收到空投補給，資金增加 ${card.value || 3} 💰！`;
          break;
        case 'SCOUT_AHEAD':
          credits += 1;
          energy = Math.min(p.maxEnergy, energy + 1);
          successMessage = `先遣無人機偵察完成 (+1💰 / +1⚡)！`;
          break;
        default:
          successMessage = `啟動戰術卡【${card.name}】：${card.description}`;
          break;
      }

      return {
        ...p,
        energy,
        credits,
        actionPoints: p.actionPoints - 1,
        handTactics: p.handTactics.filter(t => t.id !== card.id)
      };
    }));

    audioManager.playClick();
    addLog('action', successMessage, activePlayer.id, activePlayer.name);

    if (isTutorialMode && tutorialStep === 3) {
      setTutorialStep(4);
    }

    return true;
  }, [activePlayer, activePlayerIndex, isTutorialMode, tutorialStep, addLog]);

  // 手動手搖充電/充能
  const rechargeEnergy = useCallback((): boolean => {
    if (!activePlayer || activePlayer.actionPoints <= 0) return false;
    if (activePlayer.energy >= activePlayer.maxEnergy) {
      addLog('info', '蓄電池已處於充飽狀態！', activePlayer.id, activePlayer.name);
      return false;
    }

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        energy: Math.min(p.maxEnergy, p.energy + 2),
        actionPoints: p.actionPoints - 1
      };
    }));

    audioManager.playClick();
    addLog('action', '進行野戰充能，電量 +2 ⚡', activePlayer.id, activePlayer.name);

    if (isTutorialMode && tutorialStep === 4) {
      setTutorialStep(5);
    }

    return true;
  }, [activePlayer, activePlayerIndex, isTutorialMode, tutorialStep, addLog]);

  // 執行危機任務廣播 (Transmission)
  const transmitMission = useCallback((mission: CrisisMission): TransmissionResult => {
    if (!activePlayer) {
      return { canTransmit: false, successfulSlot: null, usedCard: null, fallbackDepth: -1, reason: '無效玩家', bonusPoints: 0, slotDetails: [] };
    }
    if (activePlayer.actionPoints <= 0) {
      addLog('alert', '行動點數 (AP) 不足，無法發起廣播通訊！', activePlayer.id, activePlayer.name);
      return { canTransmit: false, successfulSlot: null, usedCard: null, fallbackDepth: -1, reason: '行動點數不足', bonusPoints: 0, slotDetails: [] };
    }

    if (mission.claimedBy.includes(activePlayer.id)) {
      addLog('alert', '你已完成過此項通訊任務！', activePlayer.id, activePlayer.name);
      return { canTransmit: false, successfulSlot: null, usedCard: null, fallbackDepth: -1, reason: '已完成過此任務', bonusPoints: 0, slotDetails: [] };
    }

    const result = evaluatePACETransmission(activePlayer, mission, activeEvent);
    setLastTransmission({ result, mission, playerName: activePlayer.name });

    if (result.canTransmit && result.usedCard && result.successfulSlot) {
      const earnedVP = mission.vp + result.bonusPoints;
      const earnedCredits = mission.creditReward;
      const consumedEnergy = result.usedCard.powerCost + (activeEvent?.powerDrainBonus || 0);

      // 更新玩家狀態
      setPlayers(prev => prev.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;

        const isFallback = result.fallbackDepth > 0;
        return {
          ...p,
          score: p.score + earnedVP,
          credits: p.credits + earnedCredits,
          energy: Math.max(0, p.energy - consumedEnergy),
          actionPoints: p.actionPoints - 1,
          completedMissions: [...p.completedMissions, mission.id],
          stats: {
            ...p.stats,
            transmissions: p.stats.transmissions + 1,
            fallbacksTriggered: p.stats.fallbacksTriggered + (isFallback ? 1 : 0),
            pSuccesses: p.stats.pSuccesses + (result.successfulSlot === 'P' ? 1 : 0),
            aSuccesses: p.stats.aSuccesses + (result.successfulSlot === 'A' ? 1 : 0),
            cSuccesses: p.stats.cSuccesses + (result.successfulSlot === 'C' ? 1 : 0),
            eSuccesses: p.stats.eSuccesses + (result.successfulSlot === 'E' ? 1 : 0),
          }
        };
      }));

      // 標記任務被認領
      setActiveMissions(prev => prev.map(m => {
        if (m.id === mission.id) {
          return {
            ...m,
            claimedBy: [...m.claimedBy, activePlayer.id]
          };
        }
        return m;
      }));

      audioManager.playTransmissionSound(result.fallbackDepth > 0);
      addLog(
        'success',
        `📡 廣播通訊成功！完成【${mission.title}】獲得 ${earnedVP} VP & ${earnedCredits} 💰！(${result.reason})`,
        activePlayer.id,
        activePlayer.name
      );

      if (isTutorialMode && tutorialStep === 5) {
        setTutorialStep(6);
      }

      // 檢查是否達成獲勝分數 (非教學模式)
      if (!isTutorialMode && activePlayer.score + earnedVP >= targetScore) {
        audioManager.playVictoryFanfare();
        setPhase('GAME_OVER');
        setWinner(activePlayer);
        addLog('success', `🏆 玩家【${activePlayer.name}】率先達到 ${targetScore} VP 獲勝！`, activePlayer.id, activePlayer.name);
      }
    } else {
      audioManager.playAlertSound();
      addLog('alert', `❌ 廣播連通失敗：${result.reason}`, activePlayer.id, activePlayer.name);
    }

    return result;
  }, [activePlayer, activePlayerIndex, activeEvent, targetScore, isTutorialMode, tutorialStep, addLog]);

  // 回合輪替與結算
  const endTurn = useCallback(() => {
    if (phase === 'GAME_OVER') return;

    if (isTutorialMode) {
      if (tutorialStep === 6) {
        setTutorialStep(7);
        audioManager.playVictoryFanfare();
        addLog('success', '🎉 恭喜完成新手實戰教學！已掌握所有關鍵操作與 PACE 原理！');
        return;
      }
    }

    const nextIndex = (activePlayerIndex + 1) % players.length;

    // 如果輪完一整輪 (所有玩家都行動過一次)
    if (nextIndex === 0) {
      const nextRound = round + 1;
      if (nextRound > maxRounds) {
        // 達最大回合數，依分數決出勝者
        let highest = players[0];
        for (const p of players) {
          if (p.score > highest.score) highest = p;
        }
        setWinner(highest);
        setPhase('GAME_OVER');
        audioManager.playVictoryFanfare();
        addLog('info', `第 ${maxRounds} 回合結束，遊戲終局！勝者為：【${highest.name}】(${highest.score} VP)`);
        return;
      }

      setRound(nextRound);

      // 抽取新環境事件
      let nextEvent = activeEvent;
      if (eventDeck.length > 0) {
        const [drawnEvent, ...restEvents] = eventDeck;
        nextEvent = drawnEvent;
        setActiveEvent(drawnEvent);
        setEventDeck(restEvents);
      } else {
        const reshuffled = shuffleArray(GLOBAL_EVENTS);
        nextEvent = reshuffled[0];
        setActiveEvent(reshuffled[0]);
        setEventDeck(reshuffled.slice(1));
      }

      // 刷新部分危機任務
      setActiveMissions(prev => {
        const uncompleted = prev.filter(m => m.claimedBy.length === 0);
        const slotsToFill = 3 - uncompleted.length;
        let newDeck = [...missionDeck];
        if (newDeck.length < slotsToFill) {
          newDeck = shuffleArray(CRISIS_MISSIONS);
        }
        const newMissions = newDeck.slice(0, slotsToFill);
        setMissionDeck(newDeck.slice(slotsToFill));
        return [...uncompleted, ...newMissions];
      });

      // 重置所有玩家的 AP 與自然供電
      setPlayers(prev => prev.map(p => ({
        ...p,
        actionPoints: p.maxActionPoints,
        energy: Math.min(p.maxEnergy, p.energy + 2),
        credits: p.credits + 1 // 每回合基本物資收入
      })));

      addLog('info', `進入第 ${nextRound} 回合！大氣環境變更為：【${nextEvent?.title}】`);
      audioManager.playAlertSound();
    }

    setActivePlayerIndex(nextIndex);
  }, [activePlayerIndex, players, round, maxRounds, phase, eventDeck, activeEvent, missionDeck, isTutorialMode, tutorialStep, addLog]);

  // AI 自動決策執行循環 (非教學模式)
  useEffect(() => {
    if (phase !== 'PLAYER_ACTION' || !activePlayer || !activePlayer.isAI || isTutorialMode) {
      return;
    }

    aiTimerRef.current = setTimeout(() => {
      const decision = computeAIDecision(activePlayer, market, tacticMarket, activeMissions, activeEvent);

      switch (decision.action) {
        case 'BUY_EQUIPMENT':
          if (decision.targetCard) {
            buyEquipment(decision.targetCard as CommsCard, decision.targetSlot);
          }
          break;
        case 'BUY_TACTIC':
          if (decision.targetCard) {
            buyTactic(decision.targetCard as TacticCard);
          }
          break;
        case 'PLAY_TACTIC':
          if (decision.targetCard) {
            playTactic(decision.targetCard as TacticCard);
          }
          break;
        case 'RECHARGE_ENERGY':
          rechargeEnergy();
          break;
        case 'TRANSMIT':
          if (decision.targetMission) {
            transmitMission(decision.targetMission);
          }
          break;
        case 'END_TURN':
        default:
          endTurn();
          break;
      }
    }, 1200);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [activePlayer, phase, market, tacticMarket, activeMissions, activeEvent, isTutorialMode, buyEquipment, buyTactic, playTactic, rechargeEnergy, transmitMission, endTurn]);

  const clearLastTransmission = useCallback(() => {
    setLastTransmission(null);
  }, []);

  const restartGame = useCallback(() => {
    startGame(gameMode, botCount);
  }, [startGame, gameMode, botCount]);

  const returnToMenu = useCallback(() => {
    setIsTutorialMode(false);
    setPhase('SETUP');
  }, []);

  return {
    round,
    maxRounds,
    targetScore,
    phase,
    players,
    activePlayerIndex,
    activePlayer,
    market,
    tacticMarket,
    activeMissions,
    activeEvent,
    logs,
    winner,
    lastTransmission,
    isAITurn,
    gameMode,
    botCount,
    isTutorialMode,
    tutorialStep,
    setTutorialStep,
    nextTutorialStep,
    prevTutorialStep,
    startTutorial,
    finishTutorial,
    startGame,
    buyEquipment,
    buyTactic,
    playTactic,
    rechargeEnergy,
    transmitMission,
    endTurn,
    clearLastTransmission,
    restartGame,
    returnToMenu
  };
}
