import React, { useState } from 'react';
import { CommsCard, DisasterEvent, PACESlot, PhysicalMedium, Player, WorldviewType } from '../../types/game';
import { canPlaceCardInSlot } from '../../engine/rules';
import { UnifiedCommsCardContent } from '../Cards/UnifiedCommsCardView';
import { BANDWIDTH_META, PHYSICAL_MEDIUM_META, RANGE_META, getCommsCardMediumInfo } from '../../data/terminology';
import { EquipCardSpecs } from '../Cards/EquipCardSpecs';
import { 
  Radio, 
  Smartphone, 
  Satellite, 
  Cable, 
  Bike, 
  Sun, 
  Volume2, 
  Truck, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeftRight,
  Archive,
  Plus,
  Trash2,
  ZapOff,
  CloudRain,
  XCircle,
  Lock
} from 'lucide-react';

interface CustomPaceBoardProps {
  player: Player;
  activeEvent: DisasterEvent | null;
  isCurrentPlayer: boolean;
  worldview: WorldviewType;
  onSwapSlots: (slotA: PACESlot, slotB: PACESlot) => void | boolean;
  onStoreCard: (slot: PACESlot) => void;
  onEquipFromInventory: (card: CommsCard, targetSlot: PACESlot) => void | boolean;
  onDiscardFromInventory?: (cardId: string) => void;
  isMobile?: boolean;
  isVertical?: boolean;
  onGoToMarket?: () => void;
}

const slotMeta: Record<PACESlot, { title: string; subtitle: string; roleDesc: string; defaultColor: string; revenueLabel: string }> = {
  P: {
    title: '[P] 主要防線 (Primary)',
    subtitle: '平時主力 · 🔒 限中/高頻寬',
    roleDesc: '平時優先使用 · 能傳送大量資料與影片 · 成功獲收益 100% 滿額分',
    defaultColor: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    revenueLabel: '收益 100%',
  },
  A: {
    title: '[A] 備用防線 (Alternate)',
    subtitle: '第一後備通訊',
    roleDesc: '主力受阻時接手 · 建議使用不同傳輸方式 · 成功獲收益 100% 滿額分',
    defaultColor: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
    revenueLabel: '收益 100%',
  },
  C: {
    title: '[C] 應急防線 (Contingency)',
    subtitle: '第二後備應急通訊',
    roleDesc: '前兩道都失效時接手 · 具備抗災耐受力 · 成功獲收益 70% 止血分',
    defaultColor: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    revenueLabel: '收益 70%',
  },
  E: {
    title: '[E] 緊急防線 (Emergency)',
    subtitle: '最後一道保命防線',
    roleDesc: '科技全滅時的免電手段 (吹哨/光碼/信差) · 成功獲收益 50% 保命分',
    defaultColor: 'border-red-500/40 bg-red-950/20 text-red-300',
    revenueLabel: '收益 50%',
  },
};

/** 槽位簡稱（雙端共用，避免文案分歧） */
const SLOT_SHORT_LABEL: Record<PACESlot, string> = {
  P: '主要',
  A: '備用',
  C: '應急',
  E: '緊急',
};

/** 槽位徽章配色（雙端共用，[E] 統一為紅色系） */
const SLOT_BADGE_CLASS: Record<PACESlot, string> = {
  P: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
  A: 'bg-blue-950 text-blue-300 border-blue-500/40',
  C: 'bg-amber-950 text-amber-300 border-amber-500/40',
  E: 'bg-red-950 text-red-300 border-red-500/40',
};

export function CustomPaceBoard({
  player,
  activeEvent,
  isCurrentPlayer,
  worldview,
  onSwapSlots,
  onStoreCard,
  onEquipFromInventory,
  onDiscardFromInventory,
  isMobile = false,
  isVertical = false,
  onGoToMarket,
}: CustomPaceBoardProps) {
  const slots: PACESlot[] = ['P', 'A', 'C', 'E'];
  const board = player.paceBoard;
  const inventory = player.inventory || [];

  // Active Swap selector state
  const [activeSwapSlot, setActiveSwapSlot] = useState<PACESlot | null>(null);
  const [activeInventoryCard, setActiveInventoryCard] = useState<CommsCard | null>(null);

  // 媒介獨立性檢驗 (Media Diversity Check)
  const pMedium = board.P?.medium;
  const aMedium = board.A?.medium;
  const hasCommonModeFailure = Boolean(pMedium && aMedium && pMedium === aMedium);

  const usedMedia = Object.values(board)
    .filter((c): c is CommsCard => c !== null)
    .map(c => c.medium);
  const uniqueMediaCount = new Set(usedMedia).size;

  const handleSwapTarget = (targetSlot: PACESlot) => {
    if (activeSwapSlot && activeSwapSlot !== targetSlot) {
      onSwapSlots(activeSwapSlot, targetSlot);
      setActiveSwapSlot(null);
    }
  };

  const handleEquipFromInv = (targetSlot: PACESlot) => {
    if (activeInventoryCard) {
      onEquipFromInventory(activeInventoryCard, targetSlot);
      setActiveInventoryCard(null);
    }
  };

  const hasAP = player.actionPoints > 0;

  // =========================================================================
  // 1. VERTICAL LAYOUT (Mobile or Desktop Left Column Command Center)
  // =========================================================================
  if (isMobile || isVertical) {
    return (
      <div data-tutorial="pace-board" className="flex flex-col gap-3 font-mono">
        {/* Header with Diversity Metric */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>PACE 四重防線配置</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
            uniqueMediaCount >= 3
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : uniqueMediaCount === 2
              ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              : 'bg-red-950/80 border-red-500/40 text-red-300'
          }`}>
            {uniqueMediaCount >= 3 ? '✓' : '⚠️'} {uniqueMediaCount}/4 獨立媒介
          </span>
        </div>

        {/* Common Mode Failure Alert */}
        {hasCommonModeFailure && (
          <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] leading-snug flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">⚠️ 同類設備同時失靈警示：</span>
              [P] 與 [A] 槽皆為【{PHYSICAL_MEDIUM_META[pMedium!].label}】，一旦遭天災破壞前兩道防線將同時癱瘓！建議點擊「調換」錯開傳輸方式。
            </div>
          </div>
        )}

        {/* Active Swap Alert - Sticky Top */}
        {activeSwapSlot && (
          <div className="sticky top-2 z-20 p-2.5 rounded-2xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs flex items-center justify-between shadow-xl backdrop-blur-md animate-fadeIn">
            <span className="font-bold">
              🔄 正在調換 <b>[{activeSwapSlot}]</b> 防線，請點選目標槽位：
            </span>
            <button
              onClick={() => setActiveSwapSlot(null)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold shrink-0 ml-2"
            >
              取消調換
            </button>
          </div>
        )}

        {/* Active Inventory Equip Alert - Sticky Top */}
        {activeInventoryCard && (
          <div className="sticky top-2 z-20 p-2.5 rounded-2xl bg-purple-950/95 border border-purple-400 text-purple-200 text-xs flex items-center justify-between shadow-xl backdrop-blur-md animate-fadeIn">
            <span className="font-bold">
              📥 正在裝備倉庫物品，請點選目標槽位：
            </span>
            <button
              onClick={() => setActiveInventoryCard(null)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/40 text-xs font-bold shrink-0 ml-2"
            >
              取消裝備
            </button>
          </div>
        )}

        {/* 4 Compact Full-Width Slots Stacked Vertically */}
        <div className="flex flex-col gap-2.5">
          {slots.map((slot) => {
            const card = board[slot];
            const meta = slotMeta[slot];
            const mediumInfo = getCommsCardMediumInfo(card);
            const isSwapSource = activeSwapSlot === slot;
            const isAgile = Boolean(player.activeBuffs?.agileProtocolActive);
            const canActionAP = player.actionPoints > 0 || isAgile;

            // Disaster check
            const isEmpImmune = Boolean(card?.resilience.empShield || player.activeBuffs?.faradayEmpArmor);
            const isDisasterTargeted = Boolean(
              card && activeEvent && activeEvent.targetedMedia.includes(card.medium) && !(activeEvent.id === 'evt_emp_strike' && isEmpImmune)
            );

            // Power check
            const effectivePowerCost = (card?.powerCost || 0) + (activeEvent?.powerDrainBonus || 0);
            const isOutOfPower = Boolean(card && player.energy < effectivePowerCost);
            const isCardDisabled = isDisasterTargeted || isOutOfPower;

            // Swap validation
            let isSwapValidWithSource = true;
            let swapInvalidReason = '';
            if (activeSwapSlot && activeSwapSlot !== slot) {
              const checkSourceToTarget = canPlaceCardInSlot(board[activeSwapSlot], slot);
              const checkTargetToSource = canPlaceCardInSlot(card, activeSwapSlot);
              isSwapValidWithSource = checkSourceToTarget.valid && checkTargetToSource.valid;
              swapInvalidReason = checkSourceToTarget.reason || checkTargetToSource.reason || '此槽位限制條件不符';
            }

            // Inventory equip validation
            let isEquipValidWithInventory = true;
            let equipInvalidReason = '';
            if (activeInventoryCard) {
              const checkEquip = canPlaceCardInSlot(activeInventoryCard, slot);
              isEquipValidWithInventory = checkEquip.valid;
              equipInvalidReason = checkEquip.reason || '此槽位限制條件不符';
            }

            const slotBadgeColor = SLOT_BADGE_CLASS[slot];

            const cardName = card ? (card.translations[worldview]?.name || card.id) : null;
            const cardContent = card ? card.translations[worldview] : null;
            const rangeInfo = card ? (RANGE_META[card.range] || { label: card.range, fullLabel: card.range, desc: '' }) : null;

            const slotBorder = isSwapSource
              ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
              : isCardDisabled
              ? 'border-red-500/50 bg-red-950/25'
              : card && mediumInfo
              ? `${mediumInfo.borderColor} ${mediumInfo.bgColor}`
              : card
              ? 'border-slate-800 bg-slate-900/90'
              : 'border-dashed border-slate-800 bg-slate-950/40';

            return (
              <div
                key={slot}
                className={`pace-slot-card p-3 rounded-2xl border flex flex-col gap-2 transition-all shadow-sm ${slotBorder}`}
              >
                {/* Row 1: Slot Badges + Medium */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-lg font-black text-xs border shrink-0 ${slotBadgeColor}`}>
                      [{slot}] {SLOT_SHORT_LABEL[slot]}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 whitespace-nowrap ${
                        slot === 'C' || slot === 'E'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      }`}
                      title={`任務由此防線接手時，得分折算為滿額的 ${meta.revenueLabel.replace('收益 ', '')}`}
                    >
                      {meta.revenueLabel}
                    </span>
                    {slot === 'P' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 shrink-0 whitespace-nowrap" title="[P] 主要防線必須具備日常通訊能力，僅允許 Medium 語音級以上頻寬設備">
                        🔒 限中/高頻寬
                      </span>
                    )}
                    {mediumInfo && (
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border shrink-0 ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
                        {mediumInfo.icon} {mediumInfo.label}
                      </span>
                    )}
                  </div>

                  {!card && (
                    <span className="text-xs text-slate-500 font-bold shrink-0">
                      未配置
                    </span>
                  )}
                </div>

                {/* Row 2: Equipment Name + Status Indicator */}
                {card && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-slate-100">
                      {cardName}
                    </span>

                    {/* Status Indicator directly after equipment name */}
                    {isDisasterTargeted ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-bold shrink-0">
                        ❌ 天災阻斷 ({mediumInfo?.label}失效)
                      </span>
                    ) : isOutOfPower ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0">
                        ⚡ 缺電 ({player.energy}/{effectivePowerCost}⚡)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold shrink-0">
                        ✓ 暢通待命
                      </span>
                    )}
                  </div>
                )}

                {/* Tactical Description & Flavor Text */}
                {card && cardContent && (
                  <div className="flex flex-col gap-0.5 text-xs">
                    <p className="text-slate-300 leading-relaxed">
                      {cardContent.desc}
                    </p>
                    {cardContent.flavor && (
                      <p className="text-[11px] text-slate-400 italic">
                        "{cardContent.flavor}"
                      </p>
                    )}
                  </div>
                )}

                {/* Target Swap / Equip Action Buttons if selecting */}
                {activeSwapSlot && activeSwapSlot !== slot && (
                  <div className="pt-1">
                    {isSwapValidWithSource ? (
                      <button
                        onClick={() => handleSwapTarget(slot)}
                        className="w-full py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-md animate-pulse"
                      >
                        🔄 對調至 [{slot}] {SLOT_SHORT_LABEL[slot]} 槽位 {isAgile ? '(0 AP)' : '(1 AP)'}
                      </button>
                    ) : (
                      <div className="py-1.5 px-2 text-center text-xs text-red-400 font-bold bg-red-950/60 rounded-xl border border-red-500/30 leading-snug break-words">
                        🔒 {swapInvalidReason}
                      </div>
                    )}
                  </div>
                )}

                {activeInventoryCard && (
                  <div className="pt-1">
                    {isEquipValidWithInventory ? (
                      <button
                        onClick={() => handleEquipFromInv(slot)}
                        className="w-full py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition-all shadow-md animate-pulse"
                      >
                        📥 裝備至 [{slot}] {SLOT_SHORT_LABEL[slot]} 槽位 {isAgile ? '(0 AP)' : '(1 AP)'}
                      </button>
                    ) : (
                      <div className="py-1.5 px-2 text-center text-xs text-red-400 font-bold bg-red-950/60 rounded-xl border border-red-500/30 leading-snug break-words">
                        🔒 {equipInvalidReason}
                      </div>
                    )}
                  </div>
                )}

                {/* Row 2: Specs & Normal Actions */}
                {!activeSwapSlot && !activeInventoryCard && (
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/5 gap-2 flex-wrap">
                    {card ? (
                      <>
                        {/* Unified Specs Matrix (MAPS Pattern) */}
                        <EquipCardSpecs card={card} compact />

                        {/* Card Actions */}
                        {isCurrentPlayer && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-auto mt-1">
                            <button
                              data-tutorial={slot === 'P' ? 'slot-p' : undefined}
                              onClick={() => setActiveSwapSlot(isSwapSource ? null : slot)}
                              disabled={!canActionAP && !isSwapSource}
                              className={`px-2.5 py-1 rounded-lg font-bold border transition-all text-xs flex items-center gap-1 ${
                                isSwapSource
                                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                  : !canActionAP
                                  ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                              }`}
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
                              <span className="whitespace-nowrap">{isSwapSource ? '取消調換' : isAgile ? '調換順序 (0 AP)' : '調換順序 (1 AP)'}</span>
                            </button>

                            <button
                              onClick={() => onStoreCard(slot)}
                              className="px-2.5 py-1 rounded-lg font-bold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-slate-700 transition-all text-xs flex items-center gap-1 shrink-0 whitespace-nowrap"
                            >
                              <Archive className="w-3.5 h-3.5 shrink-0" />
                              <span className="whitespace-nowrap">卸下入庫 (0 AP)</span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-slate-500 text-[10px]">
                          {meta.subtitle}
                        </span>
                        {onGoToMarket && (
                          <button
                            onClick={onGoToMarket}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] transition-all ml-auto"
                          >
                            去市場選購 ➔
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Warehouse Section */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Archive className="w-4 h-4 text-amber-400" />
              <span>備用裝備倉庫 ({inventory.length})</span>
            </span>
            {activeInventoryCard && (
              <button
                onClick={() => setActiveInventoryCard(null)}
                className="text-[10px] text-slate-400 hover:text-slate-200 underline"
              >
                取消裝備
              </button>
            )}
          </div>

          {inventory.length > 0 ? (
            <div className="flex flex-col gap-2">
              {inventory.map((card) => {
                const isSelected = activeInventoryCard?.id === card.id;
                const isAgile = Boolean(player.activeBuffs?.agileProtocolActive);
                const canEquipAP = player.actionPoints > 0 || isAgile;
                const mediumInfo = getCommsCardMediumInfo(card);
                const rangeLabel = RANGE_META[card.range]?.label || card.range;

                return (
                  <div
                    key={card.id}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950/60 shadow-md shadow-purple-500/20'
                        : 'border-slate-800 bg-slate-900/80'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-bold text-slate-100 truncate text-xs">
                        {card.translations[worldview]?.name || card.id}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {mediumInfo?.label} · {rangeLabel} · {card.bandwidth} · {card.powerCost === 0 ? '0⚡免電' : `${card.powerCost}⚡`}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveInventoryCard(isSelected ? null : card)}
                      disabled={!canEquipAP && !isSelected}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isSelected
                          ? 'bg-purple-500 text-slate-950 font-black'
                          : !canEquipAP
                          ? 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                          : 'bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {isSelected ? '請點選槽位' : isAgile ? '裝上防線 (0 AP)' : '裝上防線 (1 AP)'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-[10px] text-slate-500">
              倉庫目前無備用設備。防線替換下來的裝備將暫存在此。
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. DESKTOP PANORAMIC VIEW (2x2 寬適網格 · 移植手機版排版優勢與心智模型)
  // =========================================================================
  return (
    <div
      data-tutorial="pace-board"
      className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md font-mono flex flex-col gap-2.5 transition-all relative text-xs h-full"
    >
      {/* Header with Diversity Metric */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm font-black text-slate-100 whitespace-nowrap">
            PACE 四重防線配置
          </span>
          <span className="text-[11px] text-slate-400 truncate hidden xl:inline">
            P ➔ A ➔ C ➔ E 依序 Fallback · 物理媒介互為備援
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 shrink-0 whitespace-nowrap ${
          uniqueMediaCount >= 3
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
            : uniqueMediaCount === 2
            ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
            : 'bg-red-950/80 border-red-500/40 text-red-300'
        }`}>
          {uniqueMediaCount >= 3 ? '✓' : '⚠️'} {uniqueMediaCount}/4 獨立媒介
        </span>
      </div>

      {/* Common Mode Failure Alert */}
      {hasCommonModeFailure && (
        <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] leading-snug flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">⚠️ 同類設備同時失靈警示：</span>
            [P] 與 [A] 槽皆為【{PHYSICAL_MEDIUM_META[pMedium!].label}】，一旦遭天災破壞前兩道防線將同時癱瘓！建議點擊「調換防線順序」錯開傳輸方式。
          </div>
        </div>
      )}

      {/* Active Swap Notice (Sticky) */}
      {activeSwapSlot && (
        <div className="sticky top-2 z-20 p-2.5 rounded-2xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs flex items-center justify-between gap-2 shadow-xl backdrop-blur-md animate-fadeIn">
          <span className="font-bold">
            🔄 正在調換 <b>[{activeSwapSlot}] {SLOT_SHORT_LABEL[activeSwapSlot]}</b> 防線，請點選要對調的目標槽位：
          </span>
          <button
            onClick={() => setActiveSwapSlot(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold shrink-0"
          >
            取消調換
          </button>
        </div>
      )}

      {/* Active Inventory Equip Notice (Sticky) */}
      {activeInventoryCard && (
        <div className="sticky top-2 z-20 p-2.5 rounded-2xl bg-purple-950/95 border border-purple-400 text-purple-200 text-xs flex items-center justify-between gap-2 shadow-xl backdrop-blur-md animate-fadeIn">
          <span className="font-bold">
            📥 正在從倉庫調配【{activeInventoryCard.translations[worldview]?.name}】，請點選目標槽位：
          </span>
          <button
            onClick={() => setActiveInventoryCard(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/40 text-xs font-bold shrink-0"
          >
            取消裝備
          </button>
        </div>
      )}

      {/* 2x2 Roomy Slots Grid (P/A 上排 · C/E 下排) */}
      <div className="grid grid-cols-2 gap-2.5">
        {slots.map((slot) => {
          const card = board[slot];
          const meta = slotMeta[slot];
          const mediumInfo = getCommsCardMediumInfo(card);
          const isSwapSource = activeSwapSlot === slot;
          const isAgile = Boolean(player.activeBuffs?.agileProtocolActive);
          const canActionAP = player.actionPoints > 0 || isAgile;

          // Disaster check
          const isEmpImmune = Boolean(card?.resilience.empShield || player.activeBuffs?.faradayEmpArmor);
          const isDisasterTargeted = Boolean(
            card && activeEvent && activeEvent.targetedMedia.includes(card.medium) && !(activeEvent.id === 'evt_emp_strike' && isEmpImmune)
          );

          // Power check
          const effectivePowerCost = (card?.powerCost || 0) + (activeEvent?.powerDrainBonus || 0);
          const isOutOfPower = Boolean(card && player.energy < effectivePowerCost);
          const isCardDisabled = isDisasterTargeted || isOutOfPower;

          // Swap validation (與手機版同步：不合法的目標槽位不可點擊並說明原因)
          let isSwapValidWithSource = true;
          let swapInvalidReason = '';
          if (activeSwapSlot && activeSwapSlot !== slot) {
            const checkSourceToTarget = canPlaceCardInSlot(board[activeSwapSlot], slot);
            const checkTargetToSource = canPlaceCardInSlot(card, activeSwapSlot);
            isSwapValidWithSource = checkSourceToTarget.valid && checkTargetToSource.valid;
            swapInvalidReason = checkSourceToTarget.reason || checkTargetToSource.reason || '此槽位限制條件不符';
          }

          // Inventory equip validation
          let isEquipValidWithInventory = true;
          let equipInvalidReason = '';
          if (activeInventoryCard) {
            const checkEquip = canPlaceCardInSlot(activeInventoryCard, slot);
            isEquipValidWithInventory = checkEquip.valid;
            equipInvalidReason = checkEquip.reason || '此槽位限制條件不符';
          }

          const slotBadgeColor = SLOT_BADGE_CLASS[slot];
          const cardName = card ? (card.translations[worldview]?.name || card.id) : null;
          const cardContent = card ? card.translations[worldview] : null;

          const isSwapTarget = Boolean(activeSwapSlot && activeSwapSlot !== slot);
          const isEquipTarget = Boolean(activeInventoryCard);
          const showActionArea = isSwapTarget || isEquipTarget || Boolean(card && isCurrentPlayer);

          const slotBorder = isSwapSource
            ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
            : isCardDisabled
            ? 'border-red-500/50 bg-red-950/25'
            : card && mediumInfo
            ? `${mediumInfo.borderColor} ${mediumInfo.bgColor}`
            : card
            ? 'border-slate-800 bg-slate-900/90'
            : 'border-dashed border-slate-800 bg-slate-950/40';

          return (
            <div
              key={slot}
              className={`pace-slot-card rounded-2xl border p-3 flex flex-col gap-2 transition-all shadow-sm min-h-[200px] ${slotBorder}`}
            >
              {/* Row 1: Slot Badges + Medium */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-lg font-black text-xs border shrink-0 ${slotBadgeColor}`}>
                    [{slot}] {SLOT_SHORT_LABEL[slot]}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 whitespace-nowrap ${
                      slot === 'C' || slot === 'E'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                    }`}
                    title={`任務由此防線接手時，得分折算為滿額的 ${meta.revenueLabel.replace('收益 ', '')}`}
                  >
                    {meta.revenueLabel}
                  </span>
                  {slot === 'P' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 shrink-0 whitespace-nowrap" title="[P] 主要防線必須具備日常通訊能力，僅允許 Medium 語音級以上頻寬設備">
                      🔒 限中/高頻寬
                    </span>
                  )}
                  {mediumInfo && (
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border shrink-0 whitespace-nowrap ${mediumInfo.bgColor} ${mediumInfo.borderColor} ${mediumInfo.color}`}>
                      {mediumInfo.icon} {mediumInfo.label}
                    </span>
                  )}
                </div>

                {!card && (
                  <span className="text-xs text-slate-500 font-bold shrink-0">
                    未配置
                  </span>
                )}
              </div>

              {/* Row 2: Equipment Name + Status Indicator */}
              {card && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-slate-100 break-words leading-tight" title={cardName || ''}>
                    {cardName}
                  </span>

                  {isDisasterTargeted ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-bold shrink-0 whitespace-nowrap animate-pulse">
                      ❌ 天災阻斷 ({mediumInfo?.label}失效)
                    </span>
                  ) : isOutOfPower ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0 whitespace-nowrap">
                      ⚡ 缺電 ({player.energy}/{effectivePowerCost}⚡)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold shrink-0 whitespace-nowrap">
                      ✓ 暢通待命
                    </span>
                  )}
                </div>
              )}

              {/* Tactical Description & Flavor Text */}
              {card && cardContent && (
                <div className="flex flex-col gap-0.5 text-xs">
                  <p className="text-slate-300 leading-relaxed break-words" title={cardContent.desc}>
                    {cardContent.desc}
                  </p>
                  {cardContent.flavor && (
                    <p className="text-[11px] text-slate-400 italic break-words leading-snug">
                      "{cardContent.flavor}"
                    </p>
                  )}
                </div>
              )}

              {/* Unified Specs Matrix (MAPS Pattern — 桌面版採用寬適版面) */}
              {card && <EquipCardSpecs card={card} />}

              {/* Empty Slot Guidance */}
              {!card && (
                <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 text-center">
                  <span className="text-xs text-slate-500 font-bold">📭 尚未配置通訊設備</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed max-w-[90%]">
                    {meta.roleDesc}
                  </span>
                  {isCurrentPlayer && onGoToMarket && !activeSwapSlot && !activeInventoryCard && (
                    <button
                      onClick={onGoToMarket}
                      className="mt-1 px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition-all active:scale-95"
                    >
                      去市場選購 ➔
                    </button>
                  )}
                </div>
              )}

              {/* Bottom Action Area */}
              {showActionArea && (
                <div className="mt-auto pt-2 border-t border-white/5">
                  {isSwapTarget ? (
                    isSwapValidWithSource ? (
                      <button
                        onClick={() => handleSwapTarget(slot)}
                        className="w-full py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-md animate-pulse"
                      >
                        🔄 對調至 [{slot}] {SLOT_SHORT_LABEL[slot]} 槽位 {isAgile ? '(0 AP)' : '(1 AP)'}
                      </button>
                    ) : (
                      <div className="py-2 px-2 text-center text-xs text-red-400 font-bold bg-red-950/60 rounded-xl border border-red-500/30 leading-snug break-words">
                        🔒 {swapInvalidReason}
                      </div>
                    )
                  ) : isEquipTarget ? (
                    isEquipValidWithInventory ? (
                      <button
                        onClick={() => handleEquipFromInv(slot)}
                        className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition-all shadow-md animate-pulse"
                      >
                        📥 裝備至 [{slot}] {SLOT_SHORT_LABEL[slot]} 槽位 {isAgile ? '(0 AP)' : '(1 AP)'}
                      </button>
                    ) : (
                      <div className="py-2 px-2 text-center text-xs text-red-400 font-bold bg-red-950/60 rounded-xl border border-red-500/30 leading-snug break-words">
                        🔒 {equipInvalidReason}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        data-tutorial={slot === 'P' ? 'slot-p' : undefined}
                        onClick={() => setActiveSwapSlot(isSwapSource ? null : slot)}
                        disabled={!canActionAP && !isSwapSource}
                        className={`flex-1 py-1.5 rounded-xl font-bold border transition-all text-xs flex items-center justify-center gap-1.5 ${
                          isSwapSource
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                            : !canActionAP
                            ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                        }`}
                        title={canActionAP ? (isAgile ? '調換防線順序 (0 AP)' : '調換防線順序 (1 AP)') : '行動點數 (AP) 不足'}
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">
                          {isSwapSource ? '取消調換' : isAgile ? '調換防線順序 (0 AP)' : '調換防線順序 (1 AP)'}
                        </span>
                      </button>

                      <button
                        onClick={() => onStoreCard(slot)}
                        className="flex-1 py-1.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-slate-700 transition-all text-xs flex items-center justify-center gap-1.5"
                        title="卸下此裝備存入備用倉庫（不消耗行動點數）"
                      >
                        <Archive className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">卸下入庫 (0 AP)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warehouse (Inventory) Panel at Bottom */}
      <div className="pt-2.5 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 min-w-0">
            <Archive className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">備用裝備倉庫 ({inventory.length})</span>
            <span className="text-[11px] font-normal text-slate-400 truncate hidden xl:inline">
              · 從防線卸下或被替換的裝備會安全暫存於此，可隨時重新裝上
            </span>
          </span>
          {activeInventoryCard && (
            <button
              onClick={() => setActiveInventoryCard(null)}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline shrink-0"
            >
              取消裝備
            </button>
          )}
        </div>

        {inventory.length > 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
            {inventory.map((item) => {
              const isSelected = activeInventoryCard?.id === item.id;
              const isAgile = Boolean(player.activeBuffs?.agileProtocolActive);
              const canEquipAP = player.actionPoints > 0 || isAgile;
              const itemName = item.translations[worldview]?.name || item.id;
              const medium = getCommsCardMediumInfo(item);
              const rangeLabel = RANGE_META[item.range]?.label || item.range;
              const bandwidthLabel = BANDWIDTH_META[item.bandwidth].compactLabel;

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
                    isSelected
                      ? 'border-purple-400 bg-purple-950/60 shadow-md shadow-purple-500/20 ring-1 ring-purple-400'
                      : 'border-slate-800 bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    {medium && (
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold border shrink-0 whitespace-nowrap ${medium.bgColor} ${medium.borderColor} ${medium.color}`}>
                        {medium.icon} {medium.label}
                      </span>
                    )}
                    <span className="font-bold text-xs text-slate-100 break-words leading-tight min-w-0">
                      {itemName}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 break-words leading-snug">
                    {rangeLabel} · {bandwidthLabel} · {item.powerCost === 0 ? '0⚡ 免電' : `${item.powerCost}⚡`}
                  </span>

                  <button
                    onClick={() => setActiveInventoryCard(isSelected ? null : item)}
                    disabled={!canEquipAP && !isSelected}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-purple-500 text-slate-950 font-black'
                        : !canEquipAP
                        ? 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                        : 'bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {isSelected ? '👆 請點選上方槽位' : isAgile ? '裝上防線 (0 AP)' : '裝上防線 (1 AP)'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-[11px] text-slate-500 leading-relaxed">
            倉庫目前無備用設備。從防線「卸下入庫」或採購時被替換下來的裝備，都會安全暫存在此。
          </div>
        )}
      </div>
    </div>
  );
}
