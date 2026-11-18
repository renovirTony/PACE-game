/**
 * Web Storage 的安全包裝。
 * Safari 無痕模式、封鎖網站資料或縮圖預覽時，存取 storage 會丟出例外；
 * 若直接寫在 useState 初始化中，整個 App 會白屏。這裡一律吞掉例外並回傳預設值。
 */
function createSafeStorage(getStore: () => Storage) {
  return {
    get(key: string): string | null {
      try {
        return getStore().getItem(key);
      } catch {
        return null;
      }
    },
    set(key: string, value: string): void {
      try {
        getStore().setItem(key, value);
      } catch {
        // 無法儲存時僅失去「記住」的便利，不影響遊戲
      }
    },
  };
}

/** 跨分頁、長期保存的偏好設定 */
export const safeStorage = createSafeStorage(() => window.localStorage);

/** 只屬於這個分頁的資料（重新整理仍在、開新分頁則不共用），例如線上對局的座位憑證 */
export const safeSessionStorage = createSafeStorage(() => window.sessionStorage);
