import mongoose from "mongoose";
import bikes from "../data/seed-bikes.json" with { type: "json" };
import { env } from "../config/env.js";
import { ArticleModel, BrandModel, CategoryModel } from "../models/index.js";
import { ingestBike } from "../services/ingest.js";
import type { ExternalBike } from "../providers/bike-data-provider.js";
import { createSlug } from "../utils/slug.js";

const articles = [
  {
    title: "What is horsepower?",
    excerpt: "How peak power is measured and why it is only one part of the story.",
    content:
      "Horsepower is a unit of power — work over time. On motorcycles it is usually quoted as crankshaft or rear-wheel peak output. APEX stores horsepower in hp after converting from PS or kW when a source provides those units. Higher peak power does not automatically mean a stronger machine on the road; delivery, gearing, and mass matter.",
  },
  {
    title: "What is torque?",
    excerpt: "Rotational force, midrange drive, and how APEX normalizes Nm.",
    content:
      "Torque measures rotational force. Motorcycles often feel strong because of midrange torque rather than peak horsepower alone. APEX canonicalizes torque to Newton-metres (Nm), converting from lb-ft when needed. Torque-to-weight is often more revealing than raw torque.",
  },
  {
    title: "What does CC mean?",
    excerpt: "Displacement as swept volume — and why bigger is not always better.",
    content:
      "CC means cubic centimetres of engine displacement — the swept volume of the cylinders. APEX stores displacement in cc. More displacement can mean more air and fuel per cycle, but architecture, boost, and tuning decide the result.",
  },
  {
    title: "Inline-4 vs V4",
    excerpt: "Two dominant superbike architectures and their character.",
    content:
      "Inline-four engines are compact, high-revving, and common on Japanese superbikes. V4 layouts, used by Ducati and Aprilia, package differently and often deliver a distinct firing character. Neither is universally better — packaging, mass centralization, and electronics shape the experience.",
  },
  {
    title: "Quickshifter",
    excerpt: "Clutchless upshifts and downshifts explained.",
    content:
      "A quickshifter momentarily cuts ignition or fuel (and may blip throttle on downshifts) so gears can be changed without the clutch. It is a rider aid, not a substitute for understanding gearbox loads.",
  },
  {
    title: "Ride-by-wire",
    excerpt: "Electronic throttle as the foundation of modern riding modes.",
    content:
      "Ride-by-wire replaces a direct cable with sensors and actuators. That enables riding modes, wheelie control, and launch systems. The throttle becomes a request — the ECU decides how much torque to allow.",
  },
  {
    title: "Traction control",
    excerpt: "How TC intervenes without claiming magic.",
    content:
      "Traction control compares wheel speeds and other sensors, then reduces torque when slip exceeds a threshold. Levels and IMU-based cornering logic vary by manufacturer. TC is a safety net, not permission to ignore grip.",
  },
  {
    title: "Cornering ABS",
    excerpt: "Braking intervention that accounts for lean angle.",
    content:
      "Cornering ABS uses inertial sensors to modulate brake pressure while leaned over. It can prevent lockups that standard ABS might mishandle mid-corner. It does not eliminate physics or poor line choice.",
  },
  {
    title: "Launch control",
    excerpt: "Controlled starts for track use.",
    content:
      "Launch control manages RPM and torque during a standing start. It is typically a track feature. Street use still depends on surface, tyre temperature, and rider input.",
  },
  {
    title: "Engine braking",
    excerpt: "Why deceleration torque matters into a corner.",
    content:
      "Engine braking is the drag produced when closing the throttle. Engine brake control systems can smooth or reduce that effect to stabilize the rear. Different bikes feel very different on entry.",
  },
  {
    title: "Winglets",
    excerpt: "Aerodynamic surfaces on modern superbikes.",
    content:
      "Winglets generate downforce at speed, aiming to keep the front planted under acceleration. They add complexity and drag. APEX records winglet presence when known — never invents aero claims.",
  },
  {
    title: "Aerodynamics",
    excerpt: "Drag, stability, and why top speed needs context.",
    content:
      "Fairings, rider position, and aero appendages change both drag and stability. Published top speeds are often estimated or condition-dependent; APEX leaves top speed null when a trusted source does not provide it.",
  },
  {
    title: "Compression ratio",
    excerpt: "How much the mixture is squeezed before ignition.",
    content:
      "Compression ratio compares cylinder volume at BDC to TDC. Higher ratios can improve efficiency and power but demand appropriate fuel and engine management. APEX stores ratio as a string when available.",
  },
  {
    title: "Bore and stroke",
    excerpt: "Over-square vs under-square character.",
    content:
      "Bore is cylinder diameter; stroke is piston travel. Over-square (larger bore) engines often prefer high RPM. Longer-stroke engines may emphasize midrange. Both interact with valve area and crank design.",
  },
  {
    title: "Power-to-weight ratio",
    excerpt: "Why APEX emphasizes hp/kg over brochure adjectives.",
    content:
      "Power-to-weight divides horsepower by mass. It is a transparent ratio, not a verdict on the “best” bike. APEX Performance Index combines power, power-to-weight, top speed (when known), and torque-to-weight with published weights — never as an objective ranking of worth.",
  },
];

await mongoose.connect(env.MONGODB_URI);
try {
  for (const bike of bikes as ExternalBike[]) await ingestBike(bike);
  for (const name of [...new Set(bikes.map((b) => b.brand))]) {
    await BrandModel.updateOne(
      { slug: createSlug(name) },
      { $set: { name, slug: createSlug(name) } },
      { upsert: true },
    );
  }
  for (const name of [...new Set(bikes.map((b) => b.category).filter(Boolean))]) {
    await CategoryModel.updateOne(
      { slug: createSlug(String(name)) },
      { $set: { name, slug: createSlug(String(name)) } },
      { upsert: true },
    );
  }
  await ArticleModel.deleteMany({ title: /^Motorcycle intelligence guide/ });
  for (const article of articles) {
    await ArticleModel.updateOne(
      { slug: createSlug(article.title) },
      {
        $set: {
          name: article.title,
          title: article.title,
          slug: createSlug(article.title),
          excerpt: article.excerpt,
          content: article.content,
          publishedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }
  console.info(
    `Seeded ${bikes.length} bikes, ${new Set(bikes.map((b) => b.brand)).size} brands, ${articles.length} articles`,
  );
} finally {
  await mongoose.disconnect();
}
