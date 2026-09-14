import type { BikeCardData } from "@/lib/types";

/**
 * Temporary homepage data for Phase 2.
 * Replaced by APEX API + MongoDB in Phase 3.
 * Spec numbers are manufacturer-published; null means unavailable — never invented.
 */
export const heroMachine = {
  brand: "BMW",
  model: "S 1000 RR",
  horsepower: 193,
  displacement: 999,
  topSpeed: 303,
  imageId: "hero-machine",
} as const;

export const featuredMachines: BikeCardData[] = [
  {
    slug: "ducati-panigale-v4",
    brand: "Ducati",
    model: "Panigale V4",
    year: 2025,
    category: "Superbike",
    engineLabel: "1103 cc V4",
    horsepower: 215.5,
    weight: 191,
    topSpeed: 299,
    displacement: 1103,
    imageId: "featured-01",
  },
  {
    slug: "bmw-s-1000-rr",
    brand: "BMW",
    model: "S 1000 RR",
    year: 2025,
    category: "Superbike",
    engineLabel: "999 cc I4",
    horsepower: 210,
    weight: 197,
    topSpeed: 303,
    displacement: 999,
    imageId: "featured-02",
  },
  {
    slug: "kawasaki-ninja-zx-10r",
    brand: "Kawasaki",
    model: "Ninja ZX-10R",
    year: 2025,
    category: "Superbike",
    engineLabel: "998 cc I4",
    horsepower: 203,
    weight: 207,
    topSpeed: 299,
    displacement: 998,
    imageId: "featured-03",
  },
  {
    slug: "yamaha-yzf-r1",
    brand: "Yamaha",
    model: "YZF-R1",
    year: 2025,
    category: "Superbike",
    engineLabel: "998 cc I4",
    horsepower: 200,
    weight: 201,
    topSpeed: 299,
    displacement: 998,
    imageId: "featured-04",
  },
  {
    slug: "aprilia-rsv4-factory",
    brand: "Aprilia",
    model: "RSV4 Factory",
    year: 2025,
    category: "Superbike",
    engineLabel: "1099 cc V4",
    horsepower: 217,
    weight: 202,
    topSpeed: 305,
    displacement: 1099,
    imageId: "featured-05",
  },
  {
    slug: "ktm-1390-super-duke-r",
    brand: "KTM",
    model: "1390 Super Duke R",
    year: 2025,
    category: "Hyper Naked",
    engineLabel: "1350 cc V2",
    horsepower: 190,
    weight: 200,
    topSpeed: null,
    displacement: 1350,
    imageId: "featured-06",
  },
];

export function getTemporaryBike(slug: string) {
  return featuredMachines.find((bike) => bike.slug === slug) ?? null;
}
