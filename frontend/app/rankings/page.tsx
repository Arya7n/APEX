import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { getRanking } from "@/lib/api";
import type { RankingKind } from "@/lib/types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rankings",
};

const kinds: RankingKind[] = ["fastest", "power", "lightest", "power-to-weight", "torque"];

const metric = (
  kind: RankingKind,
  bike: Awaited<ReturnType<typeof getRanking>>[number],
) =>
  kind === "fastest"
    ? `${bike.performance.topSpeed ?? "—"} km/h`
    : kind === "power"
      ? `${bike.performance.horsepower ?? "—"} hp`
      : kind === "lightest"
        ? `${bike.dimensions.weight ?? "—"} kg`
        : kind === "torque"
          ? `${bike.performance.torque ?? "—"} Nm`
          : `${bike.derivedMetrics.horsepowerPerKg ?? "—"} hp/kg`;

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const requested = (await searchParams).kind as RankingKind;
  const kind = kinds.includes(requested) ? requested : "fastest";
  const bikes = await getRanking(kind).catch(() => []);

  return (
    <>
      <PageHeader
        index="05"
        label="Rankings"
        title="Calculated, not curated."
        description="Fastest, lightest, most powerful — derived from MongoDB, never hardcoded."
      />
      <section className="px-5 pb-24 md:px-10">
        <nav className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {kinds.map((item) => (
            <Link
              key={item}
              href={`/rankings?kind=${item}`}
              className={`shrink-0 border px-4 py-2 font-mono text-[10px] uppercase tracking-widest ${
                item === kind ? "border-accent text-foreground" : "border-line text-muted"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>
        <ol className="mt-8">
          {bikes.map((bike, index) => (
            <li
              key={bike.slug}
              className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3 gap-y-2 border-t border-line py-5 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center"
            >
              <span className="font-mono text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Link
                href={`/bike/${bike.slug}`}
                className="min-w-0 break-words font-display text-lg leading-tight sm:text-xl md:text-3xl"
              >
                {bike.brand} {bike.model}
              </Link>
              <strong className="col-start-2 font-mono text-sm text-accent sm:col-start-auto sm:justify-self-end">
                {metric(kind, bike)}
              </strong>
            </li>
          ))}
        </ol>
        {!bikes.length ? (
          <p className="border border-line p-10 text-center text-muted">
            Ranking data is unavailable.
          </p>
        ) : null}
      </section>
    </>
  );
}
