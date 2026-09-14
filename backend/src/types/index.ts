export type BikeCategory =
  | "superbike"
  | "supersport"
  | "sport"
  | "naked"
  | "hyper-naked"
  | "track"
  | "legend";

export type BikeSource = "bikespecs" | "manual";

export interface BikeEngine {
  displacement: number | null;
  configuration: string | null;
  cylinders: number | null;
  cooling: string | null;
  compressionRatio: string | null;
  bore: number | null;
  stroke: number | null;
  redline: number | null;
}

export interface BikePerformance {
  horsepower: number | null;
  torque: number | null;
  topSpeed: number | null;
  zeroTo100: number | null;
}

export interface BikeDimensions {
  weight: number | null;
  seatHeight: number | null;
  wheelbase: number | null;
  fuelCapacity: number | null;
}

export interface BikeChassis {
  frame: string | null;
  frontSuspension: string | null;
  rearSuspension: string | null;
  frontBrake: string | null;
  rearBrake: string | null;
  frontTyre: string | null;
  rearTyre: string | null;
}

export interface BikeElectronics {
  ridingModes: string[];
  tractionControl: boolean | null;
  abs: boolean | null;
  quickshifter: boolean | null;
  launchControl: boolean | null;
  engineBrakeControl: boolean | null;
}

export interface BikeAerodynamics {
  winglets: boolean | null;
  downforce: string | null;
}

export interface BikePricing {
  basePrice: number | null;
  currency: string | null;
}

export interface BikeDerivedMetrics {
  horsepowerPerKg: number | null;
  torquePerKg: number | null;
  displacementPerKg: number | null;
  performanceScore: number | null;
}

export interface BikeMetadata {
  importedAt: string;
  updatedAt: string;
  sourceUpdatedAt: string | null;
}

export interface BikeImageRef {
  id: string;
  provider: "local" | "cloudinary" | "s3" | "remote";
  path: string;
  alt: string;
  role: "hero" | "card" | "gallery" | "og";
}

/** Canonical APEX bike document. Nullable fields were unavailable at source. */
export interface Bike {
  externalId: string;
  source: BikeSource;
  brand: string;
  model: string;
  variant: string | null;
  year: number | null;
  slug: string;
  category: BikeCategory | null;
  description: string | null;
  images: BikeImageRef[];
  engine: BikeEngine;
  performance: BikePerformance;
  dimensions: BikeDimensions;
  chassis: BikeChassis;
  electronics: BikeElectronics;
  aerodynamics: BikeAerodynamics;
  pricing: BikePricing;
  derivedMetrics: BikeDerivedMetrics;
  metadata: BikeMetadata;
}

export interface ApiHealth {
  status: "ok" | "degraded";
  service: "apex-api";
  version: string;
  uptime: number;
  mongo: "connected" | "disconnected";
  redis: "connected" | "disconnected";
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
