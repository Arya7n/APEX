import { cn } from "@/lib/cn";

export function TechnicalLabel({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted",
        className,
      )}
    >
      {index ? <span className="text-accent">{index}</span> : null}
      {children}
    </p>
  );
}
