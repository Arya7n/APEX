import mongoose from "mongoose";
import { env } from "../config/env.js";
import { BikeModel } from "../models/index.js";
import { resolveMotorcycleImageUrl } from "../services/resolve-bike-image.js";
import { createSlug } from "../utils/slug.js";
import { invalidateBikeCache } from "../services/cache.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await mongoose.connect(env.MONGODB_URI);
try {
  const bikes = await BikeModel.find({
    $or: [{ images: { $size: 0 } }, { images: { $exists: false } }, { "images.0.path": { $exists: false } }],
  })
    .select("brand model year slug images")
    .lean();

  console.info(`Backfilling images for ${bikes.length} bikes…`);
  let updated = 0;
  for (const bike of bikes) {
    const imageUrl = await resolveMotorcycleImageUrl(bike.brand, bike.model, bike.year);
    if (!imageUrl) {
      process.stdout.write(".");
      await sleep(150);
      continue;
    }
    await BikeModel.updateOne(
      { _id: bike._id },
      {
        $set: {
          images: [
            {
              id: createSlug(bike.brand, bike.model, bike.year),
              provider: "remote",
              path: imageUrl,
              alt: `${bike.brand} ${bike.model}`,
              role: "hero",
            },
          ],
          "metadata.updatedAt": new Date().toISOString(),
        },
      },
    );
    await invalidateBikeCache(bike.slug);
    updated += 1;
    process.stdout.write("+");
    await sleep(200);
  }
  console.info(`\nUpdated ${updated}/${bikes.length} bikes with remote images.`);
} finally {
  await mongoose.disconnect();
}
