import React, { useState } from 'react';
import { CommsCard, DisasterEvent, PACESlot, PhysicalMedium, Player, WorldviewType } from '../../types/game';
import { canPlaceCardInSlot } from '../../engine/rules';
import { UnifiedCommsCardContent, getCommsCardMediumInfo, PHYSICAL_MEDIUM_META } from '../Cards/UnifiedCommsCardView';
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
}

const slotMeta: Record<PACESlot, { title: string; subtitle: string; roleDesc: string; defaultColor: string }> = {
  P: {
    title: '[P] 主要防線 (Primary)',
    subtitle: '日常主流通訊 (需 High/Med 頻寬)',
    roleDesc: '平日優先啟動 · 處理大量數據與視訊 · 滿額 100% 收益 (限 High/Med)',
    defaultColor: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
  },
  A: {
    title: '[A] 備用防線 (Alternate)',
    subtitle: '標準替代通訊',
    roleDesc: '主要受阻時接手 · 功能相近但媒介應獨立 · 滿額 100% 收益',
    defaultColor: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
  },
  C: {
    title: '[C] 應急防線 (Contingency)',
    subtitle: '極端災難應變',
    roleDesc: '前兩道全毀時啟用 · 具備強韌抗性 · 降級獲得 70% 止血收益',
    defaultColor: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
  },
  E: {
    title: '[E] 緊急防線 (Emergency)',
    subtitle: '終極保命手段',
    roleDesc: '電磁與科技全滅時之物理/光學手段 · 降級獲得 50% 保命收益',
    defaultColor: 'border-red-500/40 bg-red-950/20 text-red-300',
  },
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

  return (
    <div
      data-tutorial="pace-board"
      className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-mono flex flex-col gap-4 transition-all relative"
    >
      {/* Header with Diversity Metric */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm sm:text-base font-bold text-slate-100">
            指揮官自組 PACE 四重防線 (Custom PACE Defense Board)
          </h2>
        </div>

        {/* Media Diversity Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">媒介多樣性指數:</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold border flex items-center gap-1.5 ${
            uniqueMediaCount >= 3
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : uniqueMediaCount === 2
              ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
              : 'bg-red-950/60 border-red-500/50 text-red-300'
          }`}>
            {uniqueMediaCount >= 3 ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            獨立媒介數: {uniqueMediaCount} / 4 類
          </span>
        </div>
      </div>

      {/* Common Mode Failure Alert Banner */}
      {hasCommonModeFailure && (
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs leading-relaxed animate-pulse">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-black">共因失效警示 (Common-Mode Vulnerability)：</span>
            你的 [P] 與 [A] 槽位皆依賴同種【{PHYSICAL_MEDIUM_META[pMedium!].label}】媒介！若遭遇對應天災，前兩道防線將同時癱瘓！可點擊下方「🔄 調換」隨時調配防線。
          </div>
        </div>
      )}

      {/* Active Swap Action Notice */}
      {activeSwapSlot && (
        <div className="p-3 rounded-2xl bg-cyan-950/70 border border-cyan-400 text-cyan-200 text-xs flex items-center justify-between animate-fadeIn">
          <span>
            🔄 正在調換 <b>[{activeSwapSlot}] 防線</b> 的裝備 {player.activeBuffs?.agileProtocolActive ? '(敏捷協議 0 AP)' : '(消耗 1 AP)'}，請點擊目標防線按鈕完成對調：
          </span>
          <button
            onClick={() => setActiveSwapSlot(null)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-bold"
          >
            取消調換
          </button>
        </div>
      )}

      {/* 4 PACE Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {slots.map((slot) => {
          const card = board[slot];
          const meta = slotMeta[slot];
          const mediumInfo = getCommsCardMediumInfo(card);
          const isSwapSource = activeSwapSlot === slot;
          const isAgile = Boolean(player.activeBuffs?.agileProtocolActive);
          const hasAP = player.actionPoints > 0 || isAgile;

          // 判斷當回合天災是否中斷此裝備
          const isEmpImmune = Boolean(card?.resilience.empShield || player.activeBuffs?.faradayEmpArmor);
          const isDisasterTargeted = Boolean(
            card && activeEvent && activeEvent.targetedMedia.includes(card.medium) && !(activeEvent.id === 'evt_emp_strike' && isEmpImmune)
          );

          // 判斷當前電量是否足夠啟動
          const effectivePowerCost = (card?.powerCost || 0) + (activeEvent?.powerDrainBonus || 0);
          const isOutOfPower = Boolean(card && player.energy < effectivePowerCost);

          const isCardDisabled = isDisasterTargeted || isOutOfPower;

          // 檢查調換合法性
          let isSwapValidWithSource = true;
          if (activeSwapSlot && activeSwapSlot !== slot) {
            const checkSourceToTarget = canPlaceCardInSlot(board[activeSwapSlot], slot);
            const checkTargetToSource = canPlaceCardInSlot(card, activeSwapSlot);
            isSwapValidWithSource = checkSourceToTarget.valid && checkTargetToSource.valid;
          }

          // 檢查倉庫裝備合法性
          let isEquipValidWithInventory = true;
          if (activeInventoryCard) {
            const checkEquip = canPlaceCardInSlot(activeInventoryCard, slot);
            isEquipValidWithInventory = checkEquip.valid;
          }

          return (
            <div
              key={slot}
              className={`pace-slot-card rounded-2xl border p-3.5 flex flex-col justify-between transition-all relative ${
                isSwapSource
                  ? 'border-cyan-400 bg-cyan-950/60 shadow-xl shadow-cyan-500/30'
                  : isCardDisabled
                  ? 'border-red-500/60 bg-red-950/30 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40'
                  : card
                  ? `${mediumInfo?.bgColor} ${mediumInfo?.borderColor} shadow-lg shadow-black/40`
                  : 'bg-slate-900/40 border-slate-800/80 border-dashed text-slate-500'
              }`}
            >
              {/* Slot Header */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-white/5">
                <div className="min-w-0">
                  <span className="text-xs font-black block text-slate-200">
                    {meta.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {meta.subtitle}
                  </span>
                </div>

                {/* Card Management Controls */}
                {card && isCurrentPlayer && (
                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    <button
                      data-tutorial={slot === 'P' ? 'slot-p' : undefined}
                      onClick={() => setActiveSwapSlot(isSwapSource ? null : slot)}
                      disabled={!hasAP && !isSwapSource}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                        isSwapSource
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : !hasAP
                          ? 'bg-slate-900/40 text-slate-500 border-slate-800 cursor-not-allowed opacity-50'
                          : 'bg-slate-900/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border-slate-700'
                      }`}
                      title={hasAP ? (isAgile ? "與其他防線對調順序 (敏捷協議 0 AP)" : "與其他防線對調順序 (消耗 1 AP 戰術調度)") : "行動點數不足 (需 1 AP)"}
                    >
                      <ArrowLeftRight className="w-3 h-3 shrink-0" />
                      <span className="whitespace-nowrap">{isSwapSource ? '選擇中' : isAgile ? '調換 0AP' : '調換 1AP'}</span>
                    </button>

                    <button
                      onClick={() => onStoreCard(slot)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700 transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
                      title="卸下此裝備存入備用倉庫 (0 AP，不刪除)"
                    >
                      <Archive className="w-3 h-3 shrink-0" />
                      <span className="whitespace-nowrap">收存</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Disaster Interruption Banner Badge */}
              {isDisasterTargeted && activeEvent && (
                <div className="slot-disaster-alert mb-2 p-1.5 rounded-xl bg-red-900/80 border border-red-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 animate-pulse shadow-md">
                  <XCircle className="w-4 h-4 text-red-300" />
                  <span>天災阻斷中：【{activeEvent.translations[worldview]?.title}】</span>
                </div>
              )}

              {/* Power Outage Warning Badge */}
              {!isDisasterTargeted && isOutOfPower && (
                <div className="slot-power-alert mb-2 p-1.5 rounded-xl bg-amber-900/80 border border-amber-500 text-amber-200 text-[11px] font-bold flex items-center justify-center gap-1.5">
                  <ZapOff className="w-4 h-4 text-amber-300" />
                  <span>電量不足（需 {effectivePowerCost}⚡ / 現有 {player.energy}⚡）</span>
                </div>
              )}

              {/* If Swap mode is active on another slot, offer this slot as target */}
              {activeSwapSlot && activeSwapSlot !== slot && (
                isSwapValidWithSource ? (
                  <div className="my-2 p-2 rounded-xl bg-cyan-950 border border-cyan-400 text-center animate-bounce">
                    <button
                      onClick={() => handleSwapTarget(slot)}
                      className="w-full py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all"
                    >
                      🔄 對調至 [{slot}] 防線 {isAgile ? '(0 AP)' : '(1 AP)'}
                    </button>
                  </div>
                ) : (
                  <div className="my-2 p-2 rounded-xl bg-red-950/80 border border-red-500/60 text-center">
                    <span className="text-[11px] font-bold text-red-300 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> [P] 槽限 High/Med 頻寬
                    </span>
                  </div>
                )
              )}

              {/* If Inventory Equip mode is active, offer this slot as target */}
              {activeInventoryCard && (
                isEquipValidWithInventory ? (
                  <div className="my-2 p-2 rounded-xl bg-purple-950 border border-purple-400 text-center animate-bounce">
                    <button
                      onClick={() => handleEquipFromInv(slot)}
                      className="w-full py-1.5 rounded-lg bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-xs transition-all"
                    >
                      📥 裝備至 [{slot}] 防線 {isAgile ? '(0 AP)' : '(1 AP)'}
                    </button>
                  </div>
                ) : (
                  <div className="my-2 p-2 rounded-xl bg-red-950/80 border border-red-500/60 text-center">
                    <span className="text-[11px] font-bold text-red-300 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> [P] 槽限 High/Med 頻寬
                    </span>
                  </div>
                )
              )}

              {/* Card Body or Empty Placeholder (MAPS Unified Layout) */}
              {card ? (
                <UnifiedCommsCardContent card={card} worldview={worldview} />
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                  <span className="text-2xl opacity-40">📭</span>
                  <span className="text-xs font-bold text-slate-400">
                    尚無裝備
                  </span>
                  <span className="text-[10px] text-slate-500 max-w-[180px]">
                    從市場採購或從備用倉庫調配裝備至此
                  </span>
                </div>
              )}

              {/* Slot Role Guide Footer */}
              <div className="pt-2 mt-2 border-t border-white/5 text-[9px] text-slate-400">
                {meta.roleDesc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Backup Equipment Inventory (備用裝備倉庫) */}
      {inventory.length > 0 && (
        <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Archive className="w-4 h-4 text-amber-400" /> 備用裝備倉庫 ({inventory.length} 件暫存工具，可隨時重新配置)
            </span>
            {activeInventoryCard && (
              <button
                onClick={() => setActiveInventoryCard(null)}
                className="text-[10px] text-slate-400 hover:text-slate-200"
              >
                取消裝備
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {inventory.map((card) => {
              const isSelected = activeInventoryCard?.id === card.id;
              const isAgile = Boolean(player.activeBuffs?.agileProtocolActive);
              const hasAP = player.actionPoints > 0 || isAgile;

              return (
                <div
                  key={card.id}
                  className={`p-3 rounded-2xl border flex flex-col justify-between gap-2.5 text-xs transition-all ${
                    isSelected
                      ? 'border-purple-400 bg-purple-950/60 shadow-lg shadow-purple-500/20'
                      : 'border-slate-800 bg-slate-900/90'
                  }`}
                >
                  <UnifiedCommsCardContent card={card} worldview={worldview} />

                  <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                    <button
                      onClick={() => setActiveInventoryCard(isSelected ? null : card)}
                      disabled={!hasAP && !isSelected}
                      className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-purple-500 text-slate-950 font-black'
                          : !hasAP
                          ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
                          : 'bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40'
                      }`}
                      title={hasAP ? (isAgile ? "從倉庫調配裝備至防線 (敏捷協議 0 AP)" : "從倉庫調配裝備至防線 (消耗 1 AP)") : "行動點數不足 (需 1 AP)"}
                    >
                      {isSelected ? '請選擇目標槽位' : isAgile ? '裝備 (0 AP)' : '裝備 (1 AP)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
