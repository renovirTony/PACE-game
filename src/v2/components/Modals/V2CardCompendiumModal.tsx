import React, { useState } from 'react';
import { CommsCard, CrisisMission, DisasterEvent, PhysicalMedium, TacticCard, WorldviewType } from '../../types/game';
import { V2_EQUIPMENT_CARDS, V2_STARTER_CARDS } from '../../data/equipmentCards';
import { V2_DISASTER_EVENTS } from '../../data/disasterEvents';
import { V2_CRISIS_MISSIONS } from '../../data/crisisMissions';
import { V2_TACTIC_CARDS } from '../../data/tacticCards';
import { UnifiedCommsCardContent } from '../Cards/UnifiedCommsCardView';
import { Layers, Shield, Radio, Sparkles, CloudRain, Package, X, Globe, Sun, ZapOff, Cable } from 'lucide-react';

interface V2CardCompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  worldview: WorldviewType;
}

type TabType = 'equipment' | 'events' | 'missions' | 'tactics';

export function V2CardCompendiumModal({
  isOpen,
  onClose,
  worldview: initialWorldview,
}: V2CardCompendiumModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('equipment');
  const [modalWorldview, setModalWorldview] = useState<WorldviewType>(initialWorldview);
  const [selectedMediumFilter, setSelectedMediumFilter] = useState<PhysicalMedium | 'ALL'>('ALL');

  if (!isOpen) return null;

  const allEquipments = [...V2_STARTER_CARDS, ...V2_EQUIPMENT_CARDS];
  const filteredEquipments = selectedMediumFilter === 'ALL'
    ? allEquipments
    : allEquipments.filter(c => c.medium === selectedMediumFilter);

  const mediumLabels: Record<PhysicalMedium, { label: string; icon: string }> = {
    Cellular: { label: '公眾網/基地台', icon: '🏙️' },
    Satellite: { label: '衛星通訊', icon: '🛰️' },
    Radio: { label: '無線電波', icon: '📻' },
    Wired: { label: '實體有線', icon: '🔌' },
    PhysicalOptical: { label: '人力/光學/聲波', icon: '🏃' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 shadow-2xl flex flex-col gap-4 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-100">
                PACE 通訊先鋒 · 全卡牌圖鑑 (Card Compendium)
              </h3>
              <p className="text-xs text-slate-400">
                完整檢閱 5 大物理媒介裝備、極端天災、危機任務與戰術卡
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Worldview Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'equipment' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> 裝備工具 ({allEquipments.length})
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'events' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" /> 物理天災 ({V2_DISASTER_EVENTS.length})
            </button>

            <button
              onClick={() => setActiveTab('missions')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'missions' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> 危機任務 ({V2_CRISIS_MISSIONS.length})
            </button>

            <button
              onClick={() => setActiveTab('tactics')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tactics' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> 戰術應急 ({V2_TACTIC_CARDS.length})
            </button>
          </div>

          {/* Worldview Toggle inside Modal */}
          <div className="flex items-center gap-1 text-xs bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <span className="text-slate-400 text-[10px] px-1">世界觀:</span>
            {(['CivilDefense', 'IslandResilience', 'CyberDisconnect'] as WorldviewType[]).map((wv) => (
              <button
                key={wv}
                onClick={() => setModalWorldview(wv)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  modalWorldview === wv ? 'bg-purple-950 text-purple-300 border border-purple-500/50' : 'text-slate-400'
                }`}
              >
                {wv === 'CivilDefense' ? '🏠 民防' : wv === 'IslandResilience' ? '🌊 海島' : '⚡ 廢土'}
              </button>
            ))}
          </div>
        </div>

        {/* Medium Sub-filter for Equipments */}
        {activeTab === 'equipment' && (
          <div className="flex items-center gap-1.5 text-xs flex-wrap pb-1 shrink-0">
            <span className="text-slate-400 text-[11px]">媒介篩選:</span>
            <button
              onClick={() => setSelectedMediumFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] transition-all ${
                selectedMediumFilter === 'ALL'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              全部 ({allEquipments.length})
            </button>
            {(Object.keys(mediumLabels) as PhysicalMedium[]).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMediumFilter(m)}
                className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] transition-all ${
                  selectedMediumFilter === m
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {mediumLabels[m].icon} {mediumLabels[m].label}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredEquipments.map((card) => (
                <div
                  key={card.id}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-2.5 hover:border-slate-700 transition-all"
                >
                  <UnifiedCommsCardContent
                    card={card}
                    worldview={modalWorldview}
                    showFlavor={true}
                    headerRightBadge={
                      <span className="font-bold text-emerald-300 text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                        💰 {card.cost} 物資
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {V2_DISASTER_EVENTS.map((event) => {
                const content = event.translations[modalWorldview];
                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-2xl border border-red-500/30 bg-red-950/20 flex flex-col justify-between gap-2.5"
                  >
                    <h4 className="text-sm font-black text-red-300 flex items-center gap-1.5">
                      🌪️ {content?.title}
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {content?.desc}
                    </p>
                    <p className="text-[10px] text-slate-400 italic">
                      "{content?.flavor}"
                    </p>
                    {event.targetedMedia.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold pt-1.5 border-t border-white/5 flex-wrap">
                        <span>直接阻斷媒介：</span>
                        {event.targetedMedia.map((m) => (
                          <span key={m} className="px-1.5 py-0.5 rounded bg-red-950 border border-red-500/40">
                            {mediumLabels[m].icon} {mediumLabels[m].label}
                          </span>
                        ))}
                      </div>
                    )}
                    {event.powerDrainBonus && (
                      <div className="text-[10px] text-amber-300 font-bold">
                        ⚡ 全場所有需電設備耗電增加 +{event.powerDrainBonus} 點
                      </div>
                    )}
                    {event.rangePenalty && (
                      <div className="text-[10px] text-blue-300 font-bold">
                        🌧️ 暴風濃霧降低光學設備之通訊距離至 Local
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Missions Tab */}
          {activeTab === 'missions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {V2_CRISIS_MISSIONS.map((mission) => {
                const content = mission.translations[modalWorldview];
                return (
                  <div
                    key={mission.id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        mission.requiredBandwidth === 'High'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : mission.requiredBandwidth === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        需 {mission.requiredBandwidth} 頻寬
                      </span>

                      <div className="flex items-center gap-2 font-bold text-xs">
                        <span className="text-purple-300">🏆 {mission.vpReward} 分</span>
                        <span className="text-emerald-300">💰 {mission.creditReward} 物資</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-100">
                      {content?.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {content?.desc}
                    </p>

                    {/* Mission Physical Requirements */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 flex-wrap pt-1 border-t border-white/5">
                      <span>距離: {mission.requiredRange.join('/')}</span>
                      {mission.requiresWeatherResist && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                          🌧️ 耐天候
                        </span>
                      )}
                      {mission.requiresSubterranean && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                          🕳️ 地底穿透
                        </span>
                      )}
                      {mission.requiresEmpShield && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-bold">
                          🛡️ 需抗EMP
                        </span>
                      )}
                      {mission.requiresOptical && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
                          🔦 光學限定
                        </span>
                      )}
                      {mission.requiresWired && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                          🔌 實體有線
                        </span>
                      )}
                    </div>

                    {content?.expertTip && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 text-[11px] text-cyan-300 leading-relaxed">
                        💡 <b>通訊專家解析：</b>{content.expertTip}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tactics Tab */}
          {activeTab === 'tactics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {V2_TACTIC_CARDS.map((tactic) => {
                const content = tactic.translations[modalWorldview];
                return (
                  <div
                    key={tactic.id}
                    className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="text-sm font-black text-purple-300">
                        {content?.name}
                      </h4>
                      <span className="font-bold text-emerald-300">💰 {tactic.cost} 物資</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {content?.desc}
                    </p>

                    <p className="text-[10px] text-slate-400 italic">
                      "{content?.flavor}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
