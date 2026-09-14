import { BikeModel } from "../models/index.js";
const fields = { fastest: "performance.topSpeed", power: "performance.horsepower", lightest: "dimensions.weight", "power-to-weight": "derivedMetrics.horsepowerPerKg", torque: "performance.torque" } as const;
export type Ranking = keyof typeof fields;
export function getRanking(kind: Ranking, limit = 10) {
  const field = fields[kind];
  return BikeModel.find({ [field]: { $ne: null } }).sort({ [field]: kind === "lightest" ? 1 : -1 }).limit(limit).lean();
}
