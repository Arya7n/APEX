import mongoose from "mongoose";
import { env } from "./env.js";

export type ConnectionState = "connected" | "disconnected";

let mongoState: ConnectionState = "disconnected";

export function getMongoState(): ConnectionState {
  return mongoState;
}

export async function connectMongo(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    mongoState = "connected";
    console.info("[apex-api] MongoDB connected");
  } catch (error) {
    mongoState = "disconnected";
    console.warn("[apex-api] MongoDB unavailable — running without database", error);
  }
}
