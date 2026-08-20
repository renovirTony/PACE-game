import React, { useState, useMemo, useEffect } from 'react';
import { 
  CommsCard, 
  TacticCard, 
  CrisisMission, 
  GlobalEvent, 
  PACESlot, 
  MissionUrgency,
  RangeType,
  BandwidthType
} from '../../types/game';
import { STARTER_PRIMARY_CARDS, EQUIPMENT_CARDS } from '../../data/equipmentCards';
import { TACTIC_CARDS } from '../../data/tacticCards';
import { CRISIS_MISSIONS } from '../../data/missionCards';
import { GLOBAL_EVENTS } from '../../data/eventCards';
import { IconRenderer } from '../Common/IconRenderer';
import { 
  X, 
  Search, 
  Radio, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Shield, 
  CloudLightning, 
  Activity, 
  Clock, 
  Filter
} from 'lucide-react';

interface CardCompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'ALL' | 'EQUIPMENT' | 'TACTIC' | 'MISSION' | 'EVENT';

const SLOT_THEMES: Record<PACESlot, { bg: string; text: string; border: string; label: string; badge: string }> = {
  P: { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-500/40', label: '主要 Primary', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  A: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-500/40', label: '備用 Alternate', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  C: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-500/40', label: '應急 Contingency', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  E: { bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-500/40', label: '緊急 Emergency', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
};

const RANGE_LABELS: Record<RangeType, string> = {
  Local: '近距 (Local)',
  Tactical: '戰術 (Tactical)',
  Global: '全球 (Global)',
  Penetrating: '穿透 (Penetrating)',
};

const BANDWIDTH_LABELS: Record<BandwidthType, { text: string; color: string }> = {
  High: { text: '高頻寬', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' },
  Medium: { text: '中頻寬', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
  Low: { text: '低頻寬', color: 'text-slate-300 bg-slate-900 border-slate-700' },
};

const URGENCY_THEMES: Record<MissionUrgency, { label: string; color: string; border: string; bg: string }> = {
  Low: { label: '低度緊急', color: 'text-slate-300', border: 'border-slate-700', bg: 'bg-slate-900/50' },
  Medium: { label: '中度緊迫', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/30' },
  High: { label: '高度危機', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40' },
  Critical: { label: '極度危急', color: 'text-red-400', border: 'border-red-500/50', bg: 'bg-red-950/50' },
};

export const CardCompendiumModal: React.FC<CardCompendiumModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<PACESlot | 'ALL'>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<MissionUrgency | 'ALL'>('ALL');

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Combine all equipment cards (starter + market)
  const allEquipmentCards = useMemo(() => {
    const map = new Map<string, CommsCard>();
    STARTER_PRIMARY_CARDS.forEach(c => map.set(c.id, c));
    EQUIPMENT_CARDS.forEach(c => map.set(c.id, c));
    return Array.from(map.values());
  }, []);

  // Filtered lists
  const filteredEquipments = useMemo(() => {
    return allEquipmentCards.filter(card => {
      if (selectedSlot !== 'ALL' && card.slot !== selectedSlot) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(q) ||
        card.effectDesc.toLowerCase().includes(q) ||
        card.flavorText.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q) ||
        card.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [allEquipmentCards, selectedSlot, searchQuery]);

  const filteredTactics = useMemo(() => {
    return TACTIC_CARDS.filter(card => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        card.flavorText.toLowerCase().includes(q) ||
        card.type.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const filteredMissions = useMemo(() => {
    return CRISIS_MISSIONS.filter(card => {
      if (selectedUrgency !== 'ALL' && card.urgency !== selectedUrgency) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q) ||
        card.flavor.toLowerCase().includes(q)
      );
    });
  }, [selectedUrgency, searchQuery]);

  const filteredEvents = useMemo(() => {
    return GLOBAL_EVENTS.filter(card => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        card.effectDescription.toLowerCase().includes(q) ||
        card.flavor.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const totalFilteredCount = 
    (activeTab === 'ALL' || activeTab === 'EQUIPMENT' ? filteredEquipments.length : 0) +
    (activeTab === 'ALL' || activeTab === 'TACTIC' ? filteredTactics.length : 0) +
    (activeTab === 'ALL' || activeTab === 'MISSION' ? filteredMissions.length : 0) +
    (activeTab === 'ALL' || activeTab === 'EVENT' ? filteredEvents.length : 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[90vh] rounded-3xl border border-cyan-500/40 bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Background Tactical Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black font-orbitron text-slate-100">
                  PACE <span className="text-cyan-400">戰術通訊全卡片圖鑑</span>
                </h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  Card Compendium · 共 {allEquipmentCards.length + TACTIC_CARDS.length + CRISIS_MISSIONS.length + GLOBAL_EVENTS.length} 張戰術卡牌
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                完整收錄通訊裝備、戰術支援、突發危機任務與全球環境事件數據
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800 transition-all active:scale-95"
            title="關閉圖鑑 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Search & Category Filter Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80 shrink-0">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>全部卡片 ({allEquipmentCards.length + TACTIC_CARDS.length + CRISIS_MISSIONS.length + GLOBAL_EVENTS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('EQUIPMENT')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'EQUIPMENT'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>通訊裝備 ({allEquipmentCards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('TACTIC')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'TACTIC'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>戰術支援 ({TACTIC_CARDS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('MISSION')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'MISSION'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>危機任務 ({CRISIS_MISSIONS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('EVENT')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'EVENT'
                  ? 'bg-red-500 text-slate-950 shadow-md shadow-red-500/20 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <CloudLightning className="w-3.5 h-3.5 text-red-400" />
              <span>環境事件 ({GLOBAL_EVENTS.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜尋卡片名稱、特性、關鍵字..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Sub-filter tags (When Equipment or Mission is selected) */}
        {(activeTab === 'EQUIPMENT' || activeTab === 'ALL') && (
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/40 text-xs font-mono shrink-0 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> PACE 槽位:
            </span>
            {(['ALL', 'P', 'A', 'C', 'E'] as const).map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedSlot === slot
                    ? slot === 'ALL'
                      ? 'bg-slate-200 text-slate-950'
                      : slot === 'P'
                      ? 'bg-cyan-500 text-slate-950'
                      : slot === 'A'
                      ? 'bg-blue-500 text-white'
                      : slot === 'C'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-red-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {slot === 'ALL' ? '全部槽位' : `[${slot}] ${SLOT_THEMES[slot].label}`}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'MISSION' && (
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/40 text-xs font-mono shrink-0 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> 緊急程度:
            </span>
            {(['ALL', 'Critical', 'High', 'Medium', 'Low'] as const).map(urgency => (
              <button
                key={urgency}
                onClick={() => setSelectedUrgency(urgency)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedUrgency === urgency
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {urgency === 'ALL' ? '全部層級' : URGENCY_THEMES[urgency].label}
              </button>
            ))}
          </div>
        )}

        {/* 4. Scrollable Card Content Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin">
          {totalFilteredCount === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 font-mono">
              <Search className="w-10 h-10 mb-2 opacity-40 text-cyan-400" />
              <p className="text-sm">沒有找到符合「{searchQuery}」條件的卡片</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedSlot('ALL'); setSelectedUrgency('ALL'); }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-400 hover:bg-slate-800"
              >
                重置搜尋條件
              </button>
            </div>
          ) : (
            <>
              {/* === SECTION 1: EQUIPMENT CARDS === */}
              {(activeTab === 'ALL' || activeTab === 'EQUIPMENT') && filteredEquipments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-bold font-mono text-cyan-300">
                        通訊裝備卡 ({filteredEquipments.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      組建 [P] 主要 / [A] 備用 / [C] 應急 / [E] 緊急 防線
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredEquipments.map(card => {
                      const theme = SLOT_THEMES[card.slot];
                      const bw = BANDWIDTH_LABELS[card.bandwidth];
                      return (
                        <div
                          key={card.id}
                          className={`rounded-2xl border ${theme.border} ${theme.bg} p-4 shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01]`}
                        >
                          <div>
                            {/* Card Header: Slot Tag & Cost */}
                            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${theme.badge}`}>
                                [{card.slot}] {theme.label}
                              </span>
                              <div className="flex items-center gap-2 font-mono text-xs">
                                <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                                  {card.cost === 0 ? '初始裝備' : `${card.cost} 💰`}
                                </span>
                                <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 font-bold">
                                  <Zap className="w-3 h-3" /> {card.powerCost} ⚡
                                </span>
                              </div>
                            </div>

                            {/* Title & Icon */}
                            <div className="flex items-start gap-3 mb-2.5">
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                                <IconRenderer name={card.iconName} className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-100 leading-snug">{card.name}</h4>
                                <span className="text-xs text-slate-400 font-mono block mt-0.5">{card.category}</span>
                              </div>
                            </div>

                            {/* Badges: Range & Bandwidth & Resilience */}
                            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap font-mono text-[11px]">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-750">
                                涵蓋: {RANGE_LABELS[card.range]}
                              </span>
                              <span className={`px-2 py-0.5 rounded border ${bw.color}`}>
                                {bw.text}
                              </span>
                              {card.bonusVP && card.bonusVP > 0 && (
                                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                                  +{card.bonusVP} VP 獎勵
                                </span>
                              )}
                            </div>

                            {/* Resistance Indicators */}
                            <div className="flex items-center gap-1 mb-2.5 flex-wrap text-[11px] font-mono">
                              {card.resilience.empShield && (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                  <Shield className="w-3 h-3" /> 抗 EMP
                                </span>
                              )}
                              {card.resilience.weatherResistant && (
                                <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                                  <Activity className="w-3 h-3" /> 抗極端天候
                                </span>
                              )}
                              {card.resilience.subterranean && (
                                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                  <Layers className="w-3 h-3" /> 穿透/地底
                                </span>
                              )}
                            </div>

                            {/* Effect Description */}
                            <p className="text-xs text-slate-200 leading-relaxed mb-2.5 bg-black/40 p-2.5 rounded-xl border border-white/5 font-sans">
                              {card.effectDesc}
                            </p>

                            {/* Flavor Text */}
                            {card.flavorText && (
                              <p className="text-[11px] text-slate-400 italic font-sans mb-2 pl-1">
                                "{card.flavorText}"
                              </p>
                            )}
                          </div>

                          {/* Tags */}
                          {card.tags.length > 0 && (
                            <div className="flex items-center gap-1 pt-2 border-t border-white/5 flex-wrap font-mono text-[10px] text-slate-400">
                              {card.tags.map(t => (
                                <span key={t} className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* === SECTION 2: TACTIC CARDS === */}
              {(activeTab === 'ALL' || activeTab === 'TACTIC') && filteredTactics.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold font-mono text-purple-300">
                        戰術支援卡 ({filteredTactics.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      即時發動扭轉戰局 · 發電機、補給空投與頻譜超頻
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredTactics.map(card => (
                      <div
                        key={card.id}
                        className="rounded-2xl border border-purple-500/40 bg-purple-950/30 p-4 shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                              戰術手牌 · {card.type}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/30">
                              購買需 {card.cost} 💰
                            </span>
                          </div>

                          <div className="flex items-start gap-3 mb-2.5">
                            <div className="p-2 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-300 shrink-0">
                              <IconRenderer name={card.iconName} className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-100 leading-snug">{card.name}</h4>
                              <span className="text-xs text-purple-300/80 font-mono block mt-0.5">發動消耗: 1 AP</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed mb-2.5 bg-black/40 p-2.5 rounded-xl border border-white/5 font-sans">
                            {card.description}
                          </p>

                          {card.flavorText && (
                            <p className="text-[11px] text-purple-300/80 italic font-sans pl-1">
                              "{card.flavorText}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === SECTION 3: CRISIS MISSIONS === */}
              {(activeTab === 'ALL' || activeTab === 'MISSION') && filteredMissions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold font-mono text-amber-300">
                        突發危機任務卡 ({filteredMissions.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      廣播通訊驗證目標 · 獲取勝利積分 (VP) 與物資獎勵
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredMissions.map(mission => {
                      const urgency = URGENCY_THEMES[mission.urgency];
                      return (
                        <div
                          key={mission.id}
                          className={`rounded-2xl border ${urgency.border} ${urgency.bg} p-4 shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01]`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${urgency.border} ${urgency.color}`}>
                                {urgency.label}
                              </span>
                              <div className="flex items-center gap-2 font-mono text-xs">
                                <span className="text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                                  +{mission.vp} VP
                                </span>
                                <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                                  +{mission.creditReward} 💰
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 mb-2.5">
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
                                <IconRenderer name={mission.iconName} className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-100 leading-snug">{mission.title}</h4>
                              </div>
                            </div>

                            {/* Requirements */}
                            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap font-mono text-[11px]">
                              {mission.requiredRange && (
                                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-750">
                                  需求涵蓋: {mission.requiredRange.join(' / ')}
                                </span>
                              )}
                              {mission.requiredBandwidth && (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                                  頻寬需求: {mission.requiredBandwidth}
                                </span>
                              )}
                              {mission.requiresWeatherResist && (
                                <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                                  需抗天候
                                </span>
                              )}
                              {mission.requiresEmpShield && (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                                  需抗 EMP
                                </span>
                              )}
                              {mission.requiresSubterranean && (
                                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
                                  需穿透/有線
                                </span>
                              )}
                              {mission.restrictedSlots && mission.restrictedSlots.length > 0 && (
                                <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40 font-bold">
                                  禁制槽位: [{mission.restrictedSlots.join(', ')}]
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed mb-2.5 bg-black/40 p-2.5 rounded-xl border border-white/5 font-sans">
                              {mission.description}
                            </p>

                            {mission.flavor && (
                              <p className="text-[11px] text-amber-200/70 italic font-sans pl-1">
                                "{mission.flavor}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* === SECTION 4: GLOBAL EVENTS === */}
              {(activeTab === 'ALL' || activeTab === 'EVENT') && filteredEvents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <CloudLightning className="w-4 h-4 text-red-400" />
                      <h3 className="text-sm font-bold font-mono text-red-300">
                        全球環境事件卡 ({filteredEvents.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      大氣環境干擾 · 每輪更迭，考驗防線備援韌性
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredEvents.map(event => (
                      <div
                        key={event.id}
                        className="rounded-2xl border border-red-500/40 bg-red-950/30 p-4 shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                              環境危機事件
                            </span>
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> 持續 {event.duration} 回合
                            </span>
                          </div>

                          <div className="flex items-start gap-3 mb-2.5">
                            <div className="p-2 rounded-xl bg-red-900/60 border border-red-500/40 text-red-300 shrink-0">
                              <IconRenderer name={event.iconName} className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-100 leading-snug">{event.title}</h4>
                            </div>
                          </div>

                          {/* Impact Badges */}
                          <div className="flex items-center gap-1.5 mb-2.5 flex-wrap font-mono text-[11px]">
                            {event.jammedSlots && event.jammedSlots.length > 0 && (
                              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/50 font-bold">
                                癱瘓槽位: [{event.jammedSlots.join(', ')}]
                              </span>
                            )}
                            {event.blockedCategories && event.blockedCategories.length > 0 && (
                              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/50 font-bold">
                                阻斷類別: {event.blockedCategories.join(' / ')}
                              </span>
                            )}
                            {event.powerDrainBonus && event.powerDrainBonus > 0 && (
                              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-bold">
                                額外耗電 +{event.powerDrainBonus} ⚡
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed mb-2.5 bg-black/40 p-2.5 rounded-xl border border-white/5 font-sans">
                            {event.effectDescription}
                          </p>

                          {event.flavor && (
                            <p className="text-[11px] text-red-200/70 italic font-sans pl-1">
                              "{event.flavor}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 5. Modal Footer */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <span>💡 提示：點擊右上角 X 或按 ESC 鍵可隨時關閉圖鑑返回戰局</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 transition-all"
          >
            關閉圖鑑
          </button>
        </div>
      </div>
    </div>
  );
};
