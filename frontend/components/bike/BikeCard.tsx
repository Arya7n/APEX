import Image from "next/image";
import Link from "next/link";
import type { Bike, BikeCardData } from "@/lib/types";
import { getMachineImageAlt, PLACEHOLDER_MACHINE_IMAGE, resolveBikeImage } from "@/lib/images";
import { cn } from "@/lib/cn";

function formatValue(value: number | null, suffix: string) {
  if (value === null) return "—";
  const display = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return `${display} ${suffix}`;
}

export function BikeCard({
  bike,
  index,
  className,
}: {
  bike: BikeCardData | Bike;
  index: number;
  className?: string;
}) {
  const apiBike = "engine" in bike;
  const imageSrc = apiBike
    ? resolveBikeImage(bike)
    : (bike.imagePath ?? PLACEHOLDER_MACHINE_IMAGE);
  const engineLabel = apiBike
    ? [bike.engine.displacement ? `${bike.engine.displacement} cc` : null, bike.engine.configuration]
        .filter(Boolean)
        .join(" ")
    : bike.engineLabel;
  const horsepower = apiBike ? bike.performance.horsepower : bike.horsepower;
  const weight = apiBike ? bike.dimensions.weight : bike.weight;
  const topSpeed = apiBike ? bike.performance.topSpeed : bike.topSpeed;

  return (
    <Link
      href={`/bike/${bike.slug}`}
      className={cn(
        "group relative flex w-full min-w-0 flex-col border border-line bg-surface",
        "transition-[border-color,transform] duration-500 hover:border-foreground/25",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-background">
        <Image
          src={imageSrc}
          alt={getMachineImageAlt(bike.brand, bike.model)}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1280px) 45vw, 380px"
          className="object-contain p-4 sm:p-6 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-3 top-3 font-mono text-[10px] tracking-[0.28em] text-muted sm:left-4 sm:top-4">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">{bike.brand}</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words font-display text-xl leading-none tracking-tight sm:text-2xl md:text-[1.75rem]">
            {bike.model}
          </h3>
          <span className="mt-1 shrink-0 font-mono text-sm text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:text-accent">
            →
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:mt-6 sm:gap-3 sm:text-[10px] sm:tracking-[0.18em]">
          <div className="min-w-0">
            <dt className="text-foreground/35">Engine</dt>
            <dd className="mt-1 break-words text-foreground">{engineLabel || "—"}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-foreground/35">Power</dt>
            <dd className="mt-1 text-foreground">{formatValue(horsepower, "HP")}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-foreground/35">Weight</dt>
            <dd className="mt-1 text-foreground">{formatValue(weight, "KG")}</dd>
          </div>
        </dl>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <dl className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:gap-6 sm:text-[10px]">
              <div>
                <dt className="text-foreground/35">Speed</dt>
                <dd className="mt-1 text-foreground">{formatValue(topSpeed, "KM/H")}</dd>
              </div>
              <div>
                <dt className="text-foreground/35">Class</dt>
                <dd className="mt-1 text-foreground">{bike.category ?? "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Link>
  );
}
