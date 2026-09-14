import { cn } from "@/lib/cn";
import { TechnicalLabel } from "./TechnicalLabel";

export function SectionHeader({
  index,
  label,
  title,
  className,
}: {
  index?: string;
  label: string;
  title?: string;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <TechnicalLabel index={index}>{label}</TechnicalLabel>
      {title ? (
        <h2 className="max-w-xl font-display text-3xl leading-none tracking-tight text-foreground md:text-5xl">
          {title}
        </h2>
      ) : null}
    </header>
  );
}
