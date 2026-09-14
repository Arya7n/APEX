import { describe, expect, it } from "vitest";
import { compareBikes } from "./comparison.js";
describe("comparison", () => {
  it("selects metric winners", () => {
    const result = compareBikes([
      { slug: "a", performance: { horsepower: 100, topSpeed: 200 }, dimensions: { weight: 180 }, derivedMetrics: { horsepowerPerKg: .55 } },
      { slug: "b", performance: { horsepower: 150, topSpeed: 240 }, dimensions: { weight: 200 }, derivedMetrics: { horsepowerPerKg: .75 } },
    ]);
    expect(result.winners.powerWinner).toBe("b");
    expect(result.winners.weightWinner).toBe("a");
  });
});
