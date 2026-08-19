import React from 'react';
import { CrisisMission, GlobalEvent, Player } from '../../types/game';
import { IconRenderer } from '../Common/IconRenderer';
import { Radio, AlertCircle, CheckCircle2, Award, Zap } from 'lucide-react';
import { evaluatePACETransmission } from '../../engine/rules';

interface MissionCardViewProps {
  mission: CrisisMission;
  activePlayer: Player;
  activeEvent: GlobalEvent | null;
  onTransmit: (mission: CrisisMission) => void;
  disabled?: boolean;
}

const URGENCY_CONFIG = {
  Low: { color: 'border-slate-500/40 bg-slate-900/40 text-slate-400', label: '常規通訊' },
  Medium: { color: 'border-blue-500/40 bg-blue-950/30 text-blue-400', label: '重要調度' },
  High: { color: 'border-amber-500/40 bg-amber-950/30 text-amber-400', label: '緊迫搜救' },
  Critical: { color: 'border-red-500/60 bg-red-950/40 text-red-400 animate-pulse-slow', label: '極度危急' },
};

export const MissionCardView: React.FC<MissionCardViewProps> = ({
  mission,
  activePlayer,
  activeEvent,
  onTransmit,
  disabled = false,
}) => {
  const isClaimedByMe = mission.claimedBy.includes(activePlayer.id);
  const transmissionEval = evaluatePACETransmission(activePlayer, mission, activeEvent);
  const urgency = URGENCY_CONFIG[mission.urgency];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 overflow-hidden ${
        isClaimedByMe
          ? 'bg-slate-900/60 border-slate-700/60 opacity-80'
          : transmissionEval.canTransmit
          ? 'bg-gradient-to-br from-slate-900 via-[#0e1626] to-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-950/30 hover:border-cyan-400'
          : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${urgency.color}`}>
            {urgency.label}
          </span>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {mission.vp} VP
            </span>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
              +{mission.creditReward} 💰
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-black/40 text-cyan-400 border border-cyan-500/20 shrink-0">
            <IconRenderer name={mission.iconName} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 leading-snug">{mission.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{mission.description}</p>
          </div>
        </div>

        {/* Mission Requirement Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {mission.requiredBandwidth && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              頻寬: {mission.requiredBandwidth}
            </span>
          )}
          {mission.requiredRange && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              距離: {mission.requiredRange.join('/')}
            </span>
          )}
          {mission.requiresEmpShield && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
              ⚡ 需抗EMP
            </span>
          )}
          {mission.requiresWeatherResist && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
              🌧️ 需耐候
            </span>
          )}
          {mission.requiresSubterranean && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              🕳️ 需地底穿透
            </span>
          )}
          {mission.restrictedSlots && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/40">
              🚫 禁用 [{mission.restrictedSlots.join(',')}] 槽位
            </span>
          )}
          {mission.minSlotRequirement && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
              ⚠️ 限 [{mission.minSlotRequirement}] 級應變
            </span>
          )}
        </div>

        {/* PACE Fallback Live Status Indicator */}
        <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400">目前通訊連通狀態:</span>
            {transmissionEval.canTransmit ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 可連通 [{transmissionEval.successfulSlot}]
                {transmissionEval.bonusPoints > 0 && ` (+${transmissionEval.bonusPoints} VP)`}
              </span>
            ) : (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> 無法連通
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {transmissionEval.canTransmit ? transmissionEval.reason : transmissionEval.reason}
          </p>
        </div>
      </div>

      {/* Broadcast Transmission Button */}
      {isClaimedByMe ? (
        <div className="py-2 px-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> 已完成此通訊任務
        </div>
      ) : (
        <button
          onClick={() => onTransmit(mission)}
          disabled={disabled || !transmissionEval.canTransmit}
          className={`w-full py-2 px-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
            transmissionEval.canTransmit && !disabled
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20 active:scale-[0.98]'
              : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>發起廣播連通 (消耗 1 AP)</span>
        </button>
      )}
    </div>
  );
};
