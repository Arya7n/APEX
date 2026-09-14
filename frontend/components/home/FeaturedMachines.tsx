import { featuredMachines } from "@/lib/data/featured-bikes";
import type { Bike } from "@/lib/types";
import { BikeCard } from "@/components/bike/BikeCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedMachines({ bikes }: { bikes?: Bike[] }) {
  const machines = bikes?.length ? bikes : featuredMachines;
  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="px-5 md:px-10">
        <Reveal>
          <SectionHeader index="01" label="Featured machines" />
        </Reveal>
      </div>

      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mt-14 md:gap-5 md:px-10 no-scrollbar">
        {machines.map((bike, index) => (
          <BikeCard key={bike.slug} bike={bike} index={index + 1} />
        ))}
      </div>
    </section>
  );
}
