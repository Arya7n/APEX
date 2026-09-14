"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = ["superbike", "supersport", "sport", "naked", "hyper-naked", "track", "legend"];

export function FilterPanel() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };
  return (
    <aside className="border border-line bg-surface p-5">
      <p className="font-mono text-[10px] uppercase tracking-[.28em] text-muted">Filter archive</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label className="text-xs text-muted">Brand
          <input value={params.get("brand") ?? ""} onChange={(e) => update("brand", e.target.value)} placeholder="Ducati" className="mt-2 w-full border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-accent" />
        </label>
        <label className="text-xs text-muted">Category
          <select value={params.get("category") ?? ""} onChange={(e) => update("category", e.target.value)} className="mt-2 w-full border border-line bg-background px-3 py-2 text-foreground">
            <option value="">All classes</option>{categories.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs text-muted">Minimum power
          <input type="number" value={params.get("minPower") ?? ""} onChange={(e) => update("minPower", e.target.value)} placeholder="150 HP" className="mt-2 w-full border border-line bg-background px-3 py-2 text-foreground" />
        </label>
        <label className="text-xs text-muted">Maximum weight
          <input type="number" value={params.get("maxWeight") ?? ""} onChange={(e) => update("maxWeight", e.target.value)} placeholder="210 KG" className="mt-2 w-full border border-line bg-background px-3 py-2 text-foreground" />
        </label>
        <label className="text-xs text-muted">Order
          <select value={params.get("sort") ?? "power_desc"} onChange={(e) => update("sort", e.target.value)} className="mt-2 w-full border border-line bg-background px-3 py-2 text-foreground">
            <option value="power_desc">Power: high to low</option><option value="weight_asc">Weight: low to high</option><option value="speed_desc">Top speed</option><option value="year_desc">Newest</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
