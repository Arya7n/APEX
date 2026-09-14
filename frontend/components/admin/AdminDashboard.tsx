"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats, getBikes, importAdminBike } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { AdminStats, Bike } from "@/lib/types";

export function AdminDashboard() {
  const { user, ready } = useAuthStore(); const [stats, setStats] = useState<AdminStats | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]); const [message, setMessage] = useState("");
  useEffect(() => { if (user?.role === "admin") Promise.all([getAdminStats(), getBikes({ limit: 10 })]).then(([s, b]) => { setStats(s); setBikes(b.items); }).catch((e) => setMessage(e.message)); }, [user]);
  if (!ready) return <p className="px-10 pb-24 text-muted">Verifying clearance…</p>;
  if (!user) return <section className="px-5 pb-24 md:px-10"><p className="text-muted">Administrator authentication required.</p><Link href="/admin/login" className="mt-5 inline-block bg-accent px-5 py-3">Admin sign in</Link></section>;
  if (user.role !== "admin") return <section className="px-5 pb-24 md:px-10"><h2 className="font-display text-4xl">Access denied.</h2><p className="mt-4 max-w-2xl text-muted">New registrations receive the user role. Set the account role to <code className="text-foreground">admin</code> in MongoDB, then sign in through the admin terminal.</p></section>;
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); setMessage("Importing…"); try { const bike = await importAdminBike(String(form.get("id"))); setBikes([bike, ...bikes]); setMessage(`Imported ${bike.brand} ${bike.model}`); event.currentTarget.reset(); } catch (e) { setMessage(e instanceof Error ? e.message : "Import failed"); } };
  return <section className="px-5 pb-24 md:px-10"><div className="grid gap-px bg-line sm:grid-cols-3">{Object.entries(stats ?? {}).map(([key, value]) => <div key={key} className="bg-surface p-7"><strong className="font-display text-5xl">{value}</strong><p className="mt-2 text-xs uppercase tracking-widest text-muted">{key}</p></div>)}</div><form onSubmit={submit} className="mt-10 flex max-w-xl gap-2"><input required name="id" placeholder="External bike ID" className="min-w-0 flex-1 border border-line bg-surface p-4" /><button className="bg-accent px-5 text-xs uppercase tracking-widest">Import</button></form>{message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}<h2 className="mt-12 font-display text-3xl">Recent machines</h2><ul className="mt-5">{bikes.map((bike) => <li key={bike.slug} className="border-t border-line py-4">{bike.brand} {bike.model} <span className="text-muted">/{bike.slug}</span></li>)}</ul></section>;
}
