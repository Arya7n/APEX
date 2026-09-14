import type { Bike } from "@/lib/types";

const MACHINE_IMAGES: Record<string, string> = {
  "hero-machine": "/images/machines/hero-machine.png",
  "featured-01": "/images/machines/featured-01.png",
  "featured-02": "/images/machines/featured-02.png",
  "featured-03": "/images/machines/featured-03.png",
  "featured-04": "/images/machines/featured-04.png",
  "featured-05": "/images/machines/featured-05.png",
  "featured-06": "/images/machines/featured-06.png",
};

export function getMachineImageSrc(imageId: string): string {
  return MACHINE_IMAGES[imageId] ?? MACHINE_IMAGES["hero-machine"]!;
}

export function getMachineImageAlt(brand: string, model: string): string {
  return `${brand} ${model}`;
}

export function resolveBikeImage(bike: Pick<Bike, "images">): string {
  const image = bike.images?.[0];
  if (image?.path?.includes("/images/machines/")) return image.path;
  if (image?.id) return getMachineImageSrc(image.id);
  return getMachineImageSrc("hero-machine");
}
