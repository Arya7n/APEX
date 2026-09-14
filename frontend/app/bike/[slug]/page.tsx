import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { featuredMachines, getTemporaryBike } from "@/lib/data/featured-bikes";
import { getMachineImageAlt, getMachineImageSrc } from "@/lib/images";
import { ComingOnline } from "@/components/system/ComingOnline";

export function generateStaticParams() {
  return featuredMachines.map((bike) => ({ slug: bike.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bike = getTemporaryBike(slug);

  if (!bike) {
    return { title: "Machine not found" };
  }

  return {
    title: `${bike.brand} ${bike.model} — Specs, Performance & Comparison`,
  };
}

export default async function BikePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bike = getTemporaryBike(slug);

  if (!bike) {
    notFound();
  }

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-10 pt-32 md:px-10 md:pt-40">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">{bike.brand}</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">{bike.model}</h1>
        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl">
          <Image
            src={getMachineImageSrc(bike.imageId)}
            alt={getMachineImageAlt(bike.brand, bike.model)}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </section>
      <ComingOnline
        title="Specification chamber sealed"
        body="Full engine, chassis, and electronics sections connect to the normalized MongoDB model in Phase 5."
      />
    </>
  );
}
