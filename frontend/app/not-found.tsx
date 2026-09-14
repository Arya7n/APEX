import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-end px-5 pb-24 pt-40 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">404</p>
      <h1 className="mt-6 font-display text-5xl tracking-tight md:text-8xl">Signal lost</h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        This machine is not in the APEX archive — or the route does not exist.
      </p>
      <Link href="/" className={`${buttonClassName("outline")} mt-10 w-fit`}>
        Return to showroom
      </Link>
    </div>
  );
}
