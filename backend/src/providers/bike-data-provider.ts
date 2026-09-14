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
  raw: unknown;
}

export interface BikeQuery {
  q?: string;
  brand?: string;
  category?: string;
  year?: number;
  page?: number;
  limit?: number;
}

export interface BikeDataProvider {
  getBike(id: string): Promise<ExternalBike>;
  searchBikes(query: string): Promise<ExternalBike[]>;
  getBikes(params: BikeQuery): Promise<ExternalBike[]>;
}
