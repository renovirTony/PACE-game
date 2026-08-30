import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  CommsCard, 
  CrisisMission, 
  DisasterEvent, 
  GameLog, 
  GameMode, 
  GamePhase, 
  PACESlot, 
  Player, 
  RoomPeer, 
  TacticCard, 
  TransmissionResult, 
  WorldviewType 
} from '../types/game';
import { V2_EQUIPMENT_CARDS, V2_STARTER_CARDS } from '../data/equipmentCards';
import { V2_DISASTER_EVENTS } from '../data/disasterEvents';
import { V2_CRISIS_MISSIONS } from '../data/crisisMissions';
import { V2_TACTIC_CARDS } from '../data/tacticCards';
import { evaluateV2PACETransmission, canPlaceCardInSlot } from './rules';
import { computeV2AIDecision } from './ai';
import { P2PMultiplayerManager } from './multiplayer';
import { audioManager } from '../../engine/audio';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface UseV2GameStateReturn {
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
  activeEvent: DisasterEvent | null;
  logs: GameLog[];
  winner: Player | null;
  lastTransmission: { result: TransmissionResult; mission: CrisisMission; playerName: string } | null;
  isAITurn: boolean;
  gameMode: GameMode;
  botCount: number;
  worldview: WorldviewType;
  setWorldview: (wv: WorldviewType) => void;

  // Interactive Tutorial
  isTutorialMode: boolean;
  tutorialStep: number;
  setTutorialStep: (step: number) => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  startTutorial: () => void;
  finishTutorial: (action?: 'menu' | 'play') => void;

  // Multiplayer State
  roomCode: string;
  isHost: boolean;
  peers: RoomPeer[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectionMsg: string;
  createRoom: (name: string) => Promise<string>;
  joinRoom: (roomCode: string, name: string) => Promise<void>;
  leaveRoom: () => void;

  // Actions
  startGame: (mode: GameMode, botCount?: number) => void;
  buyEquipment: (card: CommsCard, targetSlot: PACESlot) => boolean;
  assignSlot: (slot: PACESlot, card: CommsCard | null) => void;
  swapSlots: (slotA: PACESlot, slotB: PACESlot) => void;
  storeCard: (slot: PACESlot) => void;
  equipFromInventory: (card: CommsCard, targetSlot: PACESlot) => void;
  discardFromInventory: (cardId: string) => void;
  buyTactic: (card: TacticCard) => boolean;
  playTactic: (card: TacticCard) => boolean;
  rechargeEnergy: () => boolean;
  transmitMission: (mission: CrisisMission) => TransmissionResult;
  endTurn: () => void;
  clearLastTransmission: () => void;
  restartGame: () => void;
  returnToMenu: () => void;
}

export function useV2GameState(): UseV2GameStateReturn {
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(6);
  const [targetScore] = useState(20);
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [gameMode, setGameMode] = useState<GameMode>('SinglePlayer');
  const [botCount, setBotCount] = useState<number>(2);

  // Tutorial state
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);

  // Worldview state with persistence
  const [worldview, setWorldviewState] = useState<WorldviewType>(() => {
    const saved = localStorage.getItem('pace_v2_worldview');
    return (saved === 'CivilDefense' || saved === 'IslandResilience' || saved === 'CyberDisconnect') 
      ? (saved as WorldviewType) 
      : 'CivilDefense';
  });

  const setWorldview = useCallback((wv: WorldviewType) => {
    setWorldviewState(wv);
    localStorage.setItem('pace_v2_worldview', wv);
  }, []);

  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const [equipmentDeck, setEquipmentDeck] = useState<CommsCard[]>([]);
  const [market, setMarket] = useState<CommsCard[]>([]);

  const [tacticDeck, setTacticDeck] = useState<TacticCard[]>([]);
  const [tacticMarket, setTacticMarket] = useState<TacticCard[]>([]);

  const [missionDeck, setMissionDeck] = useState<CrisisMission[]>([]);
  const [activeMissions, setActiveMissions] = useState<CrisisMission[]>([]);

  const [eventDeck, setEventDeck] = useState<DisasterEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<DisasterEvent | null>(null);

  const [logs, setLogs] = useState<GameLog[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [lastTransmission, setLastTransmission] = useState<{ result: TransmissionResult; mission: CrisisMission; playerName: string } | null>(null);

  // Multiplayer Hook State
  const [roomCode, setRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [peers, setPeers] = useState<RoomPeer[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [connectionMsg, setConnectionMsg] = useState<string>('');

  const multiplayerRef = useRef<P2PMultiplayerManager | null>(null);
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
      details,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, [round]);

  const leaveRoom = useCallback(() => {
    if (multiplayerRef.current) {
      multiplayerRef.current.disconnect();
      multiplayerRef.current = null;
    }
    setRoomCode('');
    setIsHost(false);
    setPeers([]);
    setConnectionStatus('disconnected');
    setConnectionMsg('');
  }, []);

  const returnToMenu = useCallback(() => {
    setPhase('SETUP');
    setIsTutorialMode(false);
    setTutorialStep(1);
    leaveRoom();
  }, [leaveRoom]);

  // 初始化並開始遊戲
  const startGame = useCallback((mode: GameMode, bots: number = 2) => {
    setGameMode(mode);
    setBotCount(bots);
    setIsTutorialMode(false);
    setLogs([]);

    // 準備牌庫
    const shuffledEquip = shuffleArray(V2_EQUIPMENT_CARDS);
    const initialMarket = shuffledEquip.slice(0, 4);
    const restEquip = shuffledEquip.slice(4);

    const shuffledTactics = shuffleArray(V2_TACTIC_CARDS);
    const initialTacticMarket = shuffledTactics.slice(0, 3);
    const restTactics = shuffledTactics.slice(3);

    const shuffledMissions = shuffleArray(V2_CRISIS_MISSIONS);
    const initialMissions = shuffledMissions.slice(0, 3);
    const restMissions = shuffledMissions.slice(3);

    const shuffledEvents = shuffleArray(V2_DISASTER_EVENTS);
    const initialEvent = shuffledEvents[0];
    const restEvents = shuffledEvents.slice(1);

    // PACE 起始配置：P 固定為日常手機公眾網 (Cellular / High)，A 固定為第一備援無線電 (Radio / Medium)
    const cellStarter = V2_STARTER_CARDS.find(c => c.id === 'start_cellular_phone') || V2_STARTER_CARDS[0];
    const radioStarter = V2_STARTER_CARDS.find(c => c.id === 'start_frs_walkie') || V2_STARTER_CARDS[1];

    // 玩家配置
    const newPlayers: Player[] = [];

    // 主玩家
    newPlayers.push({
      id: 'p1',
      name: '你 (指揮官)',
      isAI: false,
      avatar: '📡',
      color: '#06b6d4',
      score: 0,
      credits: 3,
      actionPoints: 3,
      maxActionPoints: 3,
      energy: 3,
      maxEnergy: 6,
      paceBoard: {
        P: cellStarter,
        A: radioStarter,
        C: null,
        E: null,
      },
      inventory: [],
      handTactics: [],
      completedMissions: [],
      stats: {
        transmissions: 0,
        pSuccesses: 0,
        aSuccesses: 0,
        cSuccesses: 0,
        eSuccesses: 0,
        degradedTransmissions: 0,
      },
    });

    if (mode === 'SinglePlayer') {
      const botConfigs = [
        { name: '應變組長 雅婷', avatar: '🤖', color: '#a855f7', aiPersonality: 'Pragmatic' as const },
        { name: '火腿老手 志強', avatar: '📻', color: '#f59e0b', aiPersonality: 'Survivalist' as const },
        { name: '特戰通訊官 豪哥', avatar: '⚡', color: '#10b981', aiPersonality: 'HighTech' as const },
      ];

      for (let i = 0; i < bots; i++) {
        const cfg = botConfigs[i % botConfigs.length];
        newPlayers.push({
          id: `ai_${i + 1}`,
          name: cfg.name,
          isAI: true,
          aiPersonality: cfg.aiPersonality,
          avatar: cfg.avatar,
          color: cfg.color,
          score: 0,
          credits: 3,
          actionPoints: 3,
          maxActionPoints: 3,
          energy: 3,
          maxEnergy: 6,
          paceBoard: {
            P: cellStarter,
            A: radioStarter,
            C: null,
            E: null,
          },
          inventory: [],
          handTactics: [],
          completedMissions: [],
          stats: {
            transmissions: 0,
            pSuccesses: 0,
            aSuccesses: 0,
            cSuccesses: 0,
            eSuccesses: 0,
            degradedTransmissions: 0,
          },
        });
      }
    } else if (mode === 'PassAndPlay') {
      newPlayers.push({
        id: 'p2',
        name: '二號指揮官',
        isAI: false,
        avatar: '🛡️',
        color: '#f97316',
        score: 0,
        credits: 3,
        actionPoints: 3,
        maxActionPoints: 3,
        energy: 3,
        maxEnergy: 6,
        paceBoard: {
          P: cellStarter,
          A: radioStarter,
          C: null,
          E: null,
        },
        inventory: [],
        handTactics: [],
        completedMissions: [],
        stats: {
          transmissions: 0,
          pSuccesses: 0,
          aSuccesses: 0,
          cSuccesses: 0,
          eSuccesses: 0,
          degradedTransmissions: 0,
        },
      });
    }

    setPlayers(newPlayers);
    setActivePlayerIndex(0);
    setEquipmentDeck(restEquip);
    setMarket(initialMarket);
    setTacticDeck(restTactics);
    setTacticMarket(initialTacticMarket);
    setMissionDeck(restMissions);
    setActiveMissions(initialMissions);
    setEventDeck(restEvents);
    setActiveEvent(initialEvent);
    setRound(1);
    setWinner(null);
    setPhase('PLAYER_ACTION');

    addLog('info', `📢 災難演習開始！首波環境事件【${initialEvent.translations[worldview]?.title}】已生效！`);
  }, [worldview, addLog]);

  // 新手教學引導啟動 (100% 確定性精選教學牌組與任務)
  const startTutorial = useCallback(() => {
    const cellStarter = V2_STARTER_CARDS.find(c => c.id === 'start_cellular_phone') || V2_STARTER_CARDS[0];
    const radioStarter = V2_STARTER_CARDS.find(c => c.id === 'start_frs_walkie') || V2_STARTER_CARDS[1];
    const agileTactic = V2_TACTIC_CARDS.find(t => t.id === 'tac_agile_protocol') || V2_TACTIC_CARDS[0];

    const tutPlayers: Player[] = [
      {
        id: 'p1',
        name: '你 (指揮官)',
        isAI: false,
        avatar: '📡',
        color: '#06b6d4',
        score: 0,
        credits: 3,
        actionPoints: 3,
        maxActionPoints: 3,
        energy: 4,
        maxEnergy: 6,
        paceBoard: {
          P: cellStarter,
          A: radioStarter,
          C: null,
          E: null,
        },
        inventory: [],
        handTactics: [agileTactic],
        completedMissions: [],
        stats: {
          transmissions: 0,
          pSuccesses: 0,
          aSuccesses: 0,
          cSuccesses: 0,
          eSuccesses: 0,
          degradedTransmissions: 0,
        },
      },
      {
        id: 'ai_1',
        name: '應變組長 雅婷',
        isAI: true,
        aiPersonality: 'Pragmatic',
        avatar: '🤖',
        color: '#a855f7',
        score: 0,
        credits: 3,
        actionPoints: 3,
        maxActionPoints: 3,
        energy: 3,
        maxEnergy: 6,
        paceBoard: {
          P: cellStarter,
          A: radioStarter,
          C: null,
          E: null,
        },
        inventory: [],
        handTactics: [],
        completedMissions: [],
        stats: {
          transmissions: 0,
          pSuccesses: 0,
          aSuccesses: 0,
          cSuccesses: 0,
          eSuccesses: 0,
          degradedTransmissions: 0,
        },
      },
    ];

    // 精選市場裝備卡 (衛星電話、強光手電筒、通訊車、地下光纖)
    const satPhone = V2_EQUIPMENT_CARDS.find(c => c.id === 'eq_satellite_phone') || V2_EQUIPMENT_CARDS[0];
    const aldisLight = V2_EQUIPMENT_CARDS.find(c => c.id === 'eq_aldis_light_mirror') || V2_EQUIPMENT_CARDS[1];
    const commsVan = V2_EQUIPMENT_CARDS.find(c => c.id === 'eq_mesh_cell_truck') || V2_EQUIPMENT_CARDS[2];
    const wiredPhone = V2_EQUIPMENT_CARDS.find(c => c.id === 'eq_fiber_hotline') || V2_EQUIPMENT_CARDS[3];
    const tutMarket = [satPhone, aldisLight, commsVan, wiredPhone];
    const restEquip = V2_EQUIPMENT_CARDS.filter(c => !tutMarket.some(m => m.id === c.id));

    // 精選戰術市場
    const priorityTactic = V2_TACTIC_CARDS.find(t => t.id === 'tac_priority_logistics') || V2_TACTIC_CARDS[0];
    const burstTactic = V2_TACTIC_CARDS.find(t => t.id === 'tac_burst_transmission') || V2_TACTIC_CARDS[1];
    const genTactic = V2_TACTIC_CARDS.find(t => t.id === 'tac_mobile_generator') || V2_TACTIC_CARDS[2];
    const tutTacticMarket = [priorityTactic, burstTactic, genTactic];
    const restTactics = V2_TACTIC_CARDS.filter(t => t.id !== agileTactic.id && !tutTacticMarket.some(m => m.id === t.id));

    // 精選危機任務 (山區搜救、SOS求救、空拍傳輸)
    const missionMountain = V2_CRISIS_MISSIONS.find(m => m.id === 'mis_mountain_search_team') || V2_CRISIS_MISSIONS[0];
    const missionSOS = V2_CRISIS_MISSIONS.find(m => m.id === 'mis_sos_coordinates_beacon') || V2_CRISIS_MISSIONS[1];
    const missionDrone = V2_CRISIS_MISSIONS.find(m => m.id === 'mis_drone_recon_video') || V2_CRISIS_MISSIONS[2];
    const tutMissions = [missionMountain, missionSOS, missionDrone];
    const restMissions = V2_CRISIS_MISSIONS.filter(m => !tutMissions.some(tm => tm.id === m.id));

    setGameMode('SinglePlayer');
    setPlayers(tutPlayers);
    setActivePlayerIndex(0);
    setMarket(tutMarket);
    setEquipmentDeck(restEquip);
    setTacticMarket(tutTacticMarket);
    setTacticDeck(restTactics);
    setActiveMissions(tutMissions);
    setMissionDeck(restMissions);
    setActiveEvent(null); // 教學初期為晴朗無天災狀態
    setRound(1);
    setWinner(null);
    setPhase('PLAYER_ACTION');
    setIsTutorialMode(true);
    setTutorialStep(1);
    addLog('info', '🎓 進入實戰新手教學：跟隨引導逐步掌握自組 PACE 防線與媒介獨立性！');
  }, [addLog]);

  const nextTutorialStep = useCallback(() => {
    setTutorialStep(s => s + 1);
  }, []);

  const prevTutorialStep = useCallback(() => {
    setTutorialStep(s => Math.max(1, s - 1));
  }, []);

  const finishTutorial = useCallback((action: 'menu' | 'play' = 'menu') => {
    setIsTutorialMode(false);
    setTutorialStep(1);
    if (action === 'menu') {
      setPhase('SETUP');
      leaveRoom();
      addLog('info', '🏠 已結束新手教學，返回指揮部主選單。');
    } else {
      startGame('SinglePlayer', 1);
      addLog('success', '🎉 結訓認證完成！已展開全新正式實戰演習！');
    }
  }, [leaveRoom, startGame, addLog]);

  // 購買裝備卡並自選放入槽位 (若原槽位有裝備，自動收納至備用倉庫，不直接覆蓋刪除！)
  const buyEquipment = useCallback((card: CommsCard, targetSlot: PACESlot): boolean => {
    const curPlayer = players[activePlayerIndex];
    if (!curPlayer) return false;

    const isFreeBuy = Boolean(curPlayer.activeBuffs?.freeMarketPurchaseActive);
    if ((!isFreeBuy && curPlayer.actionPoints <= 0) || curPlayer.credits < card.cost) {
      return false;
    }

    const slotCheck = canPlaceCardInSlot(card, targetSlot);
    if (!slotCheck.valid) {
      addLog('alert', slotCheck.reason || '無法配置至此槽位！', curPlayer.id, curPlayer.name);
      return false;
    }

    audioManager.playEquipSound();

    const existingCard = curPlayer.paceBoard[targetSlot];

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        credits: p.credits - card.cost,
        actionPoints: isFreeBuy ? p.actionPoints : p.actionPoints - 1,
        activeBuffs: {
          ...p.activeBuffs,
          freeMarketPurchaseActive: false, // 消耗掉免 AP 採購次數
        },
        paceBoard: {
          ...p.paceBoard,
          [targetSlot]: card,
        },
        // 若該槽位原本有卡片，安全移至備用倉庫！
        inventory: existingCard ? [...p.inventory, existingCard] : p.inventory,
      };
    }));

    // 從市場補充新卡
    setMarket(prev => {
      const nextMarket = prev.filter(c => c.id !== card.id);
      if (equipmentDeck.length > 0) {
        nextMarket.push(equipmentDeck[0]);
        setEquipmentDeck(d => d.slice(1));
      } else {
        // 牌庫耗盡時，重洗裝備牌庫
        const reshuffled = shuffleArray(V2_EQUIPMENT_CARDS.filter(c => c.id !== card.id));
        if (reshuffled.length > 0) {
          nextMarket.push(reshuffled[0]);
          setEquipmentDeck(reshuffled.slice(1));
        }
      }
      return nextMarket;
    });

    const cardName = card.translations[worldview]?.name || card.id;
    const displacedText = existingCard ? `（原裝備【${existingCard.translations[worldview]?.name || existingCard.id}】已安全收納至備用倉庫）` : '';
    addLog('action', `【${curPlayer.name}】${isFreeBuy ? '【後勤通道 0 AP】' : '消耗 1 AP '}採購裝備【${cardName}】並配置至 [${targetSlot}] 槽位。${displacedText}`, curPlayer.id, curPlayer.name);
    return true;
  }, [players, activePlayerIndex, equipmentDeck, worldview, addLog]);

  // 自由調動/指派槽位
  const assignSlot = useCallback((slot: PACESlot, card: CommsCard | null) => {
    if (card) {
      const slotCheck = canPlaceCardInSlot(card, slot);
      if (!slotCheck.valid) return;
    }
    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        paceBoard: {
          ...p.paceBoard,
          [slot]: card,
        },
      };
    }));
  }, [activePlayerIndex]);

  // 對調任意兩道防線 (消耗 1 AP 戰術調度點數，若有敏捷協議則 0 AP)
  const swapSlots = useCallback((slotA: PACESlot, slotB: PACESlot): boolean => {
    if (slotA === slotB) return false;
    const curPlayer = players[activePlayerIndex];
    if (!curPlayer) return false;

    const isAgile = Boolean(curPlayer.activeBuffs?.agileProtocolActive);
    if (!isAgile && curPlayer.actionPoints <= 0) {
      addLog('alert', '⚡ 行動點數不足！對調防線需消耗 1 AP 戰術調度點數（或啟用敏捷通訊協議）。', curPlayer.id, curPlayer.name);
      return false;
    }

    const cardA = curPlayer.paceBoard[slotA];
    const cardB = curPlayer.paceBoard[slotB];

    // 檢查對調後的合法性 (例如 P 槽不可放置 Low 頻寬純應急工具)
    const checkA = canPlaceCardInSlot(cardB, slotA);
    if (!checkA.valid) {
      addLog('alert', checkA.reason || '無法對調！', curPlayer.id, curPlayer.name);
      return false;
    }
    const checkB = canPlaceCardInSlot(cardA, slotB);
    if (!checkB.valid) {
      addLog('alert', checkB.reason || '無法對調！', curPlayer.id, curPlayer.name);
      return false;
    }

    audioManager.playClick();

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        actionPoints: isAgile ? p.actionPoints : p.actionPoints - 1,
        paceBoard: {
          ...p.paceBoard,
          [slotA]: cardB,
          [slotB]: cardA,
        },
      };
    }));

    addLog('action', `【${curPlayer.name}】${isAgile ? '【敏捷協議 0 AP】' : '消耗 1 AP '}對調了 [${slotA}] 與 [${slotB}] 防線的通訊裝備。`, curPlayer.id, curPlayer.name);
    return true;
  }, [players, activePlayerIndex, addLog]);

  // 將某槽位裝備卸下並存入備用倉庫 (安全收存，0 AP)
  const storeCard = useCallback((slot: PACESlot) => {
    const curPlayer = players[activePlayerIndex];
    const cardToStore = curPlayer?.paceBoard[slot];
    if (!cardToStore) return;

    audioManager.playClick();

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        paceBoard: {
          ...p.paceBoard,
          [slot]: null,
        },
        inventory: [...p.inventory, cardToStore],
      };
    }));

    const cardName = cardToStore.translations[worldview]?.name || cardToStore.id;
    addLog('action', `【${curPlayer.name}】將 [${slot}] 槽位的【${cardName}】卸下收至備用倉庫。`, curPlayer.id, curPlayer.name);
  }, [players, activePlayerIndex, worldview, addLog]);

  // 從備用倉庫重新裝備至指定槽位 (消耗 1 AP 戰術調度點數，若有敏捷協議則 0 AP)
  const equipFromInventory = useCallback((card: CommsCard, targetSlot: PACESlot): boolean => {
    const curPlayer = players[activePlayerIndex];
    if (!curPlayer) return false;

    const isAgile = Boolean(curPlayer.activeBuffs?.agileProtocolActive);
    if (!isAgile && curPlayer.actionPoints <= 0) {
      addLog('alert', '⚡ 行動點數不足！從備用倉庫調配裝備需消耗 1 AP 戰術調度點數（或啟用敏捷通訊協議）。', curPlayer.id, curPlayer.name);
      return false;
    }

    const slotCheck = canPlaceCardInSlot(card, targetSlot);
    if (!slotCheck.valid) {
      addLog('alert', slotCheck.reason || '無法配置至此槽位！', curPlayer.id, curPlayer.name);
      return false;
    }

    audioManager.playEquipSound();
    const existingCard = curPlayer.paceBoard[targetSlot];

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      const remainingInventory = p.inventory.filter(c => c.id !== card.id);
      return {
        ...p,
        actionPoints: isAgile ? p.actionPoints : p.actionPoints - 1,
        paceBoard: {
          ...p.paceBoard,
          [targetSlot]: card,
        },
        inventory: existingCard ? [...remainingInventory, existingCard] : remainingInventory,
      };
    }));

    const cardName = card.translations[worldview]?.name || card.id;
    addLog('action', `【${curPlayer.name}】${isAgile ? '【敏捷協議 0 AP】' : '消耗 1 AP '}從備用倉庫將【${cardName}】配置至 [${targetSlot}] 槽位。`, curPlayer.id, curPlayer.name);
    return true;
  }, [players, activePlayerIndex, worldview, addLog]);

  // 徹底丟棄倉庫中的裝備
  const discardFromInventory = useCallback((cardId: string) => {
    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        inventory: p.inventory.filter(c => c.id !== cardId),
      };
    }));
  }, [activePlayerIndex]);

  // 購買戰術卡 (若有綠色後勤通道則 0 AP)
  const buyTactic = useCallback((card: TacticCard): boolean => {
    const curPlayer = players[activePlayerIndex];
    if (!curPlayer) return false;

    const isFreeBuy = Boolean(curPlayer.activeBuffs?.freeMarketPurchaseActive);
    if ((!isFreeBuy && curPlayer.actionPoints <= 0) || curPlayer.credits < card.cost) {
      return false;
    }

    audioManager.playClick();

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        credits: p.credits - card.cost,
        actionPoints: isFreeBuy ? p.actionPoints : p.actionPoints - 1,
        activeBuffs: {
          ...p.activeBuffs,
          freeMarketPurchaseActive: false, // 消耗掉免 AP 採購次數
        },
        handTactics: [...p.handTactics, card],
      };
    }));

    setTacticMarket(prev => {
      const nextMarket = prev.filter(t => t.id !== card.id);
      if (tacticDeck.length > 0) {
        nextMarket.push(tacticDeck[0]);
        setTacticDeck(d => d.slice(1));
      } else {
        const reshuffled = shuffleArray(V2_TACTIC_CARDS.filter(t => t.id !== card.id));
        if (reshuffled.length > 0) {
          nextMarket.push(reshuffled[0]);
          setTacticDeck(reshuffled.slice(1));
        }
      }
      return nextMarket;
    });

    const tacticName = card.translations[worldview]?.name || card.id;
    addLog('action', `【${curPlayer.name}】${isFreeBuy ? '【後勤通道 0 AP】' : '消耗 1 AP '}購入戰術卡【${tacticName}】加入手牌。`, curPlayer.id, curPlayer.name);
    return true;
  }, [players, activePlayerIndex, tacticDeck, worldview, addLog]);

  // 打出戰術卡 (0 AP 即時生效 Free Action！)
  const playTactic = useCallback((card: TacticCard): boolean => {
    const curPlayer = players[activePlayerIndex];
    if (!curPlayer) {
      return false;
    }

    audioManager.playClick();

    let energyDelta = 0;
    let creditsDelta = 0;
    let newBuffs = { ...curPlayer.activeBuffs };

    if (card.effectType === 'RECHARGE_BATTERY') {
      energyDelta = card.value || 3;
    } else if (card.effectType === 'AIRDROP_CREDITS') {
      creditsDelta = card.value || 3;
    } else if (card.effectType === 'DEPLOY_ANTENNA') {
      newBuffs.antennaBoostRange = true;
    } else if (card.effectType === 'FARADAY_SHIELD') {
      newBuffs.faradayEmpArmor = true;
    } else if (card.effectType === 'COMMUNITY_RELAY') {
      newBuffs.communityRelayActive = true;
    } else if (card.effectType === 'AGILE_PROTOCOL') {
      newBuffs.agileProtocolActive = true;
    } else if (card.effectType === 'FREE_MARKET_PURCHASE') {
      newBuffs.freeMarketPurchaseActive = true;
    } else if (card.effectType === 'FREE_TRANSMISSION') {
      newBuffs.freeTransmissionActive = true;
    }

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        energy: Math.min(p.maxEnergy, p.energy + energyDelta),
        credits: p.credits + creditsDelta,
        activeBuffs: newBuffs,
        handTactics: p.handTactics.filter(t => t.id !== card.id),
      };
    }));

    const tacticName = card.translations[worldview]?.name || card.id;
    addLog('action', `【${curPlayer.name}】即時發動戰術【${tacticName}】(0 AP)！`, curPlayer.id, curPlayer.name);
    return true;
  }, [players, activePlayerIndex, worldview, addLog]);

  // 野戰充電
  const rechargeEnergy = useCallback((): boolean => {
    const curPlayer = players[activePlayerIndex];
    if (!curPlayer || curPlayer.actionPoints <= 0 || curPlayer.energy >= curPlayer.maxEnergy) {
      return false;
    }

    audioManager.playClick();

    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        actionPoints: p.actionPoints - 1,
        energy: Math.min(p.maxEnergy, p.energy + 2),
      };
    }));

    addLog('action', `【${curPlayer.name}】進行緊急野戰充電，補充 ⚡2 點電量。`, curPlayer.id, curPlayer.name);
    return true;
  }, [players, activePlayerIndex, addLog]);

  // 發起任務通訊檢定 (若有突發通訊令則 0 AP)
  const transmitMission = useCallback((mission: CrisisMission): TransmissionResult => {
    const curPlayer = players[activePlayerIndex];
    const isFreeTrans = Boolean(curPlayer?.activeBuffs?.freeTransmissionActive);
    if (!isFreeTrans && (curPlayer?.actionPoints || 0) <= 0) {
      return {
        canTransmit: false,
        successfulSlot: null,
        usedCard: null,
        fallbackDepth: -1,
        degradationRate: 0,
        earnedVP: 0,
        earnedCredits: 0,
        reason: '行動點數不足，無法發起任務通訊！',
        expertDebrief: '發起任務通訊需要消耗 1 AP 或使用【連續突發通訊令】戰術卡。',
        slotEvaluations: [],
      };
    }

    const result = evaluateV2PACETransmission(curPlayer, mission, activeEvent, worldview);

    if (result.canTransmit && result.usedCard) {
      audioManager.playTransmissionSound(result.degradationRate < 1.0);

      const effectivePowerCost = result.usedCard.powerCost + (activeEvent?.powerDrainBonus || 0);

      setPlayers(prev => prev.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;
        return {
          ...p,
          actionPoints: isFreeTrans ? p.actionPoints : p.actionPoints - 1,
          activeBuffs: {
            ...p.activeBuffs,
            freeTransmissionActive: false, // 消耗掉免 AP 通訊次數
          },
          energy: Math.max(0, p.energy - effectivePowerCost),
          score: p.score + result.earnedVP,
          credits: p.credits + result.earnedCredits,
          completedMissions: [...p.completedMissions, mission.id],
          stats: {
            ...p.stats,
            transmissions: p.stats.transmissions + 1,
            pSuccesses: p.stats.pSuccesses + (result.successfulSlot === 'P' ? 1 : 0),
            aSuccesses: p.stats.aSuccesses + (result.successfulSlot === 'A' ? 1 : 0),
            cSuccesses: p.stats.cSuccesses + (result.successfulSlot === 'C' ? 1 : 0),
            eSuccesses: p.stats.eSuccesses + (result.successfulSlot === 'E' ? 1 : 0),
            degradedTransmissions: p.stats.degradedTransmissions + (result.degradationRate < 1.0 ? 1 : 0),
          },
        };
      }));

      // 更新任務看板：若牌庫為空，立即重洗未在場上的任務，確保場上永遠維持 3 張任務！
      setActiveMissions(prev => {
        const remainingOnBoard = prev.filter(m => m.id !== mission.id);
        if (missionDeck.length > 0) {
          const nextCard = missionDeck[0];
          setMissionDeck(d => d.slice(1));
          return [...remainingOnBoard, nextCard];
        } else {
          // 重洗無限牌庫
          const activeIds = remainingOnBoard.map(m => m.id);
          const poolToReshuffle = shuffleArray(V2_CRISIS_MISSIONS.filter(m => !activeIds.includes(m.id)));
          if (poolToReshuffle.length > 0) {
            const nextCard = poolToReshuffle[0];
            setMissionDeck(poolToReshuffle.slice(1));
            return [...remainingOnBoard, nextCard];
          }
          return remainingOnBoard;
        }
      });

      const missionTitle = mission.translations[worldview]?.title || mission.id;
      addLog(
        'success',
        `【${curPlayer.name}】${isFreeTrans ? '【突發通訊 0 AP】' : '消耗 1 AP '}成功連通【${missionTitle}】！透過 [${result.successfulSlot}] 槽位獲得 🏆${result.earnedVP} 分與 💰${result.earnedCredits} 物資。`,
        curPlayer.id,
        curPlayer.name
      );
    } else {
      audioManager.playAlertSound();

      // 通訊失敗，白扣 1 AP (若有突發通訊令則消耗該 buff)
      setPlayers(prev => prev.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;
        return {
          ...p,
          actionPoints: isFreeTrans ? p.actionPoints : p.actionPoints - 1,
          activeBuffs: {
            ...p.activeBuffs,
            freeTransmissionActive: false,
          },
        };
      }));

      const missionTitle = mission.translations[worldview]?.title || mission.id;
      addLog(
        'alert',
        `【${curPlayer.name}】嘗試連通【${missionTitle}】失敗！四道防線皆無法突破當前障礙。`,
        curPlayer.id,
        curPlayer.name
      );
    }

    setLastTransmission({ result, mission, playerName: curPlayer.name });
    return result;
  }, [players, activePlayerIndex, activeEvent, worldview, missionDeck, addLog]);

  // 結束當前回合 / 換人
  const endTurn = useCallback(() => {
    const curPlayer = players[activePlayerIndex];
    if (!curPlayer) return;

    // 清除該玩家單回合 Buff
    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== activePlayerIndex) return p;
      return {
        ...p,
        activeBuffs: undefined,
      };
    }));

    // 若處於新手教學模式，點擊結束回合直接結算天災並留在指揮官視角
    if (isTutorialMode) {
      const nextRound = round + 1;
      setRound(nextRound);
      const blackoutEvt = V2_DISASTER_EVENTS.find(e => e.id === 'evt_grid_blackout') || V2_DISASTER_EVENTS[0];
      setActiveEvent(blackoutEvt);
      addLog('event', `🌪️ 第 ${nextRound} 週期極端災害爆發：【${blackoutEvt.translations[worldview]?.title}】！`);

      // 重置玩家 AP 並固定由指揮官行動
      setPlayers(prev => prev.map(p => ({
        ...p,
        actionPoints: p.maxActionPoints,
      })));
      setActivePlayerIndex(0);
      return;
    }

    const nextIndex = (activePlayerIndex + 1) % players.length;

    // 若所有玩家輪過一圈，推進大回合
    if (nextIndex === 0) {
      const nextRound = round + 1;

      // 檢查勝利條件 (達標 20 分或達 6 回合)
      const topPlayer = [...players].sort((a, b) => b.score - a.score)[0];
      if (nextRound > maxRounds || topPlayer.score >= targetScore) {
        setWinner(topPlayer);
        setPhase('GAME_OVER');
        audioManager.playVictoryFanfare();
        addLog('success', `🎉 演習結束！指揮官【${topPlayer.name}】以 🏆${topPlayer.score} 分榮獲最卓越韌性先鋒！`);
        return;
      }

      setRound(nextRound);

      // 翻開下一個災難事件 (若事件庫空了也重洗)
      if (eventDeck.length > 0) {
        const nextEvt = eventDeck[0];
        setActiveEvent(nextEvt);
        setEventDeck(d => d.slice(1));
        addLog('event', `🌪️ 第 ${nextRound} 週期極端災害爆發：【${nextEvt.translations[worldview]?.title}】！`);
      } else {
        const reshuffledEvents = shuffleArray(V2_DISASTER_EVENTS);
        const nextEvt = reshuffledEvents[0];
        setActiveEvent(nextEvt);
        setEventDeck(reshuffledEvents.slice(1));
        addLog('event', `🌪️ 第 ${nextRound} 週期極端災害爆發：【${nextEvt.translations[worldview]?.title}】！`);
      }

      // 重置所有玩家 AP
      setPlayers(prev => prev.map(p => ({
        ...p,
        actionPoints: p.maxActionPoints,
      })));
    }

    setActivePlayerIndex(nextIndex);
  }, [players, activePlayerIndex, round, maxRounds, targetScore, eventDeck, isTutorialMode, worldview, addLog]);

  // AI 自動決策執行循環 (教學模式中暫停 AI 搶先行動)
  useEffect(() => {
    const curPlayer = players[activePlayerIndex];
    if (phase !== 'PLAYER_ACTION' || !curPlayer || !curPlayer.isAI || isTutorialMode) {
      return;
    }

    aiTimerRef.current = setTimeout(() => {
      const decision = computeV2AIDecision(
        curPlayer,
        market,
        tacticMarket,
        activeMissions,
        activeEvent
      );

      if (decision.actionType === 'BUY_EQUIPMENT' && decision.targetCard && decision.targetSlot) {
        buyEquipment(decision.targetCard, decision.targetSlot);
      } else if (decision.actionType === 'BUY_TACTIC' && decision.targetTactic) {
        buyTactic(decision.targetTactic);
      } else if (decision.actionType === 'PLAY_TACTIC' && decision.targetTactic) {
        playTactic(decision.targetTactic);
      } else if (decision.actionType === 'RECHARGE') {
        rechargeEnergy();
      } else if (decision.actionType === 'TRANSMIT' && decision.targetMission) {
        transmitMission(decision.targetMission);
      } else {
        endTurn();
      }
    }, 1200);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [
    players,
    activePlayerIndex,
    phase,
    market,
    tacticMarket,
    activeMissions,
    activeEvent,
    buyEquipment,
    buyTactic,
    playTactic,
    rechargeEnergy,
    transmitMission,
    endTurn
  ]);

  // WebRTC P2P 連線方法
  const createRoom = useCallback(async (name: string): Promise<string> => {
    if (!multiplayerRef.current) {
      multiplayerRef.current = new P2PMultiplayerManager({
        onPeerJoined: (peer) => {
          setPeers(prev => [...prev.filter(p => p.peerId !== peer.peerId), peer]);
          addLog('info', `🌐 玩家【${peer.name}】已連線加入房間！`);
        },
        onPeerLeft: (peerId) => {
          setPeers(prev => prev.filter(p => p.peerId !== peerId));
          addLog('alert', `📡 連線玩家已離線。`);
        },
        onGameStateReceived: (syncedState) => {
          if (syncedState.players) setPlayers(syncedState.players);
          if (syncedState.round) setRound(syncedState.round);
          if (syncedState.activePlayerIndex !== undefined) setActivePlayerIndex(syncedState.activePlayerIndex);
          if (syncedState.market) setMarket(syncedState.market);
          if (syncedState.activeMissions) setActiveMissions(syncedState.activeMissions);
          if (syncedState.activeEvent) setActiveEvent(syncedState.activeEvent);
          if (syncedState.phase) setPhase(syncedState.phase);
        },
        onActionReceived: () => {},
        onConnectionStatus: (status, msg) => {
          setConnectionStatus(status);
          if (msg) setConnectionMsg(msg);
        },
      });
    }

    const code = await multiplayerRef.current.createRoom({
      name,
      avatar: '📡',
      color: '#06b6d4',
    });
    setRoomCode(code);
    setIsHost(true);
    return code;
  }, [addLog]);

  const joinRoom = useCallback(async (code: string, name: string): Promise<void> => {
    if (!multiplayerRef.current) {
      multiplayerRef.current = new P2PMultiplayerManager({
        onPeerJoined: () => {},
        onPeerLeft: () => {},
        onGameStateReceived: (syncedState) => {
          if (syncedState.players) setPlayers(syncedState.players);
          if (syncedState.round) setRound(syncedState.round);
          if (syncedState.activePlayerIndex !== undefined) setActivePlayerIndex(syncedState.activePlayerIndex);
          if (syncedState.market) setMarket(syncedState.market);
          if (syncedState.activeMissions) setActiveMissions(syncedState.activeMissions);
          if (syncedState.activeEvent) setActiveEvent(syncedState.activeEvent);
          if (syncedState.phase) setPhase(syncedState.phase);
        },
        onActionReceived: () => {},
        onConnectionStatus: (status, msg) => {
          setConnectionStatus(status);
          if (msg) setConnectionMsg(msg);
        },
      });
    }

    await multiplayerRef.current.joinRoom(code, {
      name,
      avatar: '🛡️',
      color: '#f97316',
    });
    setRoomCode(code);
    setIsHost(false);
  }, []);

  const clearLastTransmission = useCallback(() => {
    setLastTransmission(null);
  }, []);

  const restartGame = useCallback(() => {
    startGame(gameMode, botCount);
  }, [startGame, gameMode, botCount]);

  const activePlayer = players[activePlayerIndex] || players[0] || {
    id: 'p1',
    name: '你',
    isAI: false,
    avatar: '📡',
    color: '#06b6d4',
    score: 0,
    credits: 3,
    actionPoints: 3,
    maxActionPoints: 3,
    energy: 3,
    maxEnergy: 6,
    paceBoard: { P: null, A: null, C: null, E: null },
    inventory: [],
    handTactics: [],
    completedMissions: [],
    stats: { transmissions: 0, pSuccesses: 0, aSuccesses: 0, cSuccesses: 0, eSuccesses: 0, degradedTransmissions: 0 },
  };

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
    isAITurn: Boolean(activePlayer.isAI),
    gameMode,
    botCount,
    worldview,
    setWorldview,

    isTutorialMode,
    tutorialStep,
    setTutorialStep,
    nextTutorialStep,
    prevTutorialStep,
    startTutorial,
    finishTutorial,

    roomCode,
    isHost,
    peers,
    connectionStatus,
    connectionMsg,
    createRoom,
    joinRoom,
    leaveRoom,

    startGame,
    buyEquipment,
    assignSlot,
    swapSlots,
    storeCard,
    equipFromInventory,
    discardFromInventory,
    buyTactic,
    playTactic,
    rechargeEnergy,
    transmitMission,
    endTurn,
    clearLastTransmission,
    restartGame,
    returnToMenu,
  };
}
