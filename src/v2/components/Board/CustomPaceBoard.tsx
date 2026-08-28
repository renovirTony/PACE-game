import React, { useState } from 'react';
import { CommsCard, DisasterEvent, PACESlot, PhysicalMedium, Player, WorldviewType } from '../../types/game';
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
  XCircle
} from 'lucide-react';

interface CustomPaceBoardProps {
  player: Player;
  activeEvent: DisasterEvent | null;
  isCurrentPlayer: boolean;
  worldview: WorldviewType;
  onSwapSlots: (slotA: PACESlot, slotB: PACESlot) => void;
  onStoreCard: (slot: PACESlot) => void;
  onEquipFromInventory: (card: CommsCard, targetSlot: PACESlot) => void;
  onDiscardFromInventory?: (cardId: string) => void;
}

const mediumMeta: Record<PhysicalMedium, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  Cellular: {
    label: '公眾網/基地台',
    icon: '🏙️',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
  },
  Satellite: {
    label: '衛星通訊',
    icon: '🛰️',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/40',
  },
  Radio: {
    label: '無線電波',
    icon: '📻',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
  },
  Wired: {
    label: '實體有線',
    icon: '🔌',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40',
  },
  PhysicalOptical: {
    label: '人力/光學/聲波',
    icon: '🏃',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/40',
  },
};

const slotMeta: Record<PACESlot, { title: string; subtitle: string; roleDesc: string; defaultColor: string }> = {
  P: {
    title: '[P] 主要防線 (Primary)',
    subtitle: '日常高頻寬通訊',
    roleDesc: '平日優先啟動 · 處理大量數據與視訊 · 滿額 100% 收益',
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

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl backdrop-blur-md font-mono flex flex-col gap-4">
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
            你的 [P] 與 [A] 槽位皆依賴同種【{mediumMeta[pMedium!].label}】媒介！若遭遇對應天災（如大停電或暴風雨），前兩道防線將同時癱瘓！可點擊下方「🔄 調換」隨時調配裝備。
          </div>
        </div>
      )}

      {/* Active Swap Action Notice */}
      {activeSwapSlot && (
        <div className="p-3 rounded-2xl bg-cyan-950/70 border border-cyan-400 text-cyan-200 text-xs flex items-center justify-between animate-fadeIn">
          <span>
            🔄 正在調換 <b>[{activeSwapSlot}] 防線</b> 的裝備，請點擊目標防線按鈕完成對調：
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
          const cardContent = card ? card.translations[worldview] : null;
          const mediumInfo = card ? mediumMeta[card.medium] : null;
          const isSwapSource = activeSwapSlot === slot;

          // 判斷當回合天災是否中斷此裝備
          const isEmpImmune = Boolean(card?.resilience.empShield || player.activeBuffs?.faradayEmpArmor);
          const isDisasterTargeted = Boolean(
            card && activeEvent && activeEvent.targetedMedia.includes(card.medium) && !(activeEvent.id === 'evt_emp_strike' && isEmpImmune)
          );

          // 判斷當前電量是否足夠啟動
          const effectivePowerCost = card ? card.powerCost + (activeEvent?.powerDrainBonus || 0) : 0;
          const isOutOfPower = Boolean(card && player.energy < effectivePowerCost);

          const isCardDisabled = isDisasterTargeted || isOutOfPower;

          return (
            <div
              key={slot}
              className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all relative ${
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
              <div className="flex items-center justify-between gap-1 pb-2 mb-2 border-b border-white/5">
                <div>
                  <span className="text-xs font-black block text-slate-200">
                    {meta.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {meta.subtitle}
                  </span>
                </div>

                {/* Card Management Controls */}
                {card && isCurrentPlayer && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveSwapSlot(isSwapSource ? null : slot)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                        isSwapSource
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-900/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border-slate-700'
                      }`}
                      title="與其他防線對調順序 (0 AP)"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>{isSwapSource ? '選擇中' : '調換'}</span>
                    </button>

                    <button
                      onClick={() => onStoreCard(slot)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700 transition-all flex items-center gap-1"
                      title="卸下此裝備存入備用倉庫 (不刪除)"
                    >
                      <Archive className="w-3 h-3" />
                      <span>收存</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Disaster Interruption Banner Badge */}
              {isDisasterTargeted && activeEvent && (
                <div className="mb-2 p-1.5 rounded-xl bg-red-900/80 border border-red-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 animate-pulse shadow-md">
                  <XCircle className="w-4 h-4 text-red-300" />
                  <span>天災阻斷中：【{activeEvent.translations[worldview]?.title}】</span>
                </div>
              )}

              {/* Power Outage Warning Badge */}
              {!isDisasterTargeted && isOutOfPower && (
                <div className="mb-2 p-1.5 rounded-xl bg-amber-900/80 border border-amber-500 text-amber-200 text-[11px] font-bold flex items-center justify-center gap-1.5">
                  <ZapOff className="w-4 h-4 text-amber-300" />
                  <span>電量不足（需 {effectivePowerCost}⚡ / 現有 {player.energy}⚡）</span>
                </div>
              )}

              {/* If Swap mode is active on another slot, offer this slot as target */}
              {activeSwapSlot && activeSwapSlot !== slot && (
                <div className="my-2 p-2 rounded-xl bg-cyan-950 border border-cyan-400 text-center animate-bounce">
                  <button
                    onClick={() => handleSwapTarget(slot)}
                    className="w-full py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all"
                  >
                    🔄 對調至 [{slot}] 防線
                  </button>
                </div>
              )}

              {/* If Inventory Equip mode is active, offer this slot as target */}
              {activeInventoryCard && (
                <div className="my-2 p-2 rounded-xl bg-purple-950 border border-purple-400 text-center animate-bounce">
                  <button
                    onClick={() => handleEquipFromInv(slot)}
                    className="w-full py-1.5 rounded-lg bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-xs transition-all"
                  >
                    📥 裝備至 [{slot}] 防線
                  </button>
                </div>
              )}

              {/* Card Body or Empty Placeholder */}
              {card && cardContent ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-black text-slate-100 leading-snug">
                      {cardContent.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${mediumInfo?.bgColor} ${mediumInfo?.borderColor} ${mediumInfo?.color}`}>
                      {mediumInfo?.icon} {mediumInfo?.label}
                    </span>
                  </div>

                  {/* Clean readable text without aggressive clamping */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cardContent.desc}
                  </p>

                  {/* Technical Specs Attributes Matrix */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[10px]">
                    <div className="p-1.5 rounded-lg bg-black/40 text-center">
                      <span className="text-slate-500 block text-[9px]">頻寬門檻</span>
                      <span className={`font-black ${
                        card.bandwidth === 'High' ? 'text-cyan-400' : card.bandwidth === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {card.bandwidth}
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-black/40 text-center">
                      <span className="text-slate-500 block text-[9px]">通訊距離</span>
                      <span className="font-bold text-slate-200 truncate block">
                        {card.range}
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-black/40 text-center">
                      <span className="text-slate-500 block text-[9px]">運作耗電</span>
                      <span className="font-bold text-amber-300">
                        {card.powerCost}⚡
                      </span>
                    </div>
                  </div>

                  {/* Resilience Badges */}
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 flex-wrap pt-0.5">
                    {card.resilience.empShield && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 font-bold">
                        🛡️ 抗EMP
                      </span>
                    )}
                    {card.resilience.weatherResistant && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                        🌧️ 耐天候
                      </span>
                    )}
                    {card.resilience.subterranean && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                        🕳️ 地底穿透
                      </span>
                    )}
                    {card.tags && card.tags.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-black/30 text-slate-400 border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {inventory.map((card) => {
              const content = card.translations[worldview];
              const mediumInfo = mediumMeta[card.medium];
              const isSelected = activeInventoryCard?.id === card.id;

              return (
                <div
                  key={card.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                    isSelected
                      ? 'border-purple-400 bg-purple-950/60 shadow-md'
                      : 'border-slate-800 bg-slate-900/90'
                  }`}
                >
                  <div className="flex flex-col truncate">
                    <span className="font-bold text-slate-200 truncate">
                      {content?.name}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      {mediumInfo.icon} {mediumInfo.label} · {card.bandwidth}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setActiveInventoryCard(isSelected ? null : card)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-purple-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-purple-950 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {isSelected ? '選擇槽位' : '裝備'}
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
