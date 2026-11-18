import { safeSessionStorage } from './safeStorage';

const SEAT_TOKEN_KEY_PREFIX = 'pace_v2_seat_';

/**
 * 取得這個分頁在某個房間的座位憑證（沒有就新建一張）。
 * 存在 sessionStorage：重新整理頁面後再加入同一房號，會坐回原本的座位；
 * 但同一台電腦另開分頁會拿到新憑證，不會兩個分頁搶同一個座位。
 * 不用 crypto.randomUUID：區網 http 測試時不是安全環境，該 API 不存在。
 */
export function getSeatToken(roomCode: string): string {
  const key = `${SEAT_TOKEN_KEY_PREFIX}${roomCode.toUpperCase()}`;
  const saved = safeSessionStorage.get(key);
  if (saved) return saved;
  const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  safeSessionStorage.set(key, token);
  return token;
}
