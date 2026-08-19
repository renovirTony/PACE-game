import { CrisisMission, GlobalEvent, Player, CommsCard, TacticCard } from '../types/game';
import { evaluatePACETransmission } from './rules';

export interface AIDecision {
  action: 'BUY_EQUIPMENT' | 'BUY_TACTIC' | 'PLAY_TACTIC' | 'TRANSMIT' | 'RECHARGE_ENERGY' | 'END_TURN';
  targetCard?: CommsCard | TacticCard;
  targetSlot?: 'P' | 'A' | 'C' | 'E';
  targetMission?: CrisisMission;
  reason: string;
}

export function computeAIDecision(
  aiPlayer: Player,
  market: CommsCard[],
  tacticMarket: TacticCard[],
  activeMissions: CrisisMission[],
  activeEvent: GlobalEvent | null
): AIDecision {
  // 1. 如果 AP 不足，結束回合
  if (aiPlayer.actionPoints <= 0) {
    return { action: 'END_TURN', reason: '行動點數 (AP) 已耗盡' };
  }

  // 2. 檢查手牌中的戰術卡 (如果電量過低且有發電機或補給)
  if (aiPlayer.energy <= 1) {
    const powerCard = aiPlayer.handTactics.find(t => t.effectType === 'GAIN_ENERGY');
    if (powerCard) {
      return {
        action: 'PLAY_TACTIC',
        targetCard: powerCard,
        reason: '電量偏低，使用戰術卡補充能源'
      };
    }
  }

  // 3. 優先檢查是否可以直接完成場上的高分危機任務 (廣播傳輸)
  const transmittableMissions: { mission: CrisisMission; vp: number; slot: string }[] = [];
  for (const mission of activeMissions) {
    if (mission.claimedBy.includes(aiPlayer.id)) continue;
    const result = evaluatePACETransmission(aiPlayer, mission, activeEvent);
    if (result.canTransmit) {
      transmittableMissions.push({
        mission,
        vp: mission.vp + result.bonusPoints,
        slot: result.successfulSlot || 'P'
      });
    }
  }

  if (transmittableMissions.length > 0) {
    // 依可得 VP 由大到小排序
    transmittableMissions.sort((a, b) => b.vp - a.vp);
    const best = transmittableMissions[0];
    return {
      action: 'TRANSMIT',
      targetMission: best.mission,
      reason: `發現可連通任務「${best.mission.title}」，預計獲得 ${best.vp} VP！`
    };
  }

  // 4. 如果 PACE 槽位有空缺，優先填補空缺槽位
  const emptySlots: ('P' | 'A' | 'C' | 'E')[] = [];
  if (!aiPlayer.paceBoard.P) emptySlots.push('P');
  if (!aiPlayer.paceBoard.A) emptySlots.push('A');
  if (!aiPlayer.paceBoard.C) emptySlots.push('C');
  if (!aiPlayer.paceBoard.E) emptySlots.push('E');

  if (emptySlots.length > 0) {
    for (const slot of emptySlots) {
      const affordableCard = market.find(c => c.slot === slot && c.cost <= aiPlayer.credits);
      if (affordableCard) {
        return {
          action: 'BUY_EQUIPMENT',
          targetCard: affordableCard,
          targetSlot: slot,
          reason: `填補 ${slot} 槽位空缺，採購「${affordableCard.name}」`
        };
      }
    }
  }

  // 5. 考慮升級已有的裝備 (如果資金充足，尋找高 VP 或高抗性卡片)
  for (const card of market) {
    if (card.cost <= aiPlayer.credits) {
      const currentCard = aiPlayer.paceBoard[card.slot];
      if (currentCard && (card.bonusVP || 0) > (currentCard.bonusVP || 0)) {
        return {
          action: 'BUY_EQUIPMENT',
          targetCard: card,
          targetSlot: card.slot,
          reason: `升級 ${card.slot} 槽位至更高階裝備「${card.name}」`
        };
      }
    }
  }

  // 6. 購買戰術卡 (如果資金足夠且手牌未滿)
  if (aiPlayer.credits >= 2 && aiPlayer.handTactics.length < 3 && tacticMarket.length > 0) {
    const affordableTactic = tacticMarket.find(t => t.cost <= aiPlayer.credits);
    if (affordableTactic) {
      return {
        action: 'BUY_TACTIC',
        targetCard: affordableTactic,
        reason: `補充戰術手牌「${affordableTactic.name}」`
      };
    }
  }

  // 7. 若還有 AP 且電量未滿，手動充能
  if (aiPlayer.energy < aiPlayer.maxEnergy && aiPlayer.actionPoints > 0) {
    return {
      action: 'RECHARGE_ENERGY',
      reason: '利用剩餘行動點數為蓄電池充電 (+2⚡)'
    };
  }

  // 8. 無其他最佳行動，結束回合
  return { action: 'END_TURN', reason: '戰術部署完畢，結束本回合' };
}
