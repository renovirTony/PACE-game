import React from 'react';
import { GameLog } from '../../types/game';
import { Terminal, ShieldAlert, CheckCircle, Info, Zap } from 'lucide-react';

interface LogViewerProps {
  logs: GameLog[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md flex flex-col h-[280px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">戰術通訊與作戰日誌 (Comms Feed)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">即時監聽中</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
        {logs.map(log => {
          let badgeColor = 'text-slate-400 border-slate-700 bg-slate-900';
          if (log.type === 'success') badgeColor = 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40';
          if (log.type === 'alert') badgeColor = 'text-red-400 border-red-500/40 bg-red-950/40';
          if (log.type === 'action') badgeColor = 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40';
          if (log.type === 'event') badgeColor = 'text-amber-300 border-amber-500/40 bg-amber-950/40';

          return (
            <div
              key={log.id}
              className={`p-2 rounded-lg border text-[11px] leading-relaxed transition-all ${badgeColor}`}
            >
              <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 mb-0.5">
                <span className="font-semibold">
                  [R{log.round}] {log.timestamp} {log.playerName ? `· ${log.playerName}` : ''}
                </span>
                <span className="uppercase tracking-wider">[{log.type}]</span>
              </div>
              <p className="text-slate-100">{log.message}</p>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs">
            暫無通訊紀錄
          </div>
        )}
      </div>
    </div>
  );
};
