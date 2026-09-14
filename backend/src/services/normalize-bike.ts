import type { ExternalBike } from "../providers/bike-data-provider.js";
import type { Bike, BikeCategory, BikeSource } from "../types/index.js";
import { createSlug } from "../utils/slug.js";
import { calculateDisplacementToWeight, calculatePerformanceScore, calculatePowerToWeight, calculateTorqueToWeight } from "../utils/performance.js";
import { normalizeDisplacement, normalizeFuelCapacity, normalizeHorsepower, normalizeLengthMm, normalizeSeatHeight, normalizeTopSpeed, normalizeTorque, normalizeWeight } from "../utils/units.js";

const categories: Record<string, BikeCategory> = {
  superbike: "superbike", supersport: "supersport", sport: "sport", naked: "naked",
  "hyper naked": "hyper-naked", "hyper-naked": "hyper-naked", track: "track", legend: "legend",
};

export function normalizeBike(raw: ExternalBike): Bike {
  const horsepower = normalizeHorsepower(raw.power);
  const torque = normalizeTorque(raw.torque);
  const weight = normalizeWeight(raw.weight);
  const displacement = normalizeDisplacement(raw.displacement);
  const topSpeed = normalizeTopSpeed(raw.topSpeed);
  const horsepowerPerKg = calculatePowerToWeight(horsepower, weight);
  const torquePerKg = calculateTorqueToWeight(torque, weight);
  const now = new Date().toISOString();
  const imageId = raw.imageId ?? null;
  return {
    externalId: raw.externalId, source: raw.source as BikeSource, brand: raw.brand.trim(), model: raw.model.trim(),
    variant: raw.variant ?? null, year: raw.year ?? null,
    slug: createSlug(raw.brand, raw.model, raw.variant, raw.year), category: raw.category ? categories[raw.category.toLowerCase()] ?? null : null,
    description: raw.description ?? null,
    images: imageId
      ? [
          {
            id: imageId,
            provider: "local",
            path: `/images/machines/${imageId}.png`,
            alt: `${raw.brand} ${raw.model}`,
            role: "hero",
          },
        ]
      : [],
    engine: { displacement, configuration: raw.engineConfiguration ?? null, cylinders: raw.cylinders ?? null, cooling: raw.cooling ?? null, compressionRatio: null, bore: null, stroke: null, redline: null },
    performance: { horsepower, torque, topSpeed, zeroTo100: null },
    dimensions: { weight, seatHeight: normalizeSeatHeight(raw.seatHeight), wheelbase: null, fuelCapacity: normalizeFuelCapacity(raw.fuelCapacity), length: normalizeLengthMm(raw.length) },
    chassis: { frame: null, frontSuspension: null, rearSuspension: null, frontBrake: null, rearBrake: null, frontTyre: null, rearTyre: null },
    electronics: { ridingModes: [], tractionControl: null, abs: null, quickshifter: null, launchControl: null, engineBrakeControl: null },
    aerodynamics: { winglets: null, downforce: null }, pricing: { basePrice: null, currency: null },
    derivedMetrics: { horsepowerPerKg, torquePerKg, displacementPerKg: calculateDisplacementToWeight(displacement, weight), performanceScore: calculatePerformanceScore(horsepower, horsepowerPerKg, topSpeed, torquePerKg) },
    overrides: {}, metadata: { importedAt: now, updatedAt: now, sourceUpdatedAt: raw.sourceUpdatedAt ?? null },
  };
}
