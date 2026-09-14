import { z } from "zod";
import { BikeModel } from "../models/index.js";
import type { ExternalBike } from "../providers/bike-data-provider.js";
import { normalizeBike } from "./normalize-bike.js";
import { invalidateBikeCache } from "./cache.js";
const required = z.object({ externalId: z.string().min(1), brand: z.string().min(1), model: z.string().min(1), slug: z.string().min(1) }).passthrough();
function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split("."); let node = target;
  for (const key of parts.slice(0, -1)) node = (node[key] ??= {}) as Record<string, unknown>;
  node[parts.at(-1)!] = value;
}
export async function ingestBike(external: ExternalBike) {
  const draft = required.parse(normalizeBike(external)) as Record<string, unknown>;
  const existing = await BikeModel.findOne({ source: external.source, externalId: external.externalId }).lean();
  if (existing?.overrides) for (const [path, override] of Object.entries(existing.overrides as Record<string, { isOverridden?: boolean; overrideValue?: unknown }>)) if (override.isOverridden) setPath(draft, path, override.overrideValue);
  draft.overrides = existing?.overrides ?? {};
  const bike = await BikeModel.findOneAndUpdate({ source: external.source, externalId: external.externalId }, { $set: draft }, { upsert: true, new: true, runValidators: true });
  await invalidateBikeCache(String(draft.slug));
  return bike;
}
