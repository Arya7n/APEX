"use client";

import { useEffect, useState } from "react";
import { compareBikes, searchBikes } from "@/lib/api";
import type { Bike, ComparisonResult } from "@/lib/types";

const metrics = [
  ["Power", (b: Bike) => b.performance.horsepower, "hp"],
  ["Torque", (b: Bike) => b.performance.torque, "Nm"],
  ["Top speed", (b: Bike) => b.performance.topSpeed, "km/h"],
  ["Weight", (b: Bike) => b.dimensions.weight, "kg"],
  ["Power / kg", (b: Bike) => b.derivedMetrics.horsepowerPerKg, ""],
  ["APEX Performance Index", (b: Bike) => b.derivedMetrics.performanceScore, ""],
] as const;

export function CompareClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Bike[]>([]);
  const [selected, setSelected] = useState<Bike[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = setTimeout(() => searchBikes(query).then((r) => setResults(r.items)).catch(() => setResults([])), 250);
    return () => clearTimeout(timer);
  }, [query]);
  const add = (bike: Bike) => { if (selected.length < 4 && !selected.some((b) => b.slug === bike.slug)) setSelected([...selected, bike]); setQuery(""); };
  const run = async () => { setError(""); try { setComparison(await compareBikes(selected.map((b) => b.slug))); } catch (e) { setError(e instanceof Error ? e.message : "Comparison failed"); } };
  return <section className="px-5 pb-24 md:px-10">
    <div className="relative max-w-xl">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search and add 2–4 machines" className="w-full border border-line bg-surface px-4 py-3 outline-none focus:border-accent" />
      {query.trim().length >= 2 && results.length ? <div className="absolute z-20 mt-1 w-full border border-line bg-surface">{results.map((bike) => <button key={bike.slug} onClick={() => add(bike)} className="block w-full border-b border-line p-3 text-left hover:bg-surface-2">{bike.brand} {bike.model}</button>)}</div> : null}
    </div>
    <div className="mt-5 flex flex-wrap gap-2">{selected.map((bike) => <button key={bike.slug} onClick={() => { setSelected(selected.filter((b) => b.slug !== bike.slug)); setComparison(null); }} className="border border-line px-4 py-2 text-sm">{bike.brand} {bike.model} ×</button>)}</div>
    <button disabled={selected.length < 2} onClick={run} className="mt-6 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest disabled:opacity-30">Calculate comparison</button>
    {error ? <p className="mt-5 text-accent">{error}</p> : null}
    {comparison ? <div className="mt-12 overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left">
      <thead><tr><th className="border-b border-line p-4 text-muted">Metric</th>{comparison.bikes.map((b) => <th key={b.slug} className="border-b border-line p-4 font-display text-xl">{b.brand}<br />{b.model}</th>)}</tr></thead>
      <tbody>{metrics.map(([label, read, suffix]) => { const values = comparison.bikes.map((b) => read(b)); const max = Math.max(...values.map((v) => v ?? 0), 1); return <tr key={label}><th className="border-b border-line p-4 text-xs uppercase tracking-widest text-muted">{label}</th>{comparison.bikes.map((bike, i) => <td key={bike.slug} className="border-b border-line p-4"><span className="font-display text-2xl">{values[i] ?? "—"} <small>{suffix}</small></span><span className="mt-2 block h-1 bg-foreground/10"><span className="block h-full bg-accent transition-all duration-700" style={{ width: `${((values[i] ?? 0) / max) * 100}%` }} /></span></td>)}</tr>; })}</tbody>
    </table><p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">Winners: {Object.entries(comparison.winners).map(([key, value]) => `${key.replace("Winner", "")}: ${value ?? "—"}`).join(" · ")}</p></div> : null}
  </section>;
}
