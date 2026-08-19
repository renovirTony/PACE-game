import React from 'react';
import { PACESlot, Player } from '../../types/game';
import { EquipmentCardView } from '../Cards/EquipmentCardView';
import { ArrowRight, ShieldCheck, Zap, Radio, Phone, Satellite, AlertCircle } from 'lucide-react';

interface PACEBoardProps {
  player: Player;
  isCurrentPlayer: boolean;
}

const SLOT_DEFINITIONS: {
  slot: PACESlot;
  title: string;
  subTitle: string;
  color: string;
  borderColor: string;
  bgGlow: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    slot: 'P',
    title: 'Primary (主要)',
    subTitle: '第 1 防線 · 日常高頻寬通道',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgGlow: 'bg-cyan-950/20',
    icon: <Satellite className="w-4 h-4 text-cyan-400" />,
    desc: '標準作業首選，提供超大頻寬與即時影像'
  },
  {
    slot: 'A',
    title: 'Alternate (備用)',
    subTitle: '第 2 防線 · 標準替代方案',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgGlow: 'bg-blue-950/20',
    icon: <Radio className="w-4 h-4 text-blue-400" />,
    desc: '主要通道受阻時無縫切換的軍規跳頻電台'
  },
  {
    slot: 'C',
    title: 'Contingency (應急)',
    subTitle: '第 3 防線 · 惡劣環境防線',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgGlow: 'bg-amber-950/20',
    icon: <Phone className="w-4 h-4 text-amber-400" />,
    desc: '強烈電子干擾與斷電下的手搖有線/震動'
  },
  {
    slot: 'E',
    title: 'Emergency (緊急)',
    subTitle: '第 4 防線 · 終極保命手段',
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    bgGlow: 'bg-red-950/20',
    icon: <ShieldCheck className="w-4 h-4 text-red-400" />,
    desc: '全防線崩潰時的全免疫物理/光學信差'
  },
];

export const PACEBoard: React.FC<PACEBoardProps> = ({ player }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
            {player.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">{player.name} 的 PACE 通訊作戰儀表板</h2>
              {player.isAI && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                  AI: {player.aiPersonality}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              四重通訊防線：[P] 主要 ➔ [A] 備用 ➔ [C] 應急 ➔ [E] 緊急
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
            <span>物資資金:</span>
            <span className="font-bold text-sm">{player.credits} 💰</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>電力蓄能:</span>
            <span className="font-bold text-sm">{player.energy}/{player.maxEnergy} ⚡</span>
          </div>
        </div>
      </div>

      {/* 4 PACE Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {SLOT_DEFINITIONS.map((slotDef, index) => {
          const card = player.paceBoard[slotDef.slot];

          return (
            <div key={slotDef.slot} className="relative flex flex-col">
              {/* Slot Indicator Header */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-t-xl bg-slate-900/90 border-t border-x border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  {slotDef.icon}
                  <span className={`font-bold ${slotDef.color}`}>{slotDef.title}</span>
                </div>
                {index < 3 && (
                  <div className="hidden lg:flex items-center text-slate-600 text-[10px]" title="當前通道受阻時自動遞補">
                    <span>Fallback</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </div>
                )}
              </div>

              {/* Slot Body */}
              <div
                className={`flex-1 rounded-b-xl border border-dashed transition-all p-2 ${
                  card
                    ? 'border-solid border-slate-700 bg-slate-900/40'
                    : `${slotDef.borderColor} ${slotDef.bgGlow} flex flex-col items-center justify-center min-h-[180px] text-center`
                }`}
              >
                {card ? (
                  <EquipmentCardView card={card} isEquipped={true} compact={true} />
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="p-3 rounded-full bg-black/40 mb-2 text-slate-500 border border-white/5">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold font-mono mb-1 ${slotDef.color}`}>
                      未裝備 [{slotDef.slot}] 通訊手段
                    </span>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {slotDef.desc}
                    </p>
                    <span className="mt-2 text-[10px] text-slate-500 font-mono">
                      請至右側裝備庫採購
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
