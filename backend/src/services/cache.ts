import { getRedis, getRedisState } from "../config/redis.js";
import { CACHE_KEYS, CACHE_TTL_SECONDS } from "../config/constants.js";
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (getRedisState() !== "connected") return null;
  try { const value = await getRedis()?.get(key); return value ? JSON.parse(value) as T : null; } catch { return null; }
}
export async function cacheSet(key: string, value: unknown, ttl = CACHE_TTL_SECONDS.search) {
  if (getRedisState() !== "connected") return;
  try { await getRedis()?.set(key, JSON.stringify(value), "EX", ttl); } catch { /* cache is optional */ }
}
export async function cacheDel(key: string) { try { await getRedis()?.del(key); } catch { /* optional */ } }
export const invalidateBikeCache = (slug: string) => cacheDel(CACHE_KEYS.bike(slug));
