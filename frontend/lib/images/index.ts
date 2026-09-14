import type { Bike } from "@/lib/types";

/** Neutral silhouette when a bike has no photo — never reuse another model's image. */
export const PLACEHOLDER_MACHINE_IMAGE = "/images/machines/hero-machine.png";

export function getMachineImageAlt(brand: string, model: string): string {
  return `${brand} ${model}`;
}

function isUsableImagePath(path: string | undefined | null): path is string {
  if (!path) return false;
  return path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/");
}

export function resolveBikeImage(bike: Pick<Bike, "images" | "brand" | "model">): string {
  const image = bike.images?.find((entry) => isUsableImagePath(entry.path));
  return image?.path ?? PLACEHOLDER_MACHINE_IMAGE;
}
