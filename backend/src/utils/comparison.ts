type ComparableBike = { slug?: string; performance?: { horsepower?: number | null; torque?: number | null; topSpeed?: number | null } | null; dimensions?: { weight?: number | null } | null; derivedMetrics?: { horsepowerPerKg?: number | null } | null };
const winner = (bikes: ComparableBike[], read: (b: ComparableBike) => number | null | undefined, lower = false) => {
  const valid = bikes.map((bike, index) => ({ bike, index, value: read(bike) })).filter((x): x is typeof x & { value: number } => x.value != null);
  if (!valid.length) return null;
  valid.sort((a, b) => lower ? a.value - b.value : b.value - a.value);
  return valid[0]?.bike.slug ?? valid[0]?.index ?? null;
};
export function compareBikes(bikes: ComparableBike[]) {
  if (bikes.length < 2 || bikes.length > 4) throw new Error("Compare 2-4 bikes");
  const base = bikes[0]!;
  return {
    deltas: bikes.slice(1).map((bike) => ({
      horsepower: (bike.performance?.horsepower ?? 0) - (base.performance?.horsepower ?? 0),
      weight: (bike.dimensions?.weight ?? 0) - (base.dimensions?.weight ?? 0),
      topSpeed: (bike.performance?.topSpeed ?? 0) - (base.performance?.topSpeed ?? 0),
    })),
    winners: {
      powerWinner: winner(bikes, b => b.performance?.horsepower),
      weightWinner: winner(bikes, b => b.dimensions?.weight, true),
      topSpeedWinner: winner(bikes, b => b.performance?.topSpeed),
      powerToWeightWinner: winner(bikes, b => b.derivedMetrics?.horsepowerPerKg),
    },
  };
}
