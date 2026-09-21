import type { Request, Response } from "express";
import type { ApiHealth } from "../types/index.js";
import { getMongoState } from "../config/db.js";
import { getRedisState } from "../config/redis.js";

const startedAt = Date.now();

export function healthHandler(_req: Request, res: Response) {
  const mongo = getMongoState();
  const redis = getRedisState();
  const payload: ApiHealth = {
    status: mongo === "connected" ? "ok" : "degraded",
    service: "apex-api",
    version: "0.1.0",
    uptime: Math.round((Date.now() - startedAt) / 1000),
    mongo,
    redis,
  };

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(payload);
}
