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

/** Strip tracking query params that can break Wikimedia CDN fetches. */
function cleanImageUrl(path: string): string {
  if (!path.startsWith("http")) return path;
  try {
    const url = new URL(path);
    if (url.hostname.endsWith("wikimedia.org") || url.hostname.endsWith("wikipedia.org")) {
      url.search = "";
      return url.toString();
    }
  } catch {
    return path;
  }
  return path;
}

export function resolveBikeImage(bike: Pick<Bike, "images" | "brand" | "model">): string {
  const image = bike.images?.find((entry) => isUsableImagePath(entry.path));
  return image?.path ? cleanImageUrl(image.path) : PLACEHOLDER_MACHINE_IMAGE;
}
