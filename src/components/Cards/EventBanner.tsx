import React from 'react';
import { GlobalEvent } from '../../types/game';
import { IconRenderer } from '../Common/IconRenderer';
import { AlertTriangle } from 'lucide-react';

interface EventBannerProps {
  event: GlobalEvent | null;
}

export const EventBanner: React.FC<EventBannerProps> = ({ event }) => {
  if (!event) return null;

  return (
    <div className="relative rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-950/60 via-slate-900/95 to-amber-950/60 p-4 shadow-lg overflow-hidden">
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
            <IconRenderer name={event.iconName} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> 當前全域大氣與環境災害
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">{event.title}</h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-200 font-mono leading-relaxed">{event.effectDescription}</p>
          </div>
        </div>

        {event.flavor && (
          <div className="text-xs text-slate-300 italic shrink-0 max-w-sm text-right hidden lg:block bg-black/30 p-2 rounded-lg border border-white/5">
            "{event.flavor}"
          </div>
        )}
      </div>
    </div>
  );
};
