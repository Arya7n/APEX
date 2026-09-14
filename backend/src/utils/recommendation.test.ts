import { describe, expect, it } from "vitest";
import { scoreBike } from "./recommendation.js";
describe("recommendations", () => {
  it("provides transparent matches", () => {
    const result = scoreBike({ category: "naked", performance: { horsepower: 60 }, dimensions: { weight: 170 } }, { purpose: "street", experience: "beginner", weight: "light" });
    expect(result.match).toBe(100);
    expect(result.reasons).toHaveLength(3);
  });
});
