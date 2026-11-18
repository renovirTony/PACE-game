import type { ConnectionStatus } from '../../engine/multiplayer';

/**
 * 線上客端在對局中的連線狀態提示：只在「不是已連線」時出現。
 * 重連期間按鈕會被鎖住，沒有這條提示的話玩家會以為遊戲當掉了。
 */
export function OnlineConnectionBanner({
  status,
  message,
  onReturnToMenu,
}: {
  status: ConnectionStatus;
  message: string;
  onReturnToMenu: () => void;
}) {
  if (status === 'connected') return null;
  const isRetrying = status === 'connecting';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-2rem)] max-w-md px-4 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md font-mono text-xs font-bold flex items-center gap-2 ${
        isRetrying
          ? 'bg-amber-950/95 border-amber-500/60 text-amber-200'
          : 'bg-red-950/95 border-red-500/60 text-red-200'
      }`}
    >
      <span className={`shrink-0 ${isRetrying ? 'animate-pulse' : ''}`} aria-hidden="true">📡</span>
      <span className="min-w-0 flex-1">{message}</span>
      {!isRetrying && (
        <button
          onClick={onReturnToMenu}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-red-900 hover:bg-red-800 border border-red-500/60 text-red-50"
        >
          返回主選單
        </button>
      )}
    </div>
  );
}
