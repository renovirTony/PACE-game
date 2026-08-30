import { CommsCard, CrisisMission, DisasterEvent, PACESlot, Player, TacticCard } from '../types/game';
import { checkCardEligibilityV2 } from './rules';

export interface AIDecision {
  actionType: 'BUY_EQUIPMENT' | 'ASSIGN_SLOT' | 'BUY_TACTIC' | 'PLAY_TACTIC' | 'RECHARGE' | 'TRANSMIT' | 'END_TURN';
  targetCard?: CommsCard;
  targetSlot?: PACESlot;
  targetTactic?: TacticCard;
  targetMission?: CrisisMission;
}

/**
 * 評估 AI 玩家的最佳槽位配置 (鼓勵媒介獨立性與頻寬階梯)
 */
export function findBestSlotForCard(player: Player, card: CommsCard): PACESlot {
  const board = player.paceBoard;

  // 1. 如果 P 空著且該卡為 High 或 Medium 頻寬，優先放 P
  if (!board.P && (card.bandwidth === 'High' || card.bandwidth === 'Medium')) return 'P';

  // 2. 如果 A 空著且該卡為 High/Medium 頻寬，且媒介與 P 不同，優先放 A
  if (!board.A && (card.bandwidth === 'High' || card.bandwidth === 'Medium')) {
    if (!board.P || board.P.medium !== card.medium) return 'A';
  }

  // 3. 如果 C 空著，優先放具備抗性或不同媒介的卡
  if (!board.C) {
    const existingMedia = [board.P?.medium, board.A?.medium].filter(Boolean);
    if (!existingMedia.includes(card.medium)) return 'C';
  }

  // 4. 如果 E 空著，優先放免電或強韌光學/人力卡
  if (!board.E) return 'E';

  // 5. 替換現有同質卡或較弱卡
  if (card.bandwidth === 'High' && board.P && board.P.bandwidth !== 'High') return 'P';
  if (card.resilience.empShield && board.C && !board.C.resilience.empShield) return 'C';

  // 預設找第一個空槽位 (P 槽必須具備 Medium 或 High 頻寬)
  if (!board.P && card.bandwidth !== 'Low') return 'P';
  if (!board.A) return 'A';
  if (!board.C) return 'C';
  if (!board.E) return 'E';

  return card.bandwidth === 'Low' ? 'C' : 'A'; // 覆蓋適當備援槽位
}

/**
 * V2 啟發式 AI 決策引擎
 */
export function computeV2AIDecision(
  aiPlayer: Player,
  market: CommsCard[],
  tacticMarket: TacticCard[],
  activeMissions: CrisisMission[],
  activeEvent: DisasterEvent | null
): AIDecision {
  // 1. 若手牌有戰術卡且有電量或物資需求，優先即時打出 (0 AP)
  if (aiPlayer.handTactics.length > 0) {
    const rechargeTactic = aiPlayer.handTactics.find(t => t.effectType === 'RECHARGE_BATTERY');
    if (rechargeTactic && aiPlayer.energy <= 2) {
      return { actionType: 'PLAY_TACTIC', targetTactic: rechargeTactic };
    }
    const supplyTactic = aiPlayer.handTactics.find(t => t.effectType === 'AIRDROP_CREDITS');
    if (supplyTactic && aiPlayer.credits <= 2) {
      return { actionType: 'PLAY_TACTIC', targetTactic: supplyTactic };
    }
    const empShieldTactic = aiPlayer.handTactics.find(t => t.effectType === 'FARADAY_SHIELD');
    if (empShieldTactic && activeEvent?.id === 'evt_emp_strike' && !aiPlayer.activeBuffs?.faradayEmpArmor) {
      return { actionType: 'PLAY_TACTIC', targetTactic: empShieldTactic };
    }
    const communityRelayTactic = aiPlayer.handTactics.find(t => t.effectType === 'COMMUNITY_RELAY');
    if (communityRelayTactic && !aiPlayer.activeBuffs?.communityRelayActive) {
      return { actionType: 'PLAY_TACTIC', targetTactic: communityRelayTactic };
    }
    const agileTactic = aiPlayer.handTactics.find(t => t.effectType === 'AGILE_PROTOCOL');
    if (agileTactic && !aiPlayer.activeBuffs?.agileProtocolActive && (aiPlayer.inventory.length > 0 || aiPlayer.actionPoints === 0)) {
      return { actionType: 'PLAY_TACTIC', targetTactic: agileTactic };
    }
  }

  // 2. 檢驗當前看板上的任務，若有高成功率且回報佳的任務，立即發起通訊
  if (aiPlayer.actionPoints >= 1) {
    for (const mission of activeMissions) {
      // 依序檢查 P -> A -> C -> E 是否有能完成該任務的卡
      const slots: PACESlot[] = ['P', 'A', 'C', 'E'];
      for (const slot of slots) {
        const card = aiPlayer.paceBoard[slot];
        if (card) {
          const { eligible } = checkCardEligibilityV2(card, slot, mission, activeEvent, aiPlayer);
          if (eligible) {
            return { actionType: 'TRANSMIT', targetMission: mission };
          }
        }
      }
    }
  }

  // 3. 電量過低時進行野戰充電
  if (aiPlayer.energy <= 0 && aiPlayer.actionPoints >= 1) {
    return { actionType: 'RECHARGE' };
  }

  // 4. 若面板有空槽位，且市場有合適裝備，買入並配置
  if (aiPlayer.actionPoints >= 1 && aiPlayer.credits >= 1) {
    const affordableCards = market.filter(c => c.cost <= aiPlayer.credits);
    if (affordableCards.length > 0) {
      // 優先選能增加「媒介多樣性」的卡
      const existingMedia = [
        aiPlayer.paceBoard.P?.medium,
        aiPlayer.paceBoard.A?.medium,
        aiPlayer.paceBoard.C?.medium,
        aiPlayer.paceBoard.E?.medium,
      ].filter(Boolean);

      const diverseCard = affordableCards.find(c => !existingMedia.includes(c.medium));
      const targetCard = diverseCard || affordableCards[0];
      const targetSlot = findBestSlotForCard(aiPlayer, targetCard);

      return {
        actionType: 'BUY_EQUIPMENT',
        targetCard,
        targetSlot,
      };
    }
  }

  // 5. 若物資充裕且市場有戰術卡，買入戰術卡
  if (aiPlayer.actionPoints >= 1 && aiPlayer.credits >= 2 && tacticMarket.length > 0) {
    const affordableTactics = tacticMarket.filter(t => t.cost <= aiPlayer.credits);
    if (affordableTactics.length > 0) {
      return { actionType: 'BUY_TACTIC', targetTactic: affordableTactics[0] };
    }
  }

  // 6. 電量不滿時補充充能
  if (aiPlayer.energy < aiPlayer.maxEnergy - 1 && aiPlayer.actionPoints >= 1) {
    return { actionType: 'RECHARGE' };
  }

  // 7. 無可執行行動，結束回合
  return { actionType: 'END_TURN' };
}
