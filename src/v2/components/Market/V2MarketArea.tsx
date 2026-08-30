import React, { useState } from 'react';
import { CommsCard, DisasterEvent, PACESlot, PhysicalMedium, Player, TacticCard, WorldviewType } from '../../types/game';
import { canPlaceCardInSlot } from '../../engine/rules';
import { UnifiedCommsCardContent } from '../Cards/UnifiedCommsCardView';
import { ShoppingBag, Zap, Coins, Plus, Check, AlertTriangle, XCircle, Lock } from 'lucide-react';

interface V2MarketAreaProps {
  player: Player;
  activeEvent: DisasterEvent | null;
  market: CommsCard[];
  tacticMarket: TacticCard[];
  worldview: WorldviewType;
  disabled?: boolean;
  onBuyEquipment: (card: CommsCard, targetSlot: PACESlot) => boolean;
  onBuyTactic: (card: TacticCard) => boolean;
}

export function V2MarketArea({
  player,
  activeEvent,
  market,
  tacticMarket,
  worldview,
  disabled,
  onBuyEquipment,
  onBuyTactic,
}: V2MarketAreaProps) {
  const [selectedCardForSlot, setSelectedCardForSlot] = useState<CommsCard | null>(null);

  const handleSlotSelect = (slot: PACESlot) => {
    if (selectedCardForSlot) {
      onBuyEquipment(selectedCardForSlot, slot);
      setSelectedCardForSlot(null);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-mono flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold text-slate-100">
            物資調配市場 (Equipment & Tactics Market)
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          採購裝備並自由指派至 P / A / C / E 防線
        </span>
      </div>

      {/* Equipment Cards Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
          📡 通訊工具裝備 (可自選指派防線槽位)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {market.map((card) => {
            const isFreeBuy = Boolean(player.activeBuffs?.freeMarketPurchaseActive);
            const canAfford = player.credits >= card.cost && (player.actionPoints >= 1 || isFreeBuy);
            const isSelected = selectedCardForSlot?.id === card.id;

            // 檢查是否受當前天災阻斷
            const isDisasterTargeted = Boolean(
              activeEvent && activeEvent.targetedMedia.includes(card.medium) && !(activeEvent.id === 'evt_emp_strike' && card.resilience.empShield)
            );

            return (
              <div
                key={card.id}
                className={`rounded-2xl border p-3.5 flex flex-col justify-between gap-2.5 transition-all relative ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
                    : isDisasterTargeted
                    ? 'border-red-500/40 bg-red-950/20'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {/* Disaster Target Alert */}
                {isDisasterTargeted && (
                  <div className="p-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                    <span>當前天災中斷此媒介</span>
                  </div>
                )}

                {/* Unified Card Content with Cost Badge */}
                <UnifiedCommsCardContent
                  card={card}
                  worldview={worldview}
                  headerRightBadge={
                    <span className="font-bold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px]">
                      💰 {card.cost} 物資
                    </span>
                  }
                />

                {/* Slot Choice Action */}
                {isSelected ? (
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-cyan-500/30 animate-fadeIn">
                    <span className="text-[10px] text-cyan-300 text-center font-bold">
                      請選擇放入哪個槽位：
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {(['P', 'A', 'C', 'E'] as PACESlot[]).map((slot) => {
                        const hasOldCard = Boolean(player.paceBoard[slot]);
                        const slotValidation = canPlaceCardInSlot(card, slot);
                        const isSlotAllowed = slotValidation.valid;

                        return (
                          <button
                            key={slot}
                            disabled={!isSlotAllowed}
                            onClick={() => handleSlotSelect(slot)}
                            className={`py-1.5 rounded-lg font-black text-xs transition-all active:scale-95 flex flex-col items-center justify-center ${
                              !isSlotAllowed
                                ? 'bg-slate-900 border border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                                : hasOldCard
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                            }`}
                            title={
                              !isSlotAllowed
                                ? slotValidation.reason || '此槽位不允許放入此裝備'
                                : hasOldCard
                                ? `放入 [${slot}] (原裝備將移至備用倉庫)`
                                : `放入 [${slot}] 空槽`
                            }
                          >
                            <span>[{slot}]</span>
                            <span className="text-[9px] font-normal opacity-80">
                              {!isSlotAllowed ? '不符' : hasOldCard ? '收存' : '空槽'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[9px] text-slate-400 text-center mt-0.5">
                      💡 原槽位裝備會安全移至【備用裝備倉庫】
                    </span>
                    <button
                      onClick={() => setSelectedCardForSlot(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 text-center mt-0.5"
                    >
                      取消選擇
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedCardForSlot(card)}
                    disabled={disabled || !canAfford}
                    className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      canAfford
                        ? isFreeBuy
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black shadow-md'
                          : 'bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-200 border border-slate-700'
                        : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isFreeBuy ? '採購裝備 (0 AP [後勤])' : '採購裝備 (1 AP)'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tactic Cards Row */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
          🛡️ 戰術應急補給 (購入手牌隨時發動)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tacticMarket.map((tactic) => {
            const content = tactic.translations[worldview];
            const isFreeBuy = Boolean(player.activeBuffs?.freeMarketPurchaseActive);
            const canAfford = player.credits >= tactic.cost && (player.actionPoints >= 1 || isFreeBuy);

            return (
              <div
                key={tactic.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 flex flex-col justify-between gap-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-100 truncate">
                    {content?.name}
                  </span>
                  <span className="font-bold text-emerald-300 text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 shrink-0">
                    💰 {tactic.cost}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {content?.desc}
                </p>

                <button
                  onClick={() => onBuyTactic(tactic)}
                  disabled={disabled || !canAfford}
                  className={`w-full py-1.5 rounded-xl font-bold text-xs transition-all ${
                    canAfford
                      ? isFreeBuy
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 border border-slate-700'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isFreeBuy ? '購入戰術 (0 AP [後勤])' : '購入戰術卡 (1 AP)'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
