import { PERFORMANCE_INDEX_WEIGHTS } from "../config/constants.js";

export function calculatePowerToWeight(power: number | null, weight: number | null): number | null {
  return power != null && weight != null && weight > 0 ? power / weight : null;
}
export function calculateTorqueToWeight(torque: number | null, weight: number | null): number | null {
  return torque != null && weight != null && weight > 0 ? torque / weight : null;
}
export function calculateDisplacementToWeight(displacement: number | null, weight: number | null): number | null {
  return displacement != null && weight != null && weight > 0 ? displacement / weight : null;
}

/**
 * Weighted 0-100 index. Inputs are normalized against transparent reference
 * ceilings (250 hp, 1.3 hp/kg, 350 km/h, 0.8 Nm/kg) and capped at 100.
 */
export function calculatePerformanceScore(
  power: number | null,
  powerToWeight: number | null,
  topSpeed: number | null,
  torqueToWeight: number | null,
): number | null {
  const values = [
    [power, 250, PERFORMANCE_INDEX_WEIGHTS.power],
    [powerToWeight, 1.3, PERFORMANCE_INDEX_WEIGHTS.powerToWeight],
    [topSpeed, 350, PERFORMANCE_INDEX_WEIGHTS.topSpeed],
    [torqueToWeight, 0.8, PERFORMANCE_INDEX_WEIGHTS.torqueToWeight],
  ] as const;
  const available = values.filter(([v]) => v != null);
  if (!available.length) return null;
  const weight = available.reduce((sum, entry) => sum + entry[2], 0);
  return Number((available.reduce((sum, [v, ceiling, w]) =>
    sum + Math.min(1, (v as number) / ceiling) * w, 0) / weight * 100).toFixed(1));
}
