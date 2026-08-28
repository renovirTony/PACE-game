import React, { useState } from 'react';
import { CommsCard, DisasterEvent, PACESlot, PhysicalMedium, Player, TacticCard, WorldviewType } from '../../types/game';
import { ShoppingBag, Zap, Coins, Plus, Check, AlertTriangle, XCircle } from 'lucide-react';

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

const mediumNames: Record<PhysicalMedium, { label: string; icon: string; color: string }> = {
  Cellular: { label: '公眾網', icon: '🏙️', color: 'text-cyan-400' },
  Satellite: { label: '衛星', icon: '🛰️', color: 'text-blue-400' },
  Radio: { label: '無線電', icon: '📻', color: 'text-amber-400' },
  Wired: { label: '實體線', icon: '🔌', color: 'text-emerald-400' },
  PhysicalOptical: { label: '人力/光學', icon: '🏃', color: 'text-purple-400' },
};

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
            const content = card.translations[worldview];
            const mediumInfo = mediumNames[card.medium];
            const canAfford = player.credits >= card.cost && player.actionPoints >= 1;
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
                {/* Top Badge: Medium & Cost */}
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold border border-white/10 bg-black/40 ${mediumInfo.color}`}>
                    {mediumInfo.icon} {mediumInfo.label}
                  </span>
                  <span className="font-bold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                    💰 {card.cost} 物資
                  </span>
                </div>

                {/* Disaster Target Alert */}
                {isDisasterTargeted && (
                  <div className="p-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                    <span>當前天災中斷此媒介</span>
                  </div>
                )}

                {/* Name & Desc */}
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-100 leading-snug">
                    {content?.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {content?.desc}
                  </p>
                </div>

                {/* Attributes */}
                <div className="grid grid-cols-3 gap-1 text-[9px] text-center border-t border-white/5 pt-1.5 text-slate-400">
                  <div>頻寬: <span className="font-bold text-slate-200">{card.bandwidth}</span></div>
                  <div>距離: <span className="font-bold text-slate-200 truncate">{card.range}</span></div>
                  <div>耗電: <span className="font-bold text-amber-300">{card.powerCost}⚡</span></div>
                </div>

                {/* Slot Choice Action */}
                {isSelected ? (
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-cyan-500/30 animate-fadeIn">
                    <span className="text-[10px] text-cyan-300 text-center font-bold">
                      請選擇放入哪個槽位：
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {(['P', 'A', 'C', 'E'] as PACESlot[]).map((slot) => {
                        const hasOldCard = Boolean(player.paceBoard[slot]);
                        return (
                          <button
                            key={slot}
                            onClick={() => handleSlotSelect(slot)}
                            className={`py-1.5 rounded-lg font-black text-xs transition-all active:scale-95 flex flex-col items-center justify-center ${
                              hasOldCard
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                            }`}
                            title={hasOldCard ? `放入 [${slot}] (原裝備將移至備用倉庫)` : `放入 [${slot}] 空槽`}
                          >
                            <span>[{slot}]</span>
                            <span className="text-[9px] font-normal opacity-80">
                              {hasOldCard ? '置換收存' : '空槽'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[9px] text-slate-400 text-center mt-0.5">
                      💡 若槽位已有裝備，原裝備會自動安全移至【備用裝備倉庫】
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
                        ? 'bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-slate-200 border border-slate-700'
                        : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>採購裝備 (1 AP)</span>
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
            const canAfford = player.credits >= tactic.cost && player.actionPoints >= 1;

            return (
              <div
                key={tactic.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 flex flex-col justify-between gap-2"
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
                      ? 'bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 border border-slate-700'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  購入戰術卡 (1 AP)
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
