import React from 'react';
import { CrisisMission, DisasterEvent, PACESlot, Player, TransmissionResult, WorldviewType } from '../../types/game';
import { evaluateV2PACETransmission } from '../../engine/rules';
import { Radio, Image, HeartPulse, Package, Compass, Award, Layers, Zap, Coins, ArrowRight, ZapOff, Sun, Cable, Truck } from 'lucide-react';

interface V2MissionCardViewProps {
  mission: CrisisMission;
  activePlayer: Player;
  activeEvent: DisasterEvent | null;
  worldview: WorldviewType;
  disabled?: boolean;
  onTransmit: (mission: CrisisMission) => TransmissionResult;
}

export function V2MissionCardView({
  mission,
  activePlayer,
  activeEvent,
  worldview,
  disabled,
  onTransmit,
}: V2MissionCardViewProps) {
  const content = mission.translations[worldview];

  // 即時預覽 Fallback 命中槽位與預估回報
  const preview = evaluateV2PACETransmission(activePlayer, mission, activeEvent, worldview);

  const getMissionIcon = () => {
    switch (mission.id) {
      case 'mis_drone_recon_video':
      case 'mis_power_grid_telemetry':
        return <Image className="w-5 h-5 text-cyan-400" />;
      case 'mis_emergency_telehealth':
        return <HeartPulse className="w-5 h-5 text-red-400" />;
      case 'mis_supply_dispatch_voice':
      case 'mis_water_reservoir_control':
        return <Package className="w-5 h-5 text-amber-400" />;
      case 'mis_mountain_search_team':
        return <Compass className="w-5 h-5 text-blue-400" />;
      case 'mis_sos_coordinates_beacon':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'mis_subterranean_bunker_collapse':
      case 'mis_tunnel_fire_evacuation':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'mis_night_optical_morse':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'mis_emp_hardened_order':
        return <ZapOff className="w-5 h-5 text-red-400" />;
      case 'mis_coastal_courier_dispatch':
      case 'mis_bridge_evacuation_routing':
        return <Truck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Radio className="w-5 h-5 text-cyan-400" />;
    }
  };

  const bandwidthBadge = () => {
    if (mission.requiredBandwidth === 'High') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40">
          🔴 需 High 頻寬 (視訊/巨量圖)
        </span>
      );
    }
    if (mission.requiredBandwidth === 'Medium') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500/40">
          🟡 需 Medium 頻寬 (語音通聯)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
        🟢 需 Low 頻寬 (求救/座標代碼)
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex flex-col justify-between gap-3 font-mono hover:border-slate-700 transition-all">
      {/* Top: Icon, Bandwidth Badge, Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
            {getMissionIcon()}
          </div>
          {bandwidthBadge()}
        </div>

        <h3 className="text-sm font-black text-slate-100 leading-snug">
          {content?.title}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          {content?.desc}
        </p>

        {/* Requirements Badges (MAPS Minimal & Clean) */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-300 flex-wrap pt-1.5 border-t border-white/5">
          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-bold">
            📡 {mission.requiredRange.join('/')}
          </span>
          {mission.requiresWeatherResist && (
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
              🌧️ 耐天候
            </span>
          )}
          {mission.requiresSubterranean && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
              🕳️ 地底穿透
            </span>
          )}
          {mission.requiresEmpShield && (
            <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/40 font-bold">
              🛡️ 需抗EMP
            </span>
          )}
          {mission.requiresOptical && (
            <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold" title="需具備光學閃光能力（如阿爾迪斯燈/強光手電筒）">
              🔦 需光學摩斯
            </span>
          )}
          {mission.requiresWired && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
              🔌 需實體有線
            </span>
          )}
        </div>
      </div>

      {/* Bottom: Rewards, Fallback Live Preview, Transmit Button */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
        {/* Rewards */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">基礎任務回報:</span>
          <div className="flex items-center gap-2 font-bold">
            <span className="text-purple-400 flex items-center gap-0.5">
              🏆 {mission.vpReward} 分
            </span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              💰 {mission.creditReward} 物資
            </span>
          </div>
        </div>

        {/* Live Fallback Preview (MAPS Minimal & Tangible) */}
        <div className={`p-2 rounded-xl text-[11px] font-bold border flex items-center justify-between ${
          preview.canTransmit
            ? preview.successfulSlot === 'P' || preview.successfulSlot === 'A'
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            : 'bg-red-950/40 border-red-500/40 text-red-300'
        }`}>
          {preview.canTransmit ? (
            <>
              <span>預計由 [{preview.successfulSlot}] 防線接手 ({Math.round(preview.degradationRate * 100)}% 收益)</span>
              <span className="text-xs">➔ 🏆{preview.earnedVP}分</span>
            </>
          ) : (
            <span className="w-full text-center">❌ 目前防線未滿足任務條件 (無法連通)</span>
          )}
        </div>

        {/* Transmit Action Button */}
        {(() => {
          const isFreeTrans = Boolean(activePlayer.activeBuffs?.freeTransmissionActive);
          const canTransmitAP = activePlayer.actionPoints > 0 || isFreeTrans;

          return (
            <button
              onClick={() => onTransmit(mission)}
              disabled={disabled || !canTransmitAP}
              className={`w-full py-2.5 rounded-xl font-black text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isFreeTrans
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/30 font-black'
                  : preview.canTransmit
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
              } ${disabled || !canTransmitAP ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Radio className="w-4 h-4" />
              <span>{isFreeTrans ? '發起通訊檢定 (0 AP [突發通訊])' : '發起通訊檢定 (消耗 1 AP)'}</span>
            </button>
          );
        })()}
      </div>
    </div>
  );
}
