"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearch } from "./SearchProvider";
import { searchAll } from "@/lib/api";
import type { SearchResult } from "@/lib/types";

export function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ bikes: [], articles: [], brands: [] });
  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    setQuery("");
    setResults({ bikes: [], articles: [], brands: [] });
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

  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = setTimeout(() => {
      setLoading(true);
      searchAll(query)
        .then(setResults)
        .catch(() => setResults({ bikes: [], articles: [], brands: [] }))
        .finally(() => setLoading(false));
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  const total = results.bikes.length + results.articles.length + results.brands.length;

  return (
    <div className="fixed inset-0 z-[80] bg-background/92 backdrop-blur-sm">
      <div className="relative mx-auto flex h-full min-h-0 max-w-3xl flex-col px-5 pb-6 pt-[max(5.5rem,env(safe-area-inset-top))] md:px-8">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
            Search archive
          </p>
          <button
            type="button"
            onClick={close}
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.28em] text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value.trim().length < 2) {
              setResults({ bikes: [], articles: [], brands: [] });
            }
          }}
          placeholder="Search machines"
          className="mt-4 w-full border-b border-foreground/20 bg-transparent pb-4 font-display text-3xl text-foreground outline-none placeholder:text-foreground/20 sm:text-4xl md:text-6xl"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          {loading ? "Searching live archive…" : `${total} results`}
        </p>
        <ul className="mt-6 min-h-0 flex-1 space-y-0 overflow-y-auto overscroll-contain pb-8">
          {results.bikes.map((bike) => (
            <li key={bike.slug} className="border-t border-line">
              <Link
                href={`/bike/${bike.slug}`}
                onClick={close}
                className="flex flex-col gap-1 py-5 transition-colors hover:text-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="min-w-0 font-display text-xl tracking-tight sm:text-2xl">
                  {bike.brand} {bike.model}
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  {bike.category}
                </span>
              </Link>
            </li>
          ))}
          {results.articles.map((article) => (
            <li key={article.slug} className="border-t border-line">
              <Link
                href={`/learn/${article.slug}`}
                onClick={close}
                className="flex flex-col gap-1 py-5 hover:text-accent sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="min-w-0 font-display text-xl sm:text-2xl">{article.title}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted">
                  Article
                </span>
              </Link>
            </li>
          ))}
          {results.brands.map((brand) => (
            <li key={brand.slug} className="border-t border-line">
              <Link
                href={`/explore?brand=${encodeURIComponent(brand.name)}`}
                onClick={close}
                className="flex flex-col gap-1 py-5 hover:text-accent sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="min-w-0 font-display text-xl sm:text-2xl">{brand.name}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted">
                  Brand
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
