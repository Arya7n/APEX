import { describe, expect, it } from "vitest";
import { normalizeDisplacement, normalizeHorsepower, normalizeTorque, normalizeWeight } from "./units.js";
describe("unit normalization", () => {
  it("parses provider strings", () => {
    expect(normalizeHorsepower("52.3 HP")).toBe(52.3);
    expect(normalizeWeight("192.1 kg")).toBe(192.1);
    expect(normalizeDisplacement("649.0 ccm")).toBe(649);
    expect(normalizeTorque("56.0 Nm")).toBe(56);
  });
  it("returns null when unavailable", () => expect(normalizeWeight(null)).toBeNull());
});
