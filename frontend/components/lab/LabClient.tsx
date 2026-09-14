"use client";

import { useEffect, useState } from "react";
import { getBikes } from "@/lib/api";
import type { Bike } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LabClient() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => { getBikes({ limit: 20, sort: "power_desc" }).then((r) => { setBikes(r.items); setSlugs(r.items.slice(0, 3).map((b) => b.slug)); }).catch(() => undefined); }, []);
  const selected = bikes.filter((b) => slugs.includes(b.slug));
  const bars = selected.map((b) => ({ name: `${b.brand} ${b.model}`, power: b.performance.horsepower, torque: b.performance.torque, weight: b.dimensions.weight }));
  const radar = ["horsepower", "torque", "topSpeed", "performanceScore"].map((metric) => {
    const row: Record<string, string | number> = { metric };
    selected.forEach((b) => { row[b.slug] = metric === "performanceScore" ? b.derivedMetrics.performanceScore ?? 0 : b.performance[metric as keyof Bike["performance"]] as number ?? 0; }); return row;
  });
  return <section className="px-5 pb-24 md:px-10">
    <div className="flex flex-wrap gap-2">{bikes.map((bike) => <button key={bike.slug} onClick={() => setSlugs(slugs.includes(bike.slug) ? slugs.filter((s) => s !== bike.slug) : slugs.length < 4 ? [...slugs, bike.slug] : slugs)} className={`border px-3 py-2 text-xs ${slugs.includes(bike.slug) ? "border-accent text-foreground" : "border-line text-muted"}`}>{bike.brand} {bike.model}</button>)}</div>
    <div className="mt-10 grid gap-6 xl:grid-cols-2">
      <div className="h-[430px] border border-line bg-surface p-4"><ResponsiveContainer><BarChart data={bars}><CartesianGrid stroke="#222" vertical={false} /><XAxis dataKey="name" stroke="#8a8a8f" tick={{ fontSize: 10 }} /><YAxis stroke="#8a8a8f" /><Tooltip contentStyle={{ background: "#101013", border: "1px solid #29292d" }} /><Legend /><Bar dataKey="power" fill="#ff3b30" isAnimationActive /><Bar dataKey="torque" fill="#f5f5f5" /><Bar dataKey="weight" fill="#55555c" /></BarChart></ResponsiveContainer></div>
      <div className="h-[430px] border border-line bg-surface p-4"><ResponsiveContainer><RadarChart data={radar}><PolarGrid stroke="#333" /><PolarAngleAxis dataKey="metric" stroke="#8a8a8f" />{selected.map((b, i) => <Radar key={b.slug} name={b.model} dataKey={b.slug} stroke={["#ff3b30", "#f5f5f5", "#8a8a8f", "#55555c"][i]} fill="transparent" />)}<Legend /></RadarChart></ResponsiveContainer></div>
    </div>
  </section>;
}
