import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterPanel } from "@/components/explore/FilterPanel";
import { BikeCard } from "@/components/bike/BikeCard";
import { getBikes } from "@/lib/api";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Explore",
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const value = (key: string) => typeof raw[key] === "string" ? raw[key] : undefined;
  const page = Number(value("page") ?? 1);
  let data = null;
  let error = "";
  try {
    data = await getBikes({ brand: value("brand"), category: value("category"), minPower: Number(value("minPower")) || undefined, maxWeight: Number(value("maxWeight")) || undefined, sort: value("sort") ?? "power_desc", page, limit: 12 });
  } catch (cause) { error = cause instanceof Error ? cause.message : "Archive unavailable"; }
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    Object.entries(raw).forEach(([k, v]) => { if (typeof v === "string") params.set(k, v); });
    params.set("page", String(nextPage)); return `/explore?${params}`;
  };
  return (
    <>
      <PageHeader
        index="02"
        label="Explore"
        title="The archive."
        description="Search, filter, and inspect every machine in the live APEX archive."
      />
      <section className="grid gap-4 px-5 pb-24 sm:gap-6 md:px-10 lg:grid-cols-[260px_1fr]">
        <FilterPanel />
        <div className="min-w-0">
          {error ? <p className="border border-accent/30 bg-accent/5 p-6 text-muted">{error}</p> : null}
          {!error && !data?.items.length ? <p className="border border-line p-8 text-center text-muted sm:p-12">No machines match this calibration.</p> : null}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data?.items.map((bike, index) => <BikeCard key={bike.slug} bike={bike} index={(page - 1) * 12 + index + 1} className="min-w-0" />)}
          </div>
          {data && data.pages > 1 ? <nav className="mt-8 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[.2em] sm:text-xs">
            {page > 1 ? <Link href={pageHref(page - 1)}>← Previous</Link> : <span />}
            <span className="text-muted">{page} / {data.pages}</span>
            {page < data.pages ? <Link href={pageHref(page + 1)}>Next →</Link> : <span />}
          </nav> : null}
        </div>
      </section>
    </>
  );
}
