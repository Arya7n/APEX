export interface BikeCardData {
  slug: string;
  brand: string;
  model: string;
  year: number | null;
  category: string | null;
  engineLabel: string | null;
  horsepower: number | null;
  weight: number | null;
  topSpeed: number | null;
  displacement: number | null;
  imageId: string;
}

export interface ApiHealth {
  status: "ok" | "degraded";
  service: "apex-api";
  version: string;
  uptime: number;
  mongo: "connected" | "disconnected";
  redis: "connected" | "disconnected";
}
