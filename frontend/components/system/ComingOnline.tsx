import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";

export function ComingOnline({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="max-w-xl border border-line bg-surface p-8 md:p-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Standby</p>
        <h2 className="mt-4 font-display text-3xl tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">{body}</p>
        <Link href="/" className={cnButton()}>
          Return to machines
        </Link>
      </div>
    </section>
  );
}

function cnButton() {
  return `${buttonClassName("outline")} mt-8`;
}
