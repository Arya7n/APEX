import { BikeModel } from "../models/index.js";
import { PAGINATION } from "../config/constants.js";
export interface BikeFilters { brand?: string; category?: string; minPower?: number; maxPower?: number; minWeight?: number; maxWeight?: number; year?: number; engine?: string; q?: string; sort?: string; page?: number; limit?: number }
export async function listBikes(input: BikeFilters) {
  const filter: Record<string, unknown> = {};
  if (input.brand) filter.brand = new RegExp(`^${input.brand}$`, "i");
  if (input.category) filter.category = input.category;
  if (input.year) filter.year = input.year;
  if (input.engine) filter["engine.configuration"] = new RegExp(input.engine, "i");
  if (input.q) filter.$text = { $search: input.q };
  const range = (min?: number, max?: number) => ({ ...(min != null ? { $gte: min } : {}), ...(max != null ? { $lte: max } : {}) });
  if (input.minPower != null || input.maxPower != null) filter["performance.horsepower"] = range(input.minPower, input.maxPower);
  if (input.minWeight != null || input.maxWeight != null) filter["dimensions.weight"] = range(input.minWeight, input.maxWeight);
  const sorts: Record<string, Record<string, 1 | -1>> = { power_desc: { "performance.horsepower": -1 }, power_asc: { "performance.horsepower": 1 }, weight_asc: { "dimensions.weight": 1 }, speed_desc: { "performance.topSpeed": -1 }, year_desc: { year: -1 } };
  const page = Math.max(1, input.page ?? 1), limit = Math.min(PAGINATION.maxLimit, Math.max(1, input.limit ?? PAGINATION.defaultLimit));
  const [items, total] = await Promise.all([BikeModel.find(filter).sort(sorts[input.sort ?? ""] ?? { brand: 1, model: 1 }).skip((page - 1) * limit).limit(limit).lean(), BikeModel.countDocuments(filter)]);
  return { items, page, limit, total, pages: Math.ceil(total / limit) };
}
