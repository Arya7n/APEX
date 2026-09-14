import Image from "next/image";
import Link from "next/link";
import type { BikeCardData } from "@/lib/types";
import { getMachineImageAlt, getMachineImageSrc } from "@/lib/images";
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
  bike: BikeCardData;
  index: number;
  className?: string;
}) {
  return (
    <Link
      href={`/bike/${bike.slug}`}
      className={cn(
        "group relative flex min-w-[280px] snap-start flex-col border border-line bg-surface md:min-w-[380px]",
        "transition-[border-color,transform] duration-500 hover:border-foreground/25",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-background">
        <Image
          src={getMachineImageSrc(bike.imageId)}
          alt={getMachineImageAlt(bike.brand, bike.model)}
          fill
          sizes="(max-width: 768px) 80vw, 380px"
          className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.28em] text-muted">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">{bike.brand}</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl leading-none tracking-tight md:text-[1.75rem]">
            {bike.model}
          </h3>
          <span className="mt-1 font-mono text-sm text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:text-accent">
            →
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          <div>
            <dt className="text-foreground/35">Engine</dt>
            <dd className="mt-1 text-foreground">{bike.engineLabel ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-foreground/35">Power</dt>
            <dd className="mt-1 text-foreground">{formatValue(bike.horsepower, "HP")}</dd>
          </div>
          <div>
            <dt className="text-foreground/35">Weight</dt>
            <dd className="mt-1 text-foreground">{formatValue(bike.weight, "KG")}</dd>
          </div>
        </dl>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <dl className="mt-4 flex gap-6 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              <div>
                <dt className="text-foreground/35">Speed</dt>
                <dd className="mt-1 text-foreground">{formatValue(bike.topSpeed, "KM/H")}</dd>
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
