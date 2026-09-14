import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";

loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), "../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/apex"),
  REDIS_URL: z.string().default("redis://127.0.0.1:6379"),
  BIKE_DATA_PROVIDER: z.string().default("bikespecs"),
  BIKESPECS_API_KEY: z.string().optional().default(""),
  BIKESPECS_API_BASE_URL: z.string().default("https://api.bikespecs.org"),
  API_NINJAS_API_KEY: z.string().optional().default(""),
  API_NINJAS_API_BASE_URL: z.string().default("https://api.api-ninjas.com"),
  JWT_SECRET: z.string().min(16).default("apex-dev-only-change-me-now"),
  JWT_REFRESH_SECRET: z.string().min(16).default("apex-refresh-dev-change-me"),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("30d"),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;

if (env.NODE_ENV === "production" && env.JWT_SECRET.includes("change-me")) {
  throw new Error("JWT_SECRET must be set to a strong secret in production");
}
