"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addGarage, getGarage, removeGarage, searchBikes } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { Bike, GarageEntry } from "@/lib/types";

export function GarageClient() {
  const { user, ready } = useAuthStore(); const [entries, setEntries] = useState<GarageEntry[]>([]);
  const [query, setQuery] = useState(""); const [results, setResults] = useState<Bike[]>([]); const [error, setError] = useState("");
  useEffect(() => { if (user) getGarage().then(setEntries).catch((e) => setError(e.message)); }, [user]);
  useEffect(() => { if (query.length < 2) return; const timer = setTimeout(() => searchBikes(query).then((r) => setResults(r.items)).catch(() => setResults([])), 250); return () => clearTimeout(timer); }, [query]);
  if (!ready) return <p className="px-10 pb-24 text-muted">Unlocking garage…</p>;
  if (!user) return <section className="px-5 pb-24 md:px-10"><div className="border border-line bg-surface p-10"><h2 className="font-display text-4xl">Garage locked.</h2><p className="mt-4 text-muted">Sign in to save and organize machines.</p><Link href="/login" className="mt-7 inline-block bg-accent px-5 py-3 text-xs uppercase tracking-widest">Sign in</Link></div></section>;
  const add = async (bike: Bike, category: "dream" | "track" | "street") => { if (!bike._id) return; try { const entry = await addGarage(bike._id, { category, notes: `APEX_CATEGORY:${category}` }); setEntries([...entries, { ...entry, bike, category }]); setQuery(""); setResults([]); } catch (e) { setError(e instanceof Error ? e.message : "Could not add machine"); } };
  const categoryFor = (entry: GarageEntry) => entry.category ?? (entry.notes?.match(/APEX_CATEGORY:(dream|track|street)/)?.[1] as GarageEntry["category"]) ?? "dream";
  return <section className="px-5 pb-24 md:px-10">
    <div className="relative max-w-xl"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Add a machine" className="w-full border border-line bg-surface p-4" />{query.length >= 2 && results.length ? <div className="absolute z-20 w-full border border-line bg-surface">{results.map((bike) => <div key={bike.slug} className="border-b border-line p-3"><p>{bike.brand} {bike.model}</p><div className="mt-2 flex gap-3">{(["dream", "track", "street"] as const).map((category) => <button key={category} onClick={() => add(bike, category)} className="text-[10px] uppercase tracking-widest text-accent">+ {category}</button>)}</div></div>)}</div> : null}</div>
    {error ? <p className="mt-4 text-accent">{error}</p> : null}
    <div className="mt-10 grid gap-6 lg:grid-cols-3">{(["dream", "track", "street"] as const).map((category) => <div key={category}><h2 className="border-b border-line pb-4 font-mono text-xs uppercase tracking-[.3em] text-muted">{category}</h2><ul>{entries.filter((e) => categoryFor(e) === category).map((entry) => <li key={entry._id} className="flex items-center justify-between border-b border-line py-5"><Link href={`/bike/${entry.bike.slug}`} className="font-display text-xl">{entry.bike.brand} {entry.bike.model}</Link><button onClick={async () => { await removeGarage(entry._id); setEntries(entries.filter((e) => e._id !== entry._id)); }} className="text-xs text-muted">Remove</button></li>)}</ul></div>)}</div>
  </section>;
}
