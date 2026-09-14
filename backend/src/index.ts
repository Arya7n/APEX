import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { connectMongo } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { router } from "./routes/index.js";

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) return true; // non-browser / same-origin tooling
  const normalized = origin.replace(/\/$/, "");
  if (env.webOrigins.includes(normalized)) return true;
  if (
    env.ALLOW_VERCEL_PREVIEWS &&
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized)
  ) {
    return true;
  }
  return false;
}

async function bootstrap() {
  await Promise.all([connectMongo(), connectRedis()]);

  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }
        console.warn(`[apex-api] blocked CORS origin: ${origin}`);
        callback(null, false);
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(router);
  app.use(notFound);
  app.use(errorHandler);

  app.listen(env.listenPort, () => {
    console.info(`[apex-api] listening on :${env.listenPort}`);
    console.info(`[apex-api] CORS origins: ${env.webOrigins.join(", ") || "(none)"}`);
  });
}

bootstrap().catch((error) => {
  console.error("[apex-api] failed to start", error);
  process.exit(1);
});
