import React from 'react';
import { GameLog } from '../../types/game';
import { Terminal } from 'lucide-react';

interface LogViewerProps {
  logs: GameLog[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md flex flex-col h-[300px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">戰術通訊與作戰日誌 (Comms Feed)</span>
        </div>
        <span className="text-xs font-mono text-slate-400">即時監聽中</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs sm:text-sm">
        {logs.map(log => {
          let badgeColor = 'text-slate-300 border-slate-700 bg-slate-900';
          if (log.type === 'success') badgeColor = 'text-emerald-200 border-emerald-500/40 bg-emerald-950/50';
          if (log.type === 'alert') badgeColor = 'text-red-200 border-red-500/40 bg-red-950/50';
          if (log.type === 'action') badgeColor = 'text-cyan-200 border-cyan-500/40 bg-cyan-950/50';
          if (log.type === 'event') badgeColor = 'text-amber-200 border-amber-500/40 bg-amber-950/50';

          return (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border leading-relaxed transition-all ${badgeColor}`}
            >
              <div className="flex items-center justify-between gap-2 text-xs opacity-80 mb-1">
                <span className="font-bold">
                  [R{log.round}] {log.timestamp} {log.playerName ? `· ${log.playerName}` : ''}
                </span>
                <span className="uppercase tracking-wider text-[11px]">[{log.type}]</span>
              </div>
              <p className="text-slate-100">{log.message}</p>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs sm:text-sm">
            暫無通訊紀錄
          </div>
        )}
      </div>
    </div>
  );
};
