import { useEffect } from 'react';
import type { LastTransmission } from '../../engine/gameState';
import type { WorldviewType } from '../../types/game';

/**
 * 別人（AI 或線上其他玩家）的通訊檢定結果：右下角（手機在底部操作列上方）自動消失的提示條。
 * MAPS M：別人每次行動都跳出要手動關閉的報告會打斷玩家；自己的檢定仍保留完整報告（做中學）。
 */
export function AITransmissionToast({
  data,
  worldview,
  isMobile,
  onDismiss,
}: {
  data: LastTransmission | null;
  worldview: WorldviewType;
  isMobile: boolean;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!data?.isOtherPlayer) return;
    const timer = setTimeout(onDismiss, 2600);
    return () => clearTimeout(timer);
  }, [data, onDismiss]);

  if (!data?.isOtherPlayer) return null;

  const { result, mission, playerName } = data;
  const title = mission.translations[worldview]?.title || mission.id;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-[115] ${
        isMobile ? 'left-3 right-3 bottom-[124px]' : 'right-5 bottom-5 max-w-sm'
      } px-3.5 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md font-mono text-xs animate-fadeIn ${
        result.canTransmit
          ? 'bg-slate-950/95 border-emerald-500/50 text-emerald-200'
          : 'bg-slate-950/95 border-red-500/50 text-red-200'
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="shrink-0">{result.canTransmit ? '📡' : '❌'}</span>
        <div className="min-w-0 flex-1">
          <span className="font-black">{playerName}</span>
          {result.canTransmit ? (
            <>
              {' '}連通【{title}】· 由 [{result.successfulSlot}] 接手 <b className="text-purple-300">+{result.earnedVP} 分</b>
            </>
          ) : (
            <> 嘗試【{title}】失敗，四道防線都沒能接通</>
          )}
        </div>
        <button onClick={onDismiss} className="shrink-0 text-slate-500 hover:text-slate-200" aria-label="關閉提示">
          ✕
        </button>
      </div>
    </div>
  );
}
