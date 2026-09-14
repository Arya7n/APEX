"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useSearch } from "@/components/search/SearchProvider";

export function Navbar() {
  const pathname = usePathname();
  const { setOpen } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-3 top-3 z-50 md:inset-x-5 md:top-4",
          "transition-[background-color,border-color,backdrop-filter] duration-300",
        )}
      >
        <nav
          className={cn(
            "flex h-14 items-center justify-between border px-4 md:h-16 md:px-6",
            scrolled
              ? "border-line bg-background/78 backdrop-blur-md"
              : "border-transparent bg-background/35 backdrop-blur-sm",
          )}
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="font-display text-lg tracking-[0.22em] text-foreground"
          >
            APEX
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.28em] transition-colors",
                      active ? "text-foreground" : "text-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open search"
              className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-foreground"
            >
              <Search size={16} strokeWidth={1.6} />
            </button>
            <Link
              href="/garage"
              className="hidden px-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-foreground md:block"
            >
              Garage
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-muted lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
            </button>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 bg-background/96 pt-24 lg:hidden">
          <ul className="flex flex-col gap-2 px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-3 font-display text-4xl tracking-tight text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/garage"
                onClick={closeMenu}
                className="block py-3 font-display text-4xl tracking-tight"
              >
                Garage
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
}
