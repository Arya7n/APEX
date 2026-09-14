/**
 * External bike records as seen by APEX *before* normalization.
 * Provider-specific payloads must be mapped into this shape.
 */
export interface ExternalBike {
  externalId: string;
  source: string;
  brand: string;
  model: string;
  variant?: string | null;
  year?: number | null;
  category?: string | null;
  description?: string | null;
  power?: string | number | null;
  torque?: string | number | null;
  weight?: string | number | null;
  displacement?: string | number | null;
  topSpeed?: string | number | null;
  seatHeight?: string | number | null;
  fuelCapacity?: string | number | null;
  length?: string | number | null;
  wheelbase?: string | number | null;
  engineConfiguration?: string | null;
  cylinders?: number | null;
  cooling?: string | null;
  compressionRatio?: string | null;
  bore?: string | number | null;
  stroke?: string | number | null;
  frame?: string | null;
  frontSuspension?: string | null;
  rearSuspension?: string | null;
  frontBrake?: string | null;
  rearBrake?: string | null;
  frontTyre?: string | null;
  rearTyre?: string | null;
  imageId?: string | null;
  imageUrl?: string | null;
  sourceUpdatedAt?: string | null;
  raw?: unknown;
}

export interface BikeQuery {
  q?: string;
  brand?: string;
  category?: string;
  year?: number;
  page?: number;
  limit?: number;
  offset?: number;
}

export interface BikeDataProvider {
  getBike(id: string): Promise<ExternalBike>;
  searchBikes(query: string): Promise<ExternalBike[]>;
  getBikes(params: BikeQuery): Promise<ExternalBike[]>;
}
