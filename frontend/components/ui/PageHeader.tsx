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
    <header className="relative overflow-hidden border-b border-line px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
      <p className="pointer-events-none absolute -right-4 top-20 font-display text-[22vw] leading-none text-foreground/[0.035] md:text-[12rem]">
        APEX
      </p>
      <TechnicalLabel index={index}>{label}</TechnicalLabel>
      <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.9] tracking-tight text-foreground md:text-7xl lg:text-8xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">{description}</p>
      ) : null}
    </header>
  );
}
