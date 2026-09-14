"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearch } from "./SearchProvider";
import { featuredMachines } from "@/lib/data/featured-bikes";

export function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const [query, setQuery] = useState("");

  const close = useCallback(() => {
    setQuery("");
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    return featuredMachines.filter((bike) =>
      `${bike.brand} ${bike.model} ${bike.category}`.toLowerCase().includes(needle),
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-3xl flex-col px-5 pt-28 md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          Search archive
        </p>
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search machines"
          className="mt-4 w-full border-b border-foreground/20 bg-transparent pb-4 font-display text-4xl text-foreground outline-none placeholder:text-foreground/20 md:text-6xl"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          Temporary index — APEX API search in Phase 4
        </p>
        <ul className="mt-10 space-y-0 overflow-y-auto">
          {results.map((bike) => (
            <li key={bike.slug} className="border-t border-line">
              <Link
                href={`/bike/${bike.slug}`}
                onClick={close}
                className="flex items-baseline justify-between gap-4 py-5 transition-colors hover:text-accent"
              >
                <span className="font-display text-2xl tracking-tight">
                  {bike.brand} {bike.model}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  {bike.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={close}
          className="absolute right-6 top-8 font-mono text-[11px] uppercase tracking-[0.28em] text-muted hover:text-foreground"
        >
          Close
        </button>
      </div>
    </div>
  );
}
