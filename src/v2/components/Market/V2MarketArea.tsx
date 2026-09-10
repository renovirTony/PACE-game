import React, { useEffect, useState } from 'react';
import { CommsCard, DisasterEvent, PACESlot, PhysicalMedium, Player, TacticCard, WorldviewType } from '../../types/game';
import { canPlaceCardInSlot } from '../../engine/rules';
import { UnifiedCommsCardContent } from '../Cards/UnifiedCommsCardView';
import { RANGE_META, getCommsCardMediumInfo } from '../../data/terminology';
import { EquipCardSpecs } from '../Cards/EquipCardSpecs';
import { ShoppingBag, Zap, Coins, Plus, Check, AlertTriangle, XCircle, Lock, Radio, Shield } from 'lucide-react';

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
  /** 桌面版：數值變動時強制切回「通訊裝備」分頁（供防線空槽的「去市場選購」引導使用） */
  focusEquipNonce?: number;
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
  focusEquipNonce = 0,
}: V2MarketAreaProps) {
  const [selectedCardForSlot, setSelectedCardForSlot] = useState<CommsCard | null>(null);
  const [desktopTab, setDesktopTab] = useState<'equip' | 'tactics'>('equip');

  // 由防線空槽的「去市場選購 ➔」帶進來時，確保停在通訊裝備分頁
  useEffect(() => {
    if (focusEquipNonce > 0) {
      setDesktopTab('equip');
    }
  }, [focusEquipNonce]);

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
                  className={`market-equipment-card p-3 rounded-2xl border flex flex-col gap-2 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : isDisasterTargeted
                      ? 'border-red-500/50 bg-red-950/25'
                      : mediumInfo
                      ? `${mediumInfo.borderColor} ${mediumInfo.bgColor}`
                      : 'border-slate-800 bg-slate-900/90'
                  }`}
                >
                  {/* Top Line: Medium Badge + Equipment Name + Price */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {mediumInfo && (
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border shrink-0 ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
                          {mediumInfo.icon} {mediumInfo.label}
                        </span>
                      )}
                      <span className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                        {content?.name || card.id}
                      </span>
                    </div>

                    <span className="font-black text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 shrink-0">
                      💰 {card.cost} 物資
                    </span>
                  </div>

                  {/* Unified Specs Matrix (MAPS Pattern) */}
                  <EquipCardSpecs card={card} compact />

                  {/* Description & Flavor */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {content?.desc}
                  </p>
                  {content?.flavor && (
                    <p className="text-[11px] text-slate-400 italic">
                      "{content.flavor}"
                    </p>
                  )}

                  {/* Disaster Interruption Notice */}
                  {isDisasterTargeted && (
                    <div className="p-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>注意：當前天災會中斷此媒介的通訊運作！</span>
                    </div>
                  )}

                  {/* Slot Choice Action if Selected (Option B: In-place Vertical List) */}
                  {isSelected ? (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-cyan-500/30 animate-fadeIn">
                      <div className="flex items-center justify-between pb-1 border-b border-white/5">
                        <span className="text-xs text-cyan-300 font-bold">
                          請選擇欲配置的防線槽位：
                        </span>
                        <button
                          onClick={() => setSelectedCardForSlot(null)}
                          className="text-xs text-slate-400 hover:text-slate-200 underline"
                        >
                          取消
                        </button>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {(['P', 'A', 'C', 'E'] as PACESlot[]).map((slot) => {
                          const currentSlotCard = player.paceBoard[slot];
                          const slotValidation = canPlaceCardInSlot(card, slot);
                          const isSlotAllowed = slotValidation.valid;
                          const currentCardName = currentSlotCard
                            ? (currentSlotCard.translations[worldview]?.name || currentSlotCard.id)
                            : null;
                          const currentMediumInfo = currentSlotCard ? getCommsCardMediumInfo(currentSlotCard) : null;

                          const slotColor = slot === 'P'
                            ? 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40'
                            : slot === 'A'
                            ? 'text-blue-300 border-blue-500/40 bg-blue-950/40'
                            : slot === 'C'
                            ? 'text-amber-300 border-amber-500/40 bg-amber-950/40'
                            : 'text-red-300 border-red-500/40 bg-red-950/40';

                          return (
                            <button
                              key={slot}
                              disabled={!isSlotAllowed}
                              onClick={() => handleSlotSelect(slot)}
                              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 active:scale-98 ${
                                !isSlotAllowed
                                  ? 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                                  : currentSlotCard
                                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-cyan-400'
                                  : 'bg-cyan-950/20 hover:bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                              }`}
                            >
                              <div className="flex items-start gap-2 min-w-0 flex-1">
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-black border shrink-0 mt-0.5 ${slotColor}`}>
                                  [{slot}] {slot === 'P' ? '主要' : slot === 'A' ? '備用' : slot === 'C' ? '應急' : '緊急'}
                                </span>
                                <div className="flex flex-col min-w-0 flex-1">
                                  {slot === 'P' && (
                                    <span className="text-[10px] text-slate-400 font-bold mb-0.5">🔒 限中/高頻寬設備</span>
                                  )}
                                  <div className="text-xs font-bold leading-tight break-words text-slate-200">
                                    {currentSlotCard ? (
                                      <>現有: <span className="text-white">{currentCardName}</span> {currentMediumInfo && <span className="text-slate-400 text-xs font-normal">({currentMediumInfo.label})</span>}</>
                                    ) : (
                                      <span className="text-slate-400">目前為空槽</span>
                                    )}
                                  </div>
                                  {!isSlotAllowed && (
                                    <div className="text-xs text-red-400 font-bold leading-tight break-words mt-0.5">
                                      {slotValidation.reason || '限制條件不符'}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <span className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 whitespace-nowrap ml-1 ${
                                !isSlotAllowed
                                  ? 'bg-slate-800 text-slate-600'
                                  : currentSlotCard
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              }`}>
                                {!isSlotAllowed ? '不可放置' : currentSlotCard ? '替換入庫 ➔' : '立即裝備 ➔'}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-xs text-slate-400 text-center pt-0.5">
                        💡 原裝備將自動安全存入備用倉庫（不刪除）
                      </span>
                    </div>
                  ) : (
                    /* Default Purchase Button Row */
                    (() => {
                      const isCreditsShort = player.credits < card.cost;
                      const isAPShort = !isCreditsShort && player.actionPoints === 0 && !isFreeBuy;

                      return (
                        <div className="pt-1.5 border-t border-white/5">
                          <button
                            onClick={() => setSelectedCardForSlot(card)}
                            disabled={disabled || !canAfford}
                            className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all text-center ${
                              canAfford
                                ? isFreeBuy
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md'
                                : 'bg-slate-900 text-slate-500 border border-slate-800 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            {canAfford && <Plus className="w-3.5 h-3.5 shrink-0" />}
                            <span>
                              {isCreditsShort
                                ? `💰 物資不足 (缺 ${card.cost - player.credits})`
                                : isAPShort
                                ? 'AP 不足 (需 1 AP)'
                                : isFreeBuy
                                ? '採購並裝配 (0 AP)'
                                : '採購並裝配 (1 AP)'}
                            </span>
                          </button>
                        </div>
                      );
                    })()
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Tactic Market (Strict 1-Column) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-black text-purple-400 flex items-center gap-1 px-1">
            🛡️ 應急戰術補給卡 (戰術卡使用不消耗AP)
          </span>

          <div className="flex flex-col gap-2.5">
            {tacticMarket.map((tactic) => {
              const content = tactic.translations[worldview];
              const isFreeBuy = Boolean(player.activeBuffs?.freeMarketPurchaseActive);
              const canAfford = player.credits >= tactic.cost && (player.actionPoints >= 1 || isFreeBuy);
              const isCreditsShort = player.credits < tactic.cost;
              const isAPShort = !isCreditsShort && player.actionPoints === 0 && !isFreeBuy;

              return (
                <div
                  key={tactic.id}
                  className="market-tactic-card p-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex flex-col gap-2"
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

                  <div className="pt-1.5 border-t border-white/5">
                    <button
                      onClick={() => onBuyTactic(tactic)}
                      disabled={disabled || !canAfford}
                      className={`w-full py-2 px-3 rounded-xl font-black text-xs transition-all text-center ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                          : 'bg-slate-900 text-slate-500 border border-slate-800 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {isCreditsShort
                        ? `💰 物資不足 (缺 ${tactic.cost - player.credits})`
                        : isAPShort
                        ? 'AP 不足 (需 1 AP)'
                        : isFreeBuy
                        ? '購入戰術 (0 AP)'
                        : '購入戰術 (1 AP)'}
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
  // 2. DESKTOP PANORAMIC VIEW (2-Tier Compact Zero-Scroll Layout)
  // =========================================================================
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md font-mono flex flex-col gap-2.5 transition-all relative text-xs h-full">

      {/* Header with Tab Switcher */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setDesktopTab('equip')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              desktopTab === 'equip'
                ? 'bg-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span>📡 通訊裝備 ({market.length})</span>
          </button>
          <button
            onClick={() => setDesktopTab('tactics')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              desktopTab === 'tactics'
                ? 'bg-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>🛡️ 戰術補給 ({tacticMarket.length})</span>
          </button>
        </div>
        <span className="text-[11px] font-bold text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 shrink-0 whitespace-nowrap">
          現有物資: 💰 {player.credits}
        </span>
      </div>

      {/* Equipment Cards Tab View (2x2 Roomy Grid) */}
      {desktopTab === 'equip' && (
        <div className="grid grid-cols-2 gap-2.5 flex-1 animate-fadeIn">
          {market.map((card, idx) => {
            const content = card.translations[worldview];
            const mediumInfo = getCommsCardMediumInfo(card);
            const isFreeBuy = Boolean(player.activeBuffs?.freeMarketPurchaseActive);
            const canAfford = player.credits >= card.cost && (player.actionPoints >= 1 || isFreeBuy);
            const isSelected = selectedCardForSlot?.id === card.id;

            // 檢查是否受當前天災阻斷
            const isDisasterTargeted = Boolean(
              activeEvent && activeEvent.targetedMedia.includes(card.medium) && !(activeEvent.id === 'evt_emp_strike' && card.resilience.empShield)
            );

            const isCreditsShort = player.credits < card.cost;
            const isAPShort = !isCreditsShort && player.actionPoints === 0 && !isFreeBuy;
            const rangeInfo = RANGE_META[card.range] || { label: card.range, fullLabel: card.range, desc: '' };

            const cardBorder = isSelected
              ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
              : isDisasterTargeted
              ? 'border-red-500/50 bg-red-950/25'
              : mediumInfo
              ? `${mediumInfo.borderColor} ${mediumInfo.bgColor}`
              : 'border-slate-800 bg-slate-900/70 hover:border-slate-700';

            return (
              <div
                key={card.id}
                data-tutorial={idx === 0 ? 'market-card-0' : undefined}
                className={`market-equipment-card rounded-2xl border p-3 flex flex-col gap-2 transition-all relative ${cardBorder}`}
              >
                {/* Top: Medium Badge + Equipment Name + Price */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    {mediumInfo && (
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border shrink-0 whitespace-nowrap ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
                        {mediumInfo.icon} {mediumInfo.label}
                      </span>
                    )}
                    <span className="font-black text-sm text-slate-100 break-words leading-tight min-w-0" title={content?.name || card.id}>
                      {content?.name || card.id}
                    </span>
                  </div>
                  <span className="font-black text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 shrink-0 whitespace-nowrap">
                    💰 {card.cost} 物資
                  </span>
                </div>

                {/* Unified Specs Matrix (MAPS Pattern — 桌面版採用寬適版面) */}
                <EquipCardSpecs card={card} />

                {/* Tactical Description & Flavor */}
                {content?.desc && (
                  <p className="text-xs text-slate-300 break-words leading-relaxed" title={content.desc}>
                    {content.desc}
                  </p>
                )}
                {content?.flavor && (
                  <p className="text-[11px] text-slate-400 italic break-words leading-snug">
                    "{content.flavor}"
                  </p>
                )}

                {/* Disaster Interruption Notice */}
                {isDisasterTargeted && (
                  <div className="p-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-snug break-words">注意：當前天災會中斷此媒介的通訊運作！</span>
                  </div>
                )}

                {/* Slot Selection inside card (與手機版同一心智模型) */}
                {isSelected ? (
                  <div className="mt-auto flex flex-col gap-1.5 pt-2 border-t border-cyan-500/30 animate-fadeIn">
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/5">
                      <span className="text-xs text-cyan-300 font-bold">請選擇欲配置的防線槽位：</span>
                      <button
                        onClick={() => setSelectedCardForSlot(null)}
                        className="text-xs text-slate-400 hover:text-slate-200 underline shrink-0"
                      >
                        取消
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {(['P', 'A', 'C', 'E'] as PACESlot[]).map((slot) => {
                        const currentSlotCard = player.paceBoard[slot];
                        const slotValidation = canPlaceCardInSlot(card, slot);
                        const isSlotAllowed = slotValidation.valid;
                        const currentCardName = currentSlotCard
                          ? (currentSlotCard.translations[worldview]?.name || currentSlotCard.id)
                          : null;
                        const currentMediumInfo = currentSlotCard ? getCommsCardMediumInfo(currentSlotCard) : null;

                        const slotColor = slot === 'P'
                          ? 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40'
                          : slot === 'A'
                          ? 'text-blue-300 border-blue-500/40 bg-blue-950/40'
                          : slot === 'C'
                          ? 'text-amber-300 border-amber-500/40 bg-amber-950/40'
                          : 'text-red-300 border-red-500/40 bg-red-950/40';

                        return (
                          <button
                            key={slot}
                            disabled={!isSlotAllowed}
                            onClick={() => handleSlotSelect(slot)}
                            className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 active:scale-98 ${
                              !isSlotAllowed
                                ? 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                                : currentSlotCard
                                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-cyan-400'
                                : 'bg-cyan-950/20 hover:bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                            }`}
                          >
                            <div className="flex items-start gap-2 min-w-0 flex-1">
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-black border shrink-0 mt-0.5 whitespace-nowrap ${slotColor}`}>
                                [{slot}] {slot === 'P' ? '主要' : slot === 'A' ? '備用' : slot === 'C' ? '應急' : '緊急'}
                              </span>
                              <div className="flex flex-col min-w-0 flex-1">
                                {slot === 'P' && (
                                  <span className="text-[10px] text-slate-400 font-bold mb-0.5">🔒 限中/高頻寬設備</span>
                                )}
                                <div className="text-xs font-bold leading-tight break-words text-slate-200">
                                  {currentSlotCard ? (
                                    <>現有: <span className="text-white">{currentCardName}</span> {currentMediumInfo && <span className="text-slate-400 text-xs font-normal">({currentMediumInfo.label})</span>}</>
                                  ) : (
                                    <span className="text-slate-400">目前為空槽</span>
                                  )}
                                </div>
                                {!isSlotAllowed && (
                                  <div className="text-xs text-red-400 font-bold leading-tight break-words mt-0.5">
                                    {slotValidation.reason || '限制條件不符'}
                                  </div>
                                )}
                              </div>
                            </div>

                            <span className={`px-2 py-1 rounded-lg text-xs font-black shrink-0 whitespace-nowrap ${
                              !isSlotAllowed
                                ? 'bg-slate-800 text-slate-600'
                                : currentSlotCard
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            }`}>
                              {!isSlotAllowed ? '不可放置' : currentSlotCard ? '替換入庫 ➔' : '立即裝備 ➔'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-[11px] text-slate-400 text-center pt-0.5">
                      💡 原裝備將自動安全存入備用倉庫（不刪除）
                    </span>
                  </div>
                ) : (
                  <div className="mt-auto pt-2 border-t border-white/5">
                    <button
                      onClick={() => setSelectedCardForSlot(card)}
                      disabled={disabled || !canAfford}
                      className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all text-center shadow-md active:scale-95 ${
                        canAfford
                          ? isFreeBuy
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                          : 'bg-slate-900 text-slate-500 border border-slate-800 opacity-60 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {canAfford && <Plus className="w-3.5 h-3.5 shrink-0" />}
                      <span className="whitespace-nowrap">
                        {isCreditsShort
                          ? `💰 物資不足 (缺 ${card.cost - player.credits})`
                          : isAPShort
                          ? 'AP 不足 (需 1 AP)'
                          : isFreeBuy
                          ? '採購並裝配 (0 AP)'
                          : '採購並裝配 (1 AP)'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tactics Cards Tab View (直式單欄清單 · 對齊手機版排版) */}
      {desktopTab === 'tactics' && (
        <div className="flex flex-col gap-2.5 flex-1 animate-fadeIn">
          <span className="text-[11px] font-black text-purple-400 flex items-center gap-1 px-1">
            🛡️ 應急戰術補給卡 (購入後放入手牌 · 戰術卡使用不消耗AP)
          </span>

          {tacticMarket.map((tactic) => {
            const content = tactic.translations[worldview];
            const isFreeBuy = Boolean(player.activeBuffs?.freeMarketPurchaseActive);
            const canAfford = player.credits >= tactic.cost && (player.actionPoints >= 1 || isFreeBuy);
            const isCreditsShort = player.credits < tactic.cost;
            const isAPShort = !isCreditsShort && player.actionPoints === 0 && !isFreeBuy;

            return (
              <div
                key={tactic.id}
                className="market-tactic-card rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3 flex flex-col gap-2 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-black text-purple-200 break-words leading-tight min-w-0" title={content?.name || ''}>
                    🎴 {content?.name}
                  </span>
                  <span className="font-bold text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 shrink-0 whitespace-nowrap">
                    💰 {tactic.cost} 物資
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 break-words leading-relaxed">
                  {content?.desc}
                </p>

                <div className="pt-1.5 border-t border-white/5">
                  <button
                    onClick={() => onBuyTactic(tactic)}
                    disabled={disabled || !canAfford}
                    className={`w-full py-2 px-3 rounded-xl font-black text-xs transition-all text-center shadow-md active:scale-95 ${
                      canAfford
                        ? isFreeBuy
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-slate-900 text-slate-500 border border-slate-800 opacity-60 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isCreditsShort
                      ? `💰 物資不足 (缺 ${tactic.cost - player.credits})`
                      : isAPShort
                      ? 'AP 不足 (需 1 AP)'
                      : isFreeBuy
                      ? '購入戰術 (0 AP)'
                      : '購入戰術 (1 AP)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
