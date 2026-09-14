import type { Bike } from "@/lib/types";
import { BikeCard } from "@/components/bike/BikeCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedMachines({ bikes }: { bikes?: Bike[] }) {
  if (!bikes?.length) {
    return (
      <section className="border-t border-line py-16 sm:py-20 md:py-28">
        <div className="px-5 md:px-10">
          <Reveal>
            <SectionHeader index="01" label="Featured machines" />
          </Reveal>
          <p className="mt-6 max-w-md text-sm text-muted">
            No machines in the archive yet. Sync from API Ninjas with{" "}
            <code className="font-mono text-foreground/80">pnpm --dir backend seed:sync</code>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-line py-16 sm:py-20 md:py-28">
      <div className="px-5 md:px-10">
        <Reveal>
          <SectionHeader index="01" label="Featured machines" />
        </Reveal>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted lg:hidden">
          Swipe to inspect →
        </p>
      </div>

      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 apex-scroll-hint md:mt-12 md:gap-5 md:px-10 lg:hidden">
        {bikes.map((bike, index) => (
          <BikeCard
            key={bike.slug}
            bike={bike}
            index={index + 1}
            className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[340px]"
          />
        ))}
      </div>

      <div className="mt-12 hidden gap-5 px-5 md:px-10 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {bikes.map((bike, index) => (
          <BikeCard key={bike.slug} bike={bike} index={index + 1} className="min-w-0" />
        ))}
      </div>
    </section>
  );
}
