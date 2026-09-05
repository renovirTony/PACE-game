import React, { useState } from 'react';
import { CommsCard, DisasterEvent, PACESlot, PhysicalMedium, Player, TacticCard, WorldviewType } from '../../types/game';
import { canPlaceCardInSlot } from '../../engine/rules';
import { UnifiedCommsCardContent, getCommsCardMediumInfo } from '../Cards/UnifiedCommsCardView';
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
  isMobile?: boolean;
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
  isMobile = false,
}: V2MarketAreaProps) {
  const [selectedCardForSlot, setSelectedCardForSlot] = useState<CommsCard | null>(null);

  const handleSlotSelect = (slot: PACESlot) => {
    if (selectedCardForSlot) {
      onBuyEquipment(selectedCardForSlot, slot);
      setSelectedCardForSlot(null);
    }
  };

  // =========================================================================
  // 1. MOBILE VERTICAL LAYOUT (Strict 1-Column Ergonomic View)
  // =========================================================================
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 font-mono">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>物資調配市場</span>
          </span>
          <span className="text-[11px] font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40">
            現有物資: 💰 {player.credits}
          </span>
        </div>

        {/* Section 1: Equipment Market (Strict 1-Column) */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-black text-cyan-400 flex items-center gap-1 px-1">
            📡 通訊工具裝備 (採購並自選放入防線)
          </span>

          <div className="flex flex-col gap-2.5">
            {market.map((card, idx) => {
              const content = card.translations[worldview];
              const mediumInfo = getCommsCardMediumInfo(card);
              const isFreeBuy = Boolean(player.activeBuffs?.freeMarketPurchaseActive);
              const canAfford = player.credits >= card.cost && (player.actionPoints >= 1 || isFreeBuy);
              const isSelected = selectedCardForSlot?.id === card.id;

              // Disaster targeted check
              const isDisasterTargeted = Boolean(
                activeEvent && activeEvent.targetedMedia.includes(card.medium) && !(activeEvent.id === 'evt_emp_strike' && card.resilience.empShield)
              );

              return (
                <div
                  key={card.id}
                  data-tutorial={idx === 0 ? 'market-card-0' : undefined}
                  className={`p-3 rounded-2xl border flex flex-col gap-2 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : isDisasterTargeted
                      ? 'border-red-500/40 bg-red-950/20'
                      : 'border-slate-800 bg-slate-900/90'
                  }`}
                >
                  {/* Top Line: Medium Badge + Equipment Name + Price */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {mediumInfo && (
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
                          {mediumInfo.icon} {mediumInfo.label}
                        </span>
                      )}
                      <span className="font-bold text-xs text-slate-100 truncate">
                        {content?.name || card.id}
                      </span>
                    </div>

                    <span className="font-black text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 shrink-0">
                      💰 {card.cost} 物資
                    </span>
                  </div>

                  {/* Specs Row: Clean inline pills (no squeezed 3-col matrix) */}
                  <div className="flex items-center gap-1 text-[10px] flex-wrap">
                    <span className={`px-1.5 py-0.2 rounded font-bold border ${
                      card.bandwidth === 'High' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30' : card.bandwidth === 'Medium' ? 'bg-amber-950 text-amber-300 border-amber-500/30' : 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {card.bandwidth} 頻寬
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
                      {card.powerCost}⚡
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-black/40 text-slate-300 border border-white/10 font-bold">
                      {card.range === 'Local' ? '近程' : card.range === 'LineOfSight' ? '視距' : card.range === 'LongRange' ? '長程' : card.range === 'Penetrating' ? '穿透' : card.range}
                    </span>
                    {card.resilience.weatherResistant && (
                      <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">耐天候</span>
                    )}
                    {card.resilience.empShield && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-bold">抗EMP</span>
                    )}
                    {card.resilience.subterranean && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">地底穿透</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {content?.desc}
                  </p>

                  {/* Disaster Interruption Notice */}
                  {isDisasterTargeted && (
                    <div className="p-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>注意：當前天災會中斷此媒介的通訊運作！</span>
                    </div>
                  )}

                  {/* Slot Choice Action if Selected */}
                  {isSelected ? (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-cyan-500/30 animate-fadeIn">
                      <span className="text-[11px] text-cyan-300 text-center font-bold">
                        請點選欲配置的防線槽位：
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['P', 'A', 'C', 'E'] as PACESlot[]).map((slot) => {
                          const hasOldCard = Boolean(player.paceBoard[slot]);
                          const slotValidation = canPlaceCardInSlot(card, slot);
                          const isSlotAllowed = slotValidation.valid;

                          return (
                            <button
                              key={slot}
                              disabled={!isSlotAllowed}
                              onClick={() => handleSlotSelect(slot)}
                              className={`py-2 rounded-xl font-black text-xs transition-all active:scale-95 flex flex-col items-center justify-center ${
                                !isSlotAllowed
                                  ? 'bg-slate-900 border border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                                  : hasOldCard
                                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                              }`}
                            >
                              <span>[{slot}] 槽</span>
                              <span className="text-[9px] font-bold opacity-80">
                                {!isSlotAllowed ? '不符' : hasOldCard ? '替換' : '空槽'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>💡 原裝備將自動存入備用倉庫</span>
                        <button
                          onClick={() => setSelectedCardForSlot(null)}
                          className="text-slate-400 hover:text-slate-200 underline"
                        >
                          取消選擇
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Default Purchase Button Row */
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                      <span className="text-[10px] text-slate-400 font-bold">
                        動作消耗: <b className={isFreeBuy ? 'text-emerald-400' : 'text-amber-400'}>{isFreeBuy ? '0 AP (免AP)' : '1 AP'}</b>
                      </span>
                      <button
                        onClick={() => setSelectedCardForSlot(card)}
                        disabled={disabled || !canAfford}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 transition-all ${
                          canAfford
                            ? isFreeBuy
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md'
                            : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isFreeBuy ? '採購並裝配 (0 AP)' : '採購並裝配 (1 AP)'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Tactic Market (Strict 1-Column) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-black text-purple-400 flex items-center gap-1 px-1">
            🛡️ 應急戰術補給卡 (購入手牌隨時 0 AP 發動)
          </span>

          <div className="flex flex-col gap-2.5">
            {tacticMarket.map((tactic) => {
              const content = tactic.translations[worldview];
              const isFreeBuy = Boolean(player.activeBuffs?.freeMarketPurchaseActive);
              const canAfford = player.credits >= tactic.cost && (player.actionPoints >= 1 || isFreeBuy);

              return (
                <div
                  key={tactic.id}
                  className="p-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-purple-200 truncate">
                      🎴 {content?.name}
                    </span>
                    <span className="font-bold text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 shrink-0">
                      💰 {tactic.cost} 物資
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {content?.desc}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold">
                      購入手牌: <b className={isFreeBuy ? 'text-emerald-400' : 'text-amber-400'}>{isFreeBuy ? '0 AP' : '1 AP'}</b>
                    </span>
                    <button
                      onClick={() => onBuyTactic(tactic)}
                      disabled={disabled || !canAfford}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                        canAfford
                          ? isFreeBuy
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                          : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {isFreeBuy ? '購入手牌 (0 AP)' : '購入手牌 (1 AP)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. DESKTOP PANORAMIC VIEW
  // =========================================================================
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-mono flex flex-col gap-4 transition-all relative">

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {market.map((card, idx) => {
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
                data-tutorial={idx === 0 ? 'market-card-0' : undefined}
                className={`market-equipment-card rounded-2xl border p-3.5 flex flex-col justify-between gap-2.5 transition-all relative h-full ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
                    : isDisasterTargeted
                    ? 'border-red-500/40 bg-red-950/20'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {/* Disaster Target Alert */}
                {isDisasterTargeted && (
                  <div className="market-disaster-alert p-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-bold flex items-center gap-1">
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
                className="market-tactic-card rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 flex flex-col justify-between gap-2 hover:border-slate-700 transition-all h-full"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-black text-slate-100 leading-snug break-words flex-1 min-w-0">
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
