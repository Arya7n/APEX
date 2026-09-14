type Raw = string | number | null | undefined;

function numberFrom(value: Raw): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export const normalizeHorsepower = numberFrom;
export const normalizeTorque = numberFrom;
export const normalizeWeight = numberFrom;
export const normalizeDisplacement = numberFrom;
export const normalizeTopSpeed = numberFrom;
export const normalizeSeatHeight = numberFrom;
export const normalizeFuelCapacity = numberFrom;
export const normalizeLengthMm = numberFrom;
