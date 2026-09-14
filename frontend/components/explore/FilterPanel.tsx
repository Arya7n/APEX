"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const categories = [
  "superbike",
  "supersport",
  "sport",
  "naked",
  "hyper-naked",
  "track",
  "legend",
];

export function FilterPanel() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeCount = ["brand", "category", "minPower", "maxWeight"].filter((key) =>
    Boolean(params.get(key)),
  ).length;
  const [open, setOpen] = useState(activeCount > 0);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  const reset = () => {
    router.push(pathname);
  };

  const fields = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      <label className="text-xs text-muted">
        Brand
        <input
          value={params.get("brand") ?? ""}
          onChange={(e) => update("brand", e.target.value)}
          placeholder="Ducati"
          className="mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>
      <label className="text-xs text-muted">
        Category
        <select
          value={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className="mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm text-foreground"
        >
          <option value="">All classes</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-muted">
        Minimum power
        <input
          type="number"
          value={params.get("minPower") ?? ""}
          onChange={(e) => update("minPower", e.target.value)}
          placeholder="150"
          className="mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm text-foreground"
        />
      </label>
      <label className="text-xs text-muted">
        Maximum weight
        <input
          type="number"
          value={params.get("maxWeight") ?? ""}
          onChange={(e) => update("maxWeight", e.target.value)}
          placeholder="210"
          className="mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm text-foreground"
        />
      </label>
      <label className="text-xs text-muted sm:col-span-2 lg:col-span-1">
        Order
        <select
          value={params.get("sort") ?? "power_desc"}
          onChange={(e) => update("sort", e.target.value)}
          className="mt-2 w-full border border-line bg-background px-3 py-2.5 text-sm text-foreground"
        >
          <option value="power_desc">Power: high to low</option>
          <option value="weight_asc">Weight: low to high</option>
          <option value="speed_desc">Top speed</option>
          <option value="year_desc">Newest</option>
        </select>
      </label>
    </div>
  );

  return (
    <aside className="border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left lg:pointer-events-none lg:cursor-default lg:p-5"
        aria-expanded={open}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
            Filter archive
          </p>
          <p className="mt-1 text-xs text-muted lg:hidden">
            {activeCount ? `${activeCount} active` : "Tap to calibrate"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted transition-transform lg:hidden",
            open && "rotate-180",
          )}
        />
      </button>

      <div className={cn("border-t border-line p-4 lg:block lg:p-5", open ? "block" : "hidden")}>
        {fields}
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-accent"
          >
            Reset filters
          </button>
        ) : null}
      </div>
    </aside>
  );
}
