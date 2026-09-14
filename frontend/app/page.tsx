import { Hero } from "@/components/home/Hero";
import { FeaturedMachines } from "@/components/home/FeaturedMachines";
import { PhilosophyStrip } from "@/components/home/PhilosophyStrip";
import { getBikes } from "@/lib/api";
import type { Bike } from "@/lib/types";

function hasRemoteImage(bike: Bike) {
  return Boolean(bike.images?.some((image) => image.path?.startsWith("http")));
}

export default async function Home() {
  const pool = await getBikes({ limit: 40, sort: "power_desc" })
    .then((data) => data.items)
    .catch(() => [] as Bike[]);
  const withImages = pool.filter(hasRemoteImage);
  const bikes = (withImages.length >= 6 ? withImages : pool).slice(0, 6);
  return (
    <>
      <Hero bike={bikes[0]} />
      <FeaturedMachines bikes={bikes} />
      <PhilosophyStrip />
    </>
  );
}
