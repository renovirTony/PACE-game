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
    <div className="relative rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-slate-900/90 to-amber-950/50 p-3 shadow-lg overflow-hidden">
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <IconRenderer name={event.iconName} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> 當前全域環境
              </span>
              <h3 className="text-sm font-bold text-slate-100">{event.title}</h3>
            </div>
            <p className="text-xs text-amber-200/90 font-mono mt-0.5">{event.effectDescription}</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 italic shrink-0 max-w-xs text-right hidden lg:block">
          "{event.flavor}"
        </div>
      </div>
    </div>
  );
};
