import React from 'react';
import { DisasterEvent, PhysicalMedium, WorldviewType } from '../../types/game';
import { CloudRain, BatteryLow, ZapOff, Layers, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

interface V2DisasterBannerProps {
  event: DisasterEvent | null;
  worldview: WorldviewType;
}

const mediumNames: Record<PhysicalMedium, string> = {
  Cellular: '公眾網/基地台',
  Satellite: '衛星通訊',
  Radio: '無線電波',
  Wired: '實體有線',
  PhysicalOptical: '人力/光學',
};

export function V2DisasterBanner({ event, worldview }: V2DisasterBannerProps) {
  if (!event) return null;

  const content = event.translations[worldview];

  const getEventIcon = () => {
    switch (event.id) {
      case 'evt_grid_blackout':
        return <BatteryLow className="w-6 h-6 text-red-400 animate-pulse" />;
      case 'evt_super_typhoon':
        return <CloudRain className="w-6 h-6 text-blue-400 animate-bounce" />;
      case 'evt_emp_strike':
        return <ZapOff className="w-6 h-6 text-amber-400 animate-pulse" />;
      case 'evt_earthquake_landslide':
        return <Layers className="w-6 h-6 text-emerald-400" />;
      case 'evt_broadband_jamming':
        return <ShieldAlert className="w-6 h-6 text-purple-400 animate-spin" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  const isHazard = event.targetedMedia.length > 0;

  return (
    <div className={`v2-disaster-banner rounded-2xl border p-4 shadow-xl backdrop-blur-md font-mono flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all relative ${
      isHazard
        ? 'border-red-500/40 bg-red-950/30 text-red-100'
        : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100'
    }`}>
      {/* Left: Icon & Description */}
      <div className="flex items-start gap-3.5 max-w-3xl">
        <div className={`disaster-icon-box p-2.5 rounded-xl border shrink-0 ${
          isHazard ? 'bg-red-950/80 border-red-500/50' : 'bg-emerald-950/80 border-emerald-500/50'
        }`}>
          {getEventIcon()}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="disaster-badge text-xs font-black px-2 py-0.5 rounded uppercase border bg-black/40 border-white/10 text-amber-300">
              全域物理災情 (Active Disaster)
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-100">
              {content?.title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-bold">
            {content?.desc}
          </p>

          <p className="text-[11px] text-slate-400 italic">
            "{content?.flavor}"
          </p>
        </div>
      </div>

      {/* Right: Targeted Media Badges */}
      {isHazard ? (
        <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
          <span className="disaster-target-label text-[10px] uppercase font-bold text-red-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> 中斷物理媒介：
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {event.targetedMedia.map((m) => (
              <span
                key={m}
                className="disaster-media-pill px-2.5 py-1 rounded-xl bg-red-950 border border-red-500/60 text-red-200 text-xs font-black shadow-sm"
              >
                🚫 {mediumNames[m]}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0">
          ✨ 頻譜環境優良
        </div>
      )}
    </div>
  );
}
