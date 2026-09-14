import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export function Footer({ archiveStatus }: { archiveStatus: "live" | "standby" }) {
  return (
    <footer className="border-t border-line px-5 py-12 md:px-10">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl tracking-[0.2em]">APEX</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Performance, engineered. A motorcycle intelligence platform — not a store.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted md:flex-row md:items-center md:justify-between">
        <p>Archive {archiveStatus}</p>
        <p>Explore · Understand · Compare</p>
      </div>
    </footer>
  );
}
