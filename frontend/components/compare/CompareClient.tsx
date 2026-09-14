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
    const timer = setTimeout(
      () => searchBikes(query).then((r) => setResults(r.items)).catch(() => setResults([])),
      250,
    );
    return () => clearTimeout(timer);
  }, [query]);

  const add = (bike: Bike) => {
    if (selected.length < 4 && !selected.some((b) => b.slug === bike.slug)) {
      setSelected([...selected, bike]);
    }
    setQuery("");
    setResults([]);
  };

  const run = async () => {
    setError("");
    try {
      setComparison(await compareBikes(selected.map((b) => b.slug)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed");
    }
  };

  return (
    <section className="px-5 pb-24 md:px-10">
      <div className="relative max-w-xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search and add 2–4 machines"
          className="w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent sm:text-base"
        />
        {query.trim().length >= 2 && results.length ? (
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto border border-line bg-surface">
            {results.map((bike) => (
              <button
                key={bike.slug}
                type="button"
                onClick={() => add(bike)}
                className="block w-full border-b border-line p-3 text-left text-sm hover:bg-surface-2"
              >
                {bike.brand} {bike.model}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {selected.map((bike) => (
          <button
            key={bike.slug}
            type="button"
            onClick={() => {
              setSelected(selected.filter((b) => b.slug !== bike.slug));
              setComparison(null);
            }}
            className="max-w-full truncate border border-line px-3 py-2 text-xs sm:px-4 sm:text-sm"
          >
            {bike.brand} {bike.model} ×
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={selected.length < 2}
        onClick={run}
        className="mt-6 w-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest disabled:opacity-30 sm:w-auto"
      >
        Calculate comparison
      </button>

      {error ? <p className="mt-5 text-accent">{error}</p> : null}

      {comparison ? (
        <div className="mt-12">
          <div className="space-y-8 lg:hidden">
            {metrics.map(([label, read, suffix]) => {
              const values = comparison.bikes.map((b) => read(b));
              const max = Math.max(...values.map((v) => v ?? 0), 1);
              return (
                <div key={label} className="border border-line bg-surface p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                    {label}
                  </p>
                  <ul className="mt-4 space-y-4">
                    {comparison.bikes.map((bike, i) => (
                      <li key={bike.slug}>
                        <div className="flex items-end justify-between gap-3">
                          <span className="min-w-0 truncate text-sm text-muted">
                            {bike.brand} {bike.model}
                          </span>
                          <span className="shrink-0 font-display text-xl">
                            {values[i] ?? "—"}{" "}
                            <small className="text-xs text-muted">{suffix}</small>
                          </span>
                        </div>
                        <span className="mt-2 block h-1 bg-foreground/10">
                          <span
                            className="block h-full bg-accent transition-all duration-700"
                            style={{ width: `${((values[i] ?? 0) / max) * 100}%` }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="border-b border-line p-4 text-muted">Metric</th>
                  {comparison.bikes.map((b) => (
                    <th key={b.slug} className="border-b border-line p-4 font-display text-xl">
                      {b.brand}
                      <br />
                      {b.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map(([label, read, suffix]) => {
                  const values = comparison.bikes.map((b) => read(b));
                  const max = Math.max(...values.map((v) => v ?? 0), 1);
                  return (
                    <tr key={label}>
                      <th className="border-b border-line p-4 text-xs uppercase tracking-widest text-muted">
                        {label}
                      </th>
                      {comparison.bikes.map((bike, i) => (
                        <td key={bike.slug} className="border-b border-line p-4">
                          <span className="font-display text-2xl">
                            {values[i] ?? "—"} <small>{suffix}</small>
                          </span>
                          <span className="mt-2 block h-1 bg-foreground/10">
                            <span
                              className="block h-full bg-accent transition-all duration-700"
                              style={{ width: `${((values[i] ?? 0) / max) * 100}%` }}
                            />
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-xs">
            {Object.entries(comparison.winners).map(([key, value]) => (
              <span key={key}>
                {key.replace("Winner", "")}: {value ?? "—"}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
