"use client";

import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-end px-5 pb-24 pt-40 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Fault</p>
      <h1 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">Telemetry interrupted</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        APEX hit an unexpected error. Recalibrate, or return to the showroom.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className={buttonClassName("solid")}>
          Recalibrate
        </button>
        <Link href="/" className={buttonClassName("outline")}>
          Return to showroom
        </Link>
      </div>
    </div>
  );
}
