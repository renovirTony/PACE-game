import React from 'react';
import { CrisisMission, GlobalEvent, Player } from '../../types/game';
import { IconRenderer } from '../Common/IconRenderer';
import { Radio, AlertCircle, CheckCircle2, Award } from 'lucide-react';
import { evaluatePACETransmission } from '../../engine/rules';

interface MissionCardViewProps {
  mission: CrisisMission;
  activePlayer: Player;
  activeEvent: GlobalEvent | null;
  onTransmit: (mission: CrisisMission) => void;
  disabled?: boolean;
  highlight?: boolean;
}

const URGENCY_CONFIG = {
  Low: { color: 'border-slate-500/40 bg-slate-900/40 text-slate-300', label: '常規通訊' },
  Medium: { color: 'border-blue-500/40 bg-blue-950/40 text-blue-300', label: '重要調度' },
  High: { color: 'border-amber-500/40 bg-amber-950/40 text-amber-300', label: '緊迫搜救' },
  Critical: { color: 'border-red-500/60 bg-red-950/50 text-red-300 animate-pulse-slow', label: '極度危急' },
};

export const MissionCardView: React.FC<MissionCardViewProps> = ({
  mission,
  activePlayer,
  activeEvent,
  onTransmit,
  disabled = false,
  highlight = false,
}) => {
  const isClaimedByMe = mission.claimedBy.includes(activePlayer.id);
  const transmissionEval = evaluatePACETransmission(activePlayer, mission, activeEvent);
  const urgency = URGENCY_CONFIG[mission.urgency];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 overflow-hidden ${
        highlight ? 'tutorial-spotlight ring-2 ring-cyan-400' : ''
      } ${
        isClaimedByMe
          ? 'bg-slate-900/60 border-slate-700/60 opacity-80'
          : transmissionEval.canTransmit
          ? 'bg-gradient-to-br from-slate-900 via-[#0d1627] to-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/40 hover:border-cyan-400'
          : 'bg-slate-900/90 border-slate-800/90'
      }`}
    >
      <div>
        {/* Top Header: Urgency & Rewards */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg border uppercase tracking-wider ${urgency.color} shadow-sm`}>
            {urgency.label}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-500/40 font-mono shadow-inner">
              <Award className="w-4 h-4 text-amber-400" />
              {mission.vp} VP
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 bg-cyan-950/70 px-2.5 py-1 rounded-lg border border-cyan-500/40 shadow-inner">
              +{mission.creditReward} 💰
            </span>
          </div>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="p-2.5 rounded-xl bg-black/60 text-cyan-400 border border-cyan-500/30 shrink-0 shadow-inner">
            <IconRenderer name={mission.iconName} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">{mission.title}</h3>
          </div>
        </div>

        {/* Full Mission Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
          {mission.description}
        </p>

        {/* Mission Requirement Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {mission.requiredBandwidth && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              頻寬: {mission.requiredBandwidth}
            </span>
          )}
          {mission.requiredRange && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              距離: {mission.requiredRange.join(' / ')}
            </span>
          )}
          {mission.requiresEmpShield && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-red-950 text-red-300 border border-red-500/40 font-semibold">
              ⚡ 需抗EMP
            </span>
          )}
          {mission.requiresWeatherResist && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-blue-950 text-blue-300 border border-blue-500/40 font-semibold">
              🌧️ 需耐候
            </span>
          )}
          {mission.requiresSubterranean && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-semibold">
              🕳️ 需地底穿透
            </span>
          )}
          {mission.restrictedSlots && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-red-950/90 text-red-300 border border-red-500/50 font-bold">
              🚫 禁用 [{mission.restrictedSlots.join(',')}] 槽位
            </span>
          )}
          {mission.minSlotRequirement && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-amber-950/90 text-amber-200 border border-amber-500/50 font-bold">
              ⚠️ 指定 [{mission.minSlotRequirement}] 級應變手段
            </span>
          )}
        </div>

        {/* PACE Fallback Live Status Diagnostic Box */}
        <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono mb-3 shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400">目前通訊連通狀態:</span>
            {transmissionEval.canTransmit ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 可連通 [{transmissionEval.successfulSlot}]
                {transmissionEval.bonusPoints > 0 && ` (+${transmissionEval.bonusPoints} VP)`}
              </span>
            ) : (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-400" /> 無法連通
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed break-words">
            {transmissionEval.canTransmit ? (
              <span className="text-cyan-300 font-semibold">{transmissionEval.reason}</span>
            ) : (
              <span className="text-red-300/90">{transmissionEval.reason}</span>
            )}
          </p>
        </div>
      </div>

      {/* Broadcast Transmission Button */}
      {isClaimedByMe ? (
        <div className="py-2.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-mono font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 已完成此通訊任務
        </div>
      ) : (
        <button
          onClick={() => onTransmit(mission)}
          disabled={disabled || !transmissionEval.canTransmit}
          className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
            transmissionEval.canTransmit && !disabled
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black shadow-lg shadow-cyan-500/25 active:scale-[0.98]'
              : 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>發起廣播連通 (消耗 1 AP)</span>
        </button>
      )}
    </div>
  );
};
