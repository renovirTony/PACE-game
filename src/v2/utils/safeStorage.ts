/**
 * localStorage 的安全包裝。
 * Safari 無痕模式、封鎖網站資料或縮圖預覽時，存取 localStorage 會丟出例外；
 * 若直接寫在 useState 初始化中，整個 App 會白屏。這裡一律吞掉例外並回傳預設值。
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // 無法儲存時僅失去「記住偏好」的便利，不影響遊戲
    }
  },
};
