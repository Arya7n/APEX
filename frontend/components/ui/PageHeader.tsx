import { TechnicalLabel } from "./TechnicalLabel";

export function PageHeader({
  index,
  label,
  title,
  description,
}: {
  index?: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="relative overflow-x-clip border-b border-line px-5 pb-12 pt-28 sm:pb-16 sm:pt-32 md:px-10 md:pb-24 md:pt-40">
      <p className="pointer-events-none absolute -right-4 top-16 font-display text-[4.5rem] leading-none text-foreground/[0.035] sm:top-20 sm:text-[22vw] md:text-[12rem]">
        APEX
      </p>
      <TechnicalLabel index={index}>{label}</TechnicalLabel>
      <h1 className="mt-5 max-w-4xl break-words font-display text-4xl leading-[1.02] tracking-tight text-foreground sm:mt-6 sm:text-5xl md:text-7xl lg:text-8xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:mt-6 md:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
