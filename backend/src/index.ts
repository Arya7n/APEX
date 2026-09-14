import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { connectMongo } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { router } from "./routes/index.js";

async function bootstrap() {
  await Promise.all([connectMongo(), connectRedis()]);

  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
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

  app.listen(env.API_PORT, () => {
    console.info(`[apex-api] listening on http://localhost:${env.API_PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("[apex-api] failed to start", error);
  process.exit(1);
});
