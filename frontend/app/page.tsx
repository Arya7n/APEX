import { Hero } from "@/components/home/Hero";
import { FeaturedMachines } from "@/components/home/FeaturedMachines";
import { PhilosophyStrip } from "@/components/home/PhilosophyStrip";
import { getBikes } from "@/lib/api";

export default async function Home() {
  const bikes = await getBikes({ limit: 6, sort: "power_desc" }).then((data) => data.items).catch(() => []);
  return (
    <>
      <Hero bike={bikes[0]} />
      <FeaturedMachines bikes={bikes} />
      <PhilosophyStrip />
    </>
  );
}
