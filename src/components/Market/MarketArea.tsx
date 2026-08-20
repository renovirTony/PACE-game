import React, { useState } from 'react';
import { CommsCard, PACESlot, Player, TacticCard } from '../../types/game';
import { EquipmentCardView } from '../Cards/EquipmentCardView';
import { TacticCardView } from '../Cards/TacticCardView';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface MarketAreaProps {
  player: Player;
  market: CommsCard[];
  tacticMarket: TacticCard[];
  onBuyEquipment: (card: CommsCard, targetSlot?: PACESlot) => boolean;
  onBuyTactic: (card: TacticCard) => boolean;
  disabled?: boolean;
  tutorialHighlightSlot?: PACESlot;
}

export const MarketArea: React.FC<MarketAreaProps> = ({
  player,
  market,
  tacticMarket,
  onBuyEquipment,
  onBuyTactic,
  disabled = false,
  tutorialHighlightSlot,
}) => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'tactics'>('equipment');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
              activeTab === 'equipment'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>通訊裝備補給庫 ({market.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tactics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
              activeTab === 'tactics'
                ? 'bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>戰術支援卡牌 ({tacticMarket.length})</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400">
          消耗 1 AP 與對應物資 💰 採購裝備或戰術
        </span>
      </div>

      {/* Cards List */}
      {activeTab === 'equipment' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {market.map(card => {
            const canAfford = player.credits >= card.cost && player.actionPoints > 0;
            const isHighlighted = tutorialHighlightSlot === card.slot;

            return (
              <EquipmentCardView
                key={card.id}
                card={card}
                canAfford={canAfford}
                disabled={disabled}
                highlight={isHighlighted}
                onBuy={() => onBuyEquipment(card)}
              />
            );
          })}
          {market.length === 0 && (
            <div className="col-span-full py-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center text-slate-500 font-mono text-sm">
              裝備補給庫已暫時耗盡
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
            <div className="col-span-full py-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center text-slate-500 font-mono text-sm">
              戰術卡牌庫已暫時耗盡
            </div>
          )}
        </div>
      )}
    </div>
  );
};
