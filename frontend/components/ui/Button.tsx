import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";

const variants: Record<ButtonVariant, string> = {
  solid:
    "border border-foreground/15 bg-foreground text-background hover:border-accent hover:bg-accent hover:text-foreground",
  outline:
    "border border-foreground/18 bg-transparent text-foreground hover:border-accent hover:text-accent",
  ghost: "border border-transparent text-muted hover:text-foreground",
};

export function buttonClassName(variant: ButtonVariant = "outline", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-3 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.28em] transition-colors duration-300",
    variants[variant],
    className,
  );
}
