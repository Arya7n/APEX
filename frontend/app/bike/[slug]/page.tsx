import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMachineImageAlt, resolveBikeImage } from "@/lib/images";
import { getBike, getSimilar, getStats } from "@/lib/api";
import { CountUp } from "@/components/motion/CountUp";
import { BikeCard } from "@/components/bike/BikeCard";
import { BikeImage } from "@/components/bike/BikeImage";
import type { Bike } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bike = await getBike(slug).catch(() => null);
  return bike ? { title: `${bike.brand} ${bike.model} — Specs & Performance`, description: bike.description ?? `Technical specification for the ${bike.brand} ${bike.model}.`, openGraph: { images: [resolveBikeImage(bike)] } } : { title: "Machine not found" };
}

const display = (value: unknown, suffix = "") => value === null || value === undefined || value === "" ? "—" : `${typeof value === "boolean" ? (value ? "Yes" : "No") : value}${suffix}`;
function SpecSection({ title, values }: { title: string; values: Array<[string, unknown, string?]> }) {
  return <section className="border-t border-line py-10 sm:py-14"><h2 className="font-mono text-xs tracking-[.3em] text-accent">{title}</h2><dl className="mt-6 grid gap-px bg-line sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">{values.map(([label, value, suffix]) => <div key={label} className="min-w-0 bg-surface p-4 sm:p-5"><dt className="text-[10px] uppercase tracking-widest text-muted sm:text-xs">{label}</dt><dd className="mt-2 break-words text-base sm:text-lg">{display(value, suffix)}</dd></div>)}</dl></section>;
}

export default async function BikePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bike = await getBike(slug).catch(() => null);

  if (!bike) notFound();
  const [similar, stats] = await Promise.all([getSimilar(slug).catch(() => []), getStats(slug).catch(() => null)]);

  return (
    <>
      <section className="relative overflow-x-clip px-5 pb-10 pt-32 md:px-10 md:pt-40">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">{bike.brand}</p>
        <h1 className="mt-3 break-words font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">{bike.model}</h1>
        <div className="relative mx-auto mt-8 aspect-[16/10] max-w-5xl sm:aspect-[16/9]">
          <BikeImage
            src={resolveBikeImage(bike)}
            alt={getMachineImageAlt(bike.brand, bike.model)}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[
            ["Power", bike.performance.horsepower, "HP"], ["Weight", bike.dimensions.weight, "KG"],
            ["Top speed", bike.performance.topSpeed, "KM/H"], ["APEX index", bike.derivedMetrics.performanceScore, ""],
          ].map(([label, value, suffix]) => <div key={String(label)} className="min-w-0 bg-surface p-4 sm:p-5"><p className="font-display text-2xl sm:text-3xl">{typeof value === "number" ? <CountUp value={value} /> : "—"}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted sm:text-[10px]">{label} {suffix}</p></div>)}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-10">
        {bike.description ? <p className="max-w-3xl pb-14 text-lg leading-8 text-muted">{bike.description}</p> : null}
        <SpecSection title="ENGINE" values={[["Displacement", bike.engine.displacement, " cc"], ["Configuration", bike.engine.configuration], ["Cylinders", bike.engine.cylinders], ["Cooling", bike.engine.cooling], ["Compression", bike.engine.compressionRatio], ["Bore × stroke", bike.engine.bore && bike.engine.stroke ? `${bike.engine.bore} × ${bike.engine.stroke} mm` : null], ["Redline", bike.engine.redline, " rpm"]]} />
        <SpecSection title="PERFORMANCE" values={[["Horsepower", bike.performance.horsepower, " hp"], ["Torque", bike.performance.torque, " Nm"], ["Top speed", bike.performance.topSpeed, " km/h"], ["0–100 km/h", bike.performance.zeroTo100, " s"]]} />
        <SpecSection title="DIMENSIONS" values={[["Wet weight", bike.dimensions.weight, " kg"], ["Seat height", bike.dimensions.seatHeight, " mm"], ["Wheelbase", bike.dimensions.wheelbase, " mm"], ["Fuel capacity", bike.dimensions.fuelCapacity, " L"], ["Length", bike.dimensions.length, " mm"]]} />
        <SpecSection title="CHASSIS" values={Object.entries(bike.chassis).map(([key, value]) => [key.replace(/([A-Z])/g, " $1"), value] as [string, unknown])} />
        <SpecSection title="ELECTRONICS" values={[["Riding modes", bike.electronics.ridingModes?.join(", ")], ["Traction control", bike.electronics.tractionControl], ["ABS", bike.electronics.abs], ["Quickshifter", bike.electronics.quickshifter], ["Launch control", bike.electronics.launchControl], ["Engine brake control", bike.electronics.engineBrakeControl]]} />
        <SpecSection title="AERODYNAMICS" values={[["Winglets", bike.aerodynamics.winglets], ["Downforce", bike.aerodynamics.downforce]]} />
        <SpecSection title="DERIVED METRICS" values={[["Power / kg", bike.derivedMetrics.horsepowerPerKg], ["Torque / kg", bike.derivedMetrics.torquePerKg], ["Displacement / kg", bike.derivedMetrics.displacementPerKg], ["Performance score", bike.derivedMetrics.performanceScore], ["Archive rank", stats?.performanceRank]]} />
        {similar.length ? <section className="border-t border-line py-14"><h2 className="font-display text-4xl">Similar machines</h2><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{similar.map((item: Bike, index) => <BikeCard key={item.slug} bike={item} index={index + 1} className="min-w-0" />)}</div></section> : null}
      </div>
    </>
  );
}
