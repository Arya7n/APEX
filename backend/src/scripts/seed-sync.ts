import mongoose from "mongoose";
import { env } from "../config/env.js";
import { BrandModel, CategoryModel, BikeModel } from "../models/index.js";
import { getBikeDataProvider } from "../providers/index.js";
import { ingestBike } from "../services/ingest.js";
import { resolveMotorcycleImageUrl } from "../services/resolve-bike-image.js";
import { createSlug } from "../utils/slug.js";

/** Curated make/model queries — API Ninjas requires make or model (max 30 rows each). */
const SYNC_QUERIES: Array<{ brand: string; q?: string; year?: number }> = [
  { brand: "BMW", q: "S 1000" },
  { brand: "BMW", q: "M 1000" },
  { brand: "Ducati", q: "Panigale" },
  { brand: "Ducati", q: "Streetfighter" },
  { brand: "Ducati", q: "Monster" },
  { brand: "Kawasaki", q: "Ninja ZX" },
  { brand: "Kawasaki", q: "Z H2" },
  { brand: "Yamaha", q: "YZF-R" },
  { brand: "Yamaha", q: "MT-" },
  { brand: "Honda", q: "CBR" },
  { brand: "Honda", q: "CB1000" },
  { brand: "Suzuki", q: "GSX-R" },
  { brand: "Suzuki", q: "Hayabusa" },
  { brand: "Aprilia", q: "RSV4" },
  { brand: "Aprilia", q: "Tuono" },
  { brand: "Triumph", q: "Street Triple" },
  { brand: "Triumph", q: "Speed Triple" },
  { brand: "KTM", q: "1290" },
  { brand: "KTM", q: "990" },
  { brand: "MV Agusta", q: "F3" },
  { brand: "MV Agusta", q: "Brutale" },
  { brand: "Harley-Davidson", q: "Sportster" },
  { brand: "Indian", q: "FTR" },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await mongoose.connect(env.MONGODB_URI);
const provider = getBikeDataProvider();

let imported = 0;
let skipped = 0;
let images = 0;
const brands = new Set<string>();
const categories = new Set<string>();

try {
  for (const query of SYNC_QUERIES) {
    process.stdout.write(`Sync ${query.brand}${query.q ? ` / ${query.q}` : ""}… `);
    let rows;
    try {
      rows = await provider.getBikes(query);
    } catch (error) {
      console.info(`failed (${error instanceof Error ? error.message : String(error)})`);
      continue;
    }

    let batch = 0;
    for (const row of rows) {
      try {
        if (!row.imageUrl) {
          const imageUrl = await resolveMotorcycleImageUrl(row.brand, row.model, row.year);
          if (imageUrl) {
            row.imageUrl = imageUrl;
            images += 1;
          }
          await sleep(250);
        }
        await ingestBike(row);
        brands.add(row.brand);
        if (row.category) categories.add(row.category);
        imported += 1;
        batch += 1;
      } catch {
        skipped += 1;
      }
    }
    console.info(`${batch} bikes`);
    await sleep(350);
  }

  for (const name of brands) {
    await BrandModel.updateOne(
      { slug: createSlug(name) },
      { $set: { name, slug: createSlug(name) } },
      { upsert: true },
    );
  }
  for (const name of categories) {
    await CategoryModel.updateOne(
      { slug: createSlug(name) },
      { $set: { name, slug: createSlug(name) } },
      { upsert: true },
    );
  }

  const removed = await BikeModel.deleteMany({ source: "seed" });
  console.info(
    `Synced ${imported} bikes from ${env.BIKE_DATA_PROVIDER} (${images} images, ${skipped} skipped). Removed ${removed.deletedCount} static seed bikes.`,
  );
} finally {
  await mongoose.disconnect();
}
