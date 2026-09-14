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
    const timer = setTimeout(() => { setLoading(true); searchAll(query).then(setResults).catch(() => setResults({ bikes: [], articles: [], brands: [] })).finally(() => setLoading(false)); }, 280);
    return () => clearTimeout(timer);
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
          onChange={(event) => { setQuery(event.target.value); if (event.target.value.trim().length < 2) setResults({ bikes: [], articles: [], brands: [] }); }}
          placeholder="Search machines"
          className="mt-4 w-full border-b border-foreground/20 bg-transparent pb-4 font-display text-4xl text-foreground outline-none placeholder:text-foreground/20 md:text-6xl"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
          {loading ? "Searching live archive…" : `${results.bikes.length + results.articles.length + results.brands.length} results`}
        </p>
        <ul className="mt-10 space-y-0 overflow-y-auto">
          {results.bikes.map((bike) => (
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
          {results.articles.map((article) => <li key={article.slug} className="border-t border-line"><Link href={`/learn/${article.slug}`} onClick={close} className="flex items-baseline justify-between py-5 hover:text-accent"><span className="font-display text-2xl">{article.title}</span><span className="font-mono text-[10px] uppercase tracking-widest text-muted">Article</span></Link></li>)}
          {results.brands.map((brand) => <li key={brand.slug} className="border-t border-line"><Link href={`/explore?brand=${encodeURIComponent(brand.name)}`} onClick={close} className="flex items-baseline justify-between py-5 hover:text-accent"><span className="font-display text-2xl">{brand.name}</span><span className="font-mono text-[10px] uppercase tracking-widest text-muted">Brand</span></Link></li>)}
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
