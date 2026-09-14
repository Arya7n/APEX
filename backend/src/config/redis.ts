import { Redis } from "ioredis";
import { env } from "./env.js";

export type ConnectionState = "connected" | "disconnected";

let redis: Redis | null = null;
let redisState: ConnectionState = "disconnected";

export function getRedisState(): ConnectionState {
  return redisState;
}

export function getRedis(): Redis | null {
  return redis;
}

export async function connectRedis(): Promise<void> {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
  });

  redis.on("error", () => {
    redisState = "disconnected";
  });

  redis.on("connect", () => {
    redisState = "connected";
  });

  try {
    await redis.connect();
    redisState = "connected";
    console.info("[apex-api] Redis connected");
  } catch (error) {
    redisState = "disconnected";
    console.warn("[apex-api] Redis unavailable — running without cache", error);
  }
}
