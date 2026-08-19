import React, { useState } from 'react';
import { CommsCard, PACESlot, Player, TacticCard } from '../../types/game';
import { EquipmentCardView } from '../Cards/EquipmentCardView';
import { TacticCardView } from '../Cards/TacticCardView';
import { ShoppingBag, Sparkles, Layers } from 'lucide-react';

interface MarketAreaProps {
  player: Player;
  market: CommsCard[];
  tacticMarket: TacticCard[];
  onBuyEquipment: (card: CommsCard, targetSlot?: PACESlot) => boolean;
  onBuyTactic: (card: TacticCard) => boolean;
  disabled?: boolean;
}

export const MarketArea: React.FC<MarketAreaProps> = ({
  player,
  market,
  tacticMarket,
  onBuyEquipment,
  onBuyTactic,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'tactics'>('equipment');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md">
      {/* Header Tabs */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'equipment'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>通訊裝備補給庫 ({market.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tactics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'tactics'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>戰術支援卡牌 ({tacticMarket.length})</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
          消耗 1 AP 與對應物資 💰 裝備或採購
        </span>
      </div>

      {/* Cards List */}
      {activeTab === 'equipment' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {market.map(card => {
            const canAfford = player.credits >= card.cost && player.actionPoints > 0;
            return (
              <EquipmentCardView
                key={card.id}
                card={card}
                canAfford={canAfford}
                disabled={disabled}
                onBuy={() => onBuyEquipment(card)}
              />
            );
          })}
          {market.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 font-mono text-xs">
              裝備牌庫已耗盡
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tacticMarket.map(card => {
            const canAfford = player.credits >= card.cost && player.actionPoints > 0;
            return (
              <TacticCardView
                key={card.id}
                card={card}
                canAfford={canAfford}
                disabled={disabled}
                onAction={() => onBuyTactic(card)}
              />
            );
          })}
          {tacticMarket.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 font-mono text-xs">
              戰術牌庫已耗盡
            </div>
          )}
        </div>
      )}
    </div>
  );
};
