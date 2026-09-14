export interface Questionnaire { purpose?: string; engine?: string; performance?: "low" | "medium" | "high"; weight?: "light" | "medium" | "heavy"; experience?: "beginner" | "intermediate" | "expert" }
type Candidate = { category?: string | null; engine?: { configuration?: string | null; displacement?: number | null } | null; performance?: { horsepower?: number | null } | null; dimensions?: { weight?: number | null } | null };
export function scoreBike(bike: Candidate, q: Questionnaire) {
  let earned = 0, possible = 0;
  const reasons: string[] = [];
  const add = (matches: boolean, reason: string, points = 20) => { possible += points; if (matches) { earned += points; reasons.push(reason); } };
  if (q.purpose) add(bike.category === q.purpose || (q.purpose === "street" && ["naked", "sport", "hyper-naked"].includes(bike.category ?? "")), `Category suits ${q.purpose}`);
  if (q.engine) add((bike.engine?.configuration ?? "").toLowerCase().includes(q.engine.toLowerCase()), `Matches ${q.engine} engine preference`);
  if (q.performance) { const hp = bike.performance?.horsepower; add(hp != null && (q.performance === "low" ? hp < 70 : q.performance === "medium" ? hp >= 70 && hp < 150 : hp >= 150), `${q.performance} performance range`); }
  if (q.weight) { const kg = bike.dimensions?.weight; add(kg != null && (q.weight === "light" ? kg < 180 : q.weight === "medium" ? kg >= 180 && kg < 220 : kg >= 220), `${q.weight} weight range`); }
  if (q.experience) { const hp = bike.performance?.horsepower; add(hp != null && (q.experience === "beginner" ? hp <= 70 : q.experience === "intermediate" ? hp <= 150 : true), `Appropriate for ${q.experience} riders`); }
  return { match: possible ? Math.round(earned / possible * 100) : 0, reasons };
}
