import { useEffect } from 'react';

/**
 * 啟用期間要求螢幕保持常亮。
 * 線上對局最常見的斷線原因是手機自動鎖屏：鎖屏後瀏覽器暫停網頁，連線跟著中斷。
 * 瀏覽器在分頁切到背景時會自動釋放 wake lock，所以回到前景要重新申請。
 * 不支援的瀏覽器（或非 HTTPS 環境）會靜默略過，不影響遊戲。
 */
export function useScreenWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      if (document.visibilityState !== 'visible' || (sentinel && !sentinel.released)) return;
      try {
        const lock = await navigator.wakeLock.request('screen');
        if (cancelled) {
          void lock.release();
          return;
        }
        sentinel = lock;
      } catch {
        // 省電模式或使用者設定拒絕時取得不到，維持原本行為即可
      }
    };

    void request();
    document.addEventListener('visibilitychange', request);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', request);
      void sentinel?.release();
    };
  }, [enabled]);
}
