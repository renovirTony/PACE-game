import { GameLog } from '../../types/game';
import { Terminal } from 'lucide-react';

/** 日誌類型的中文標籤與配色 */
const LOG_TYPE_META: Record<GameLog['type'], { label: string; className: string }> = {
  info: { label: '資訊', className: 'text-slate-300 border-slate-700 bg-slate-900' },
  success: { label: '成功', className: 'text-emerald-200 border-emerald-500/40 bg-emerald-950/50' },
  alert: { label: '警示', className: 'text-red-200 border-red-500/40 bg-red-950/50' },
  action: { label: '行動', className: 'text-cyan-200 border-cyan-500/40 bg-cyan-950/50' },
  event: { label: '天災', className: 'text-amber-200 border-amber-500/40 bg-amber-950/50' },
  transmission: { label: '通訊', className: 'text-cyan-200 border-cyan-500/40 bg-cyan-950/50' },
};

/**
 * v2 作戰日誌（自 v1 LogViewer 移植，改用 v2 型別，避免 v2 依賴凍結中的 v1 程式碼）
 */
export function V2LogViewer({ logs }: { logs: GameLog[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md flex flex-col h-[300px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">作戰日誌</span>
        </div>
        <span className="text-xs font-mono text-slate-400">即時監聽中</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs sm:text-sm">
        {logs.map((log) => {
          const meta = LOG_TYPE_META[log.type] || LOG_TYPE_META.info;
          return (
            <div key={log.id} className={`p-2.5 rounded-lg border leading-relaxed transition-all ${meta.className}`}>
              <div className="flex items-center justify-between gap-2 text-xs opacity-80 mb-1">
                <span className="font-bold">
                  [第 {log.round} 輪] {log.timestamp} {log.playerName ? `· ${log.playerName}` : ''}
                </span>
                <span className="text-[11px]">{meta.label}</span>
              </div>
              <p className="text-slate-100">{log.message}</p>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs sm:text-sm">暫無通訊紀錄</div>
        )}
      </div>
    </div>
  );
}
