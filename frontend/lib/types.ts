export type NullableNumber = number | null;
export interface BikeImage { id: string; provider?: string; path: string; alt: string; role?: string }
export interface Bike {
  _id?: string;
  externalId: string;
  source: string;
  slug: string;
  brand: string;
  model: string;
  variant: string | null;
  year: number | null;
  category: string | null;
  description: string | null;
  images: BikeImage[];
  engine: { displacement: NullableNumber; configuration: string | null; cylinders: NullableNumber; cooling: string | null; compressionRatio: string | null; bore: NullableNumber; stroke: NullableNumber; redline: NullableNumber };
  performance: { horsepower: NullableNumber; torque: NullableNumber; topSpeed: NullableNumber; zeroTo100: NullableNumber };
  dimensions: { weight: NullableNumber; seatHeight: NullableNumber; wheelbase: NullableNumber; fuelCapacity: NullableNumber; length: NullableNumber };
  chassis: { frame: string | null; frontSuspension: string | null; rearSuspension: string | null; frontBrake: string | null; rearBrake: string | null; frontTyre: string | null; rearTyre: string | null };
  electronics: { ridingModes: string[]; tractionControl: boolean | null; abs: boolean | null; quickshifter: boolean | null; launchControl: boolean | null; engineBrakeControl: boolean | null };
  aerodynamics: { winglets: boolean | null; downforce: string | null };
  pricing: { basePrice: NullableNumber; currency: string | null };
  derivedMetrics: { horsepowerPerKg: NullableNumber; torquePerKg: NullableNumber; displacementPerKg: NullableNumber; performanceScore: NullableNumber };
  metadata?: { importedAt: string; updatedAt: string; sourceUpdatedAt: string | null };
}

export interface BikeCardData {
  slug: string; brand: string; model: string; year: number | null; category: string | null;
  engineLabel: string | null; horsepower: number | null; weight: number | null;
  topSpeed: number | null; displacement: number | null; imageId: string; imagePath?: string;
}

export interface Article { _id?: string; name?: string; slug: string; title: string; excerpt: string | null; content: string; publishedAt: string; createdAt?: string }
export interface Paginated<T> { items: T[]; page: number; limit: number; total: number; pages: number }
export type RankingKind = "fastest" | "power" | "lightest" | "power-to-weight" | "torque";
export interface BikeStats { performanceRank: number; derivedMetrics: Bike["derivedMetrics"] }
export interface ComparisonResult { bikes: Bike[]; deltas: Array<{ horsepower: number; weight: number; topSpeed: number }>; winners: Record<string, string | number | null> }
export interface Recommendation { bike: Bike; match: number; reasons: string[] }
export interface Questionnaire { purpose?: string; engine?: string; performance?: "low" | "medium" | "high"; weight?: "light" | "medium" | "heavy"; experience?: "beginner" | "intermediate" | "expert" }
export interface SearchResult { bikes: Bike[]; articles: Article[]; brands: Array<{ _id?: string; name: string; slug: string }> }
export interface User { _id: string; email: string; name: string; role: "user" | "admin" }
export interface AuthResult { user: User; accessToken: string; refreshToken?: string }
export interface GarageEntry { _id: string; bike: Bike; nickname: string | null; notes: string | null; category?: "dream" | "track" | "street" }
export interface Favorite { _id: string; bike: Bike }
export interface AdminStats { bikes: number; users: number; articles: number }

export interface ApiHealth {
  status: "ok" | "degraded";
  service: "apex-api";
  version: string;
  uptime: number;
  mongo: "connected" | "disconnected";
  redis: "connected" | "disconnected";
}
