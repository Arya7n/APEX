export const API_DEFAULT_PORT = 4000;

export const CACHE_TTL_SECONDS = {
  bikeDetail: 60 * 30,
  search: 60 * 5,
  ranking: 60 * 15,
  comparison: 60 * 10,
  brandList: 60 * 60,
  categoryList: 60 * 60,
} as const;

export const CACHE_KEYS = {
  bike: (slug: string) => `bike:${slug}`,
  search: (query: string, filters: string) => `search:${query}:${filters}`,
  ranking: (category: string) => `ranking:${category}`,
  comparison: (bikeIds: string[]) => `comparison:${[...bikeIds].sort().join(",")}`,
} as const;

/** APEX Performance Index weights. Transparent, not an objective ranking of "best". */
export const PERFORMANCE_INDEX_WEIGHTS = {
  power: 0.3,
  powerToWeight: 0.3,
  topSpeed: 0.2,
  torqueToWeight: 0.2,
} as const;

export const BIKE_CATEGORIES = [
  "superbike",
  "supersport",
  "sport",
  "naked",
  "hyper-naked",
  "track",
  "legend",
] as const;

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 50,
} as const;
