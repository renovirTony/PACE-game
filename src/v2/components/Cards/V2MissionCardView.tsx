import React from 'react';
import { CrisisMission, DisasterEvent, PACESlot, Player, TransmissionResult, WorldviewType } from '../../types/game';
import { evaluateV2PACETransmission } from '../../engine/rules';
import { BANDWIDTH_META, RANGE_META } from '../../data/terminology';
import { Radio, Image, HeartPulse, Package, Compass, Award, Layers, Zap, Coins, ArrowRight, ZapOff, Sun, Cable, Truck } from 'lucide-react';

interface V2MissionCardViewProps {
  mission: CrisisMission;
  activePlayer: Player;
  activeEvent: DisasterEvent | null;
  worldview: WorldviewType;
  disabled?: boolean;
  onTransmit: (mission: CrisisMission) => TransmissionResult;
  dataTutorial?: string;
  /**
   * full       — 直式完整卡（手機版 / 一般用途）
   * desktopRow — 桌面版橫向任務列（左：標題說明 / 中：三欄矩陣 / 右：檢定預覽與按鈕）
   */
  variant?: 'full' | 'desktopRow';
}

/**
 * 任務需求三欄矩陣（與裝備卡 EquipCardSpecs 採同一心智模型）
 *  ┌──────────┬──────────┬──────────┐
 *  │ 需求頻寬  │ 需求距離  │ 任務獎勵  │
 *  └──────────┴──────────┴──────────┘
 */
function MissionSpecsMatrix({
  mission,
  rangeText,
  dense = false,
}: {
  mission: CrisisMission;
  rangeText: string;
  dense?: boolean;
}) {
  const cellPad = dense ? 'p-1' : 'p-1.5';
  const labelSize = dense ? 'text-[10px]' : 'text-[11px]';

  return (
    <div className="grid grid-cols-3 gap-1.5 text-xs">
      <div className={`${cellPad} rounded-lg bg-black/40 text-center min-w-0`}>
        <span className={`text-slate-500 block ${labelSize} whitespace-nowrap`}>需求頻寬</span>
        <span className={`font-black break-words leading-tight block text-[11px] ${BANDWIDTH_META[mission.requiredBandwidth].color}`}>
          {BANDWIDTH_META[mission.requiredBandwidth].compactLabel}
        </span>
      </div>

      <div
        className={`${cellPad} rounded-lg bg-black/40 text-center min-w-0`}
        title={`需求距離: ${mission.requiredRange.map(r => RANGE_META[r]?.fullLabel || r).join(' / ')}`}
      >
        <span className={`text-slate-500 block ${labelSize} whitespace-nowrap`}>需求距離</span>
        <span className="font-bold text-slate-200 break-words leading-tight block text-[11px]">
          {rangeText}
        </span>
      </div>

      <div className={`${cellPad} rounded-lg bg-black/40 text-center min-w-0`}>
        <span className={`text-slate-500 block ${labelSize} whitespace-nowrap`}>任務獎勵</span>
        <span className="font-bold text-purple-300 break-words leading-tight block text-[11px]">
          🏆 {mission.vpReward}分 · 💰 {mission.creditReward}
        </span>
      </div>
    </div>
  );
}

/** 任務特殊條件徽章列（僅顯示有要求的項目） */
function MissionSpecialBadges({ mission }: { mission: CrisisMission }) {
  const hasAny =
    mission.requiresWeatherResist ||
    mission.requiresSubterranean ||
    mission.requiresEmpShield ||
    mission.requiresWired ||
    mission.requiresOptical;

  if (!hasAny) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs flex-wrap pt-0.5">
      {mission.requiresWeatherResist && (
        <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold whitespace-nowrap shrink-0">
          🌧️ 需耐天候
        </span>
      )}
      {mission.requiresSubterranean && (
        <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap shrink-0">
          🕳️ 需地底穿透
        </span>
      )}
      {mission.requiresEmpShield && (
        <span className="px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 font-bold whitespace-nowrap shrink-0">
          🛡️ 需抗 EMP
        </span>
      )}
      {mission.requiresOptical && (
        <span
          className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold whitespace-nowrap shrink-0"
          title="需具備光學閃光能力（如阿爾迪斯燈/強光手電筒）"
        >
          🔦 需光學
        </span>
      )}
      {mission.requiresWired && (
        <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap shrink-0">
          🔌 需實體有線
        </span>
      )}
    </div>
  );
}

export function V2MissionCardView({
  mission,
  activePlayer,
  activeEvent,
  worldview,
  disabled,
  onTransmit,
  dataTutorial,
  variant = 'full',
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

  const isFreeTrans = Boolean(activePlayer.activeBuffs?.freeTransmissionActive);
  const canTransmitAP = activePlayer.actionPoints > 0 || isFreeTrans;

  // Fail message analysis
  const powerFail = preview.slotEvaluations.find(s => s.card && (s.failReason?.includes('⚡') || s.failReason?.includes('電量')));
  const disasterFail = preview.slotEvaluations.find(s => s.card && (s.failReason?.includes('🌪️') || s.failReason?.includes('阻斷')));
  const bwFail = preview.slotEvaluations.find(s => s.card && s.failReason?.includes('頻寬'));
  const otherFail = preview.slotEvaluations.find(s => s.card && s.failReason && !s.failReason.includes('未配置'));
  const allEmpty = preview.slotEvaluations.every(s => !s.card);

  let failMsg = '❌ 防線未滿足任務條件';
  if (allEmpty) {
    failMsg = '❌ 防線無裝備 (請先採購)';
  } else if (powerFail && powerFail.failReason) {
    failMsg = powerFail.failReason;
  } else if (disasterFail && disasterFail.failReason) {
    failMsg = disasterFail.failReason;
  } else if (bwFail) {
    failMsg = `📊 頻寬不足 (需 ${BANDWIDTH_META[mission.requiredBandwidth].compactLabel})`;
  } else if (otherFail && otherFail.failReason) {
    failMsg = otherFail.failReason;
  }

  const getMissionRangeLabel = (ranges: string[]) => {
    if (ranges.length <= 1) {
      return ranges.map(r => RANGE_META[r]?.label || r).join('/');
    }
    const shortMap: Record<string, string> = {
      Local: '短距',
      LineOfSight: '視距',
      LongRange: '跨區',
      Penetrating: '地底',
      Global: '全球',
    };
    return ranges.map(r => shortMap[r] || RANGE_META[r]?.label || r).join(' / ');
  };

  const rangeText = getMissionRangeLabel(mission.requiredRange);

  // =========================================================================
  // DESKTOP ROW VARIANT (橫向任務列 · 充分利用桌面寬度，避免三欄擠壓)
  // =========================================================================
  if (variant === 'desktopRow') {
    return (
      <div
        data-tutorial={dataTutorial}
        className="mission-row rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 grid grid-cols-[minmax(0,1fr)_185px] xl:grid-cols-[minmax(0,1fr)_215px] gap-2.5 items-center hover:border-slate-700 transition-all font-mono text-xs"
      >
        {/* Left: Icon + Title + Description + Requirements Matrix + Special Requirements */}
        <div className="min-w-0 flex flex-col gap-1.5 justify-center">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
              {getMissionIcon()}
            </div>
            <h3 className="text-xs font-black text-slate-100 leading-snug break-words min-w-0" title={content?.title || ''}>
              {content?.title}
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed break-words">
            {content?.desc}
          </p>

          <MissionSpecsMatrix mission={mission} rangeText={rangeText} dense />

          <MissionSpecialBadges mission={mission} />
        </div>

        {/* Right: Live Fallback Preview + Transmit Button */}
        <div className="min-w-0 flex flex-col justify-center gap-1.5 pl-2.5 border-l border-white/5">
          <div className={`p-1.5 rounded-lg text-xs font-black border text-center leading-tight break-words transition-all ${
            preview.canTransmit
              ? preview.successfulSlot === 'P' || preview.successfulSlot === 'A'
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`} title={preview.canTransmit ? undefined : failMsg}>
            {preview.canTransmit ? (
              <>
                <span className="block">
                  由 [{preview.successfulSlot}] 接手 (收益 {Math.round(preview.degradationRate * 100)}%)
                </span>
                <span className="block text-purple-300 mt-0.5">➔ 🏆 {preview.earnedVP}分</span>
              </>
            ) : (
              failMsg
            )}
          </div>

          <button
            onClick={() => onTransmit(mission)}
            disabled={disabled || !canTransmitAP}
            className={`w-full py-2 rounded-xl font-black text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
              disabled || !canTransmitAP
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                : isFreeTrans
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110'
                : preview.canTransmit
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:brightness-110'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{isFreeTrans ? '發起通訊檢定 (0 AP)' : '發起通訊檢定 (1 AP)'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-tutorial={dataTutorial}
      className="rounded-2xl border p-4 shadow-xl flex flex-col justify-between gap-3 font-mono transition-all relative border-slate-800 bg-slate-900/90 hover:border-slate-700"
    >
      {/* Top: Icon + Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
            {getMissionIcon()}
          </div>
          <h3 className="text-sm font-black text-slate-100 leading-snug">
            {content?.title}
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {content?.desc}
        </p>

        {/* Requirements Matrix (3-column grid aligned with equipment specs) */}
        <div className="pt-1.5 border-t border-white/5">
          <MissionSpecsMatrix mission={mission} rangeText={rangeText} />
        </div>

        {/* Special Requirement Badges */}
        <MissionSpecialBadges mission={mission} />
      </div>

      {/* Bottom: Fallback Live Preview & Transmit Button */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/5">

        {/* Live Fallback Preview (MAPS Minimal & Tangible) */}
        <div className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-between gap-2 leading-relaxed transition-all ${
          preview.canTransmit
            ? preview.successfulSlot === 'P' || preview.successfulSlot === 'A'
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            : 'bg-red-950/40 border-red-500/40 text-red-300'
        }`}>
          {preview.canTransmit ? (
            <>
              <span className="break-words">預計由 [{preview.successfulSlot}] 防線接手 (收益 {Math.round(preview.degradationRate * 100)}%)</span>
              <span className="text-xs shrink-0 whitespace-nowrap font-black">➔ 🏆{preview.earnedVP}分</span>
            </>
          ) : (
            (() => {
              // 依優先順序分析最具體之通訊障礙原因
              const powerFail = preview.slotEvaluations.find(s => s.card && (s.failReason?.includes('⚡') || s.failReason?.includes('電量')));
              const disasterFail = preview.slotEvaluations.find(s => s.card && (s.failReason?.includes('🌪️') || s.failReason?.includes('阻斷')));
              const bwFail = preview.slotEvaluations.find(s => s.card && s.failReason?.includes('頻寬'));
              const otherFail = preview.slotEvaluations.find(s => s.card && s.failReason && !s.failReason.includes('未配置'));
              const allEmpty = preview.slotEvaluations.every(s => !s.card);

              let failMsg = '❌ 目前防線未滿足任務條件 (無法連通)';
              if (allEmpty) {
                failMsg = '❌ 防線無裝備 (請至市場採購通訊工具)';
              } else if (powerFail && powerFail.failReason) {
                failMsg = powerFail.failReason;
              } else if (disasterFail && disasterFail.failReason) {
                failMsg = disasterFail.failReason;
              } else if (bwFail) {
                failMsg = `📊 頻寬不足 (任務需 ${BANDWIDTH_META[mission.requiredBandwidth].label}頻寬)`;
              } else if (otherFail && otherFail.failReason) {
                failMsg = otherFail.failReason;
              }

              return (
                <span className="w-full text-center text-xs leading-snug break-words break-keep">
                  {failMsg}
                </span>
              );
            })()
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
