import { describe, expect, it } from "vitest";
import { calculatePerformanceScore, calculatePowerToWeight } from "./performance.js";
describe("performance", () => {
  it("calculates ratios", () => expect(calculatePowerToWeight(200, 200)).toBe(1));
  it("does not invent missing ratios", () => expect(calculatePowerToWeight(null, 200)).toBeNull());
  it("returns a bounded score", () => expect(calculatePerformanceScore(250, 1.3, 350, .8)).toBe(100));
});
