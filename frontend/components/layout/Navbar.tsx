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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
            "flex h-14 items-center justify-between border px-3 sm:px-4 md:h-16 md:px-6",
            scrolled
              ? "border-line bg-background/78 backdrop-blur-md"
              : "border-transparent bg-background/35 backdrop-blur-sm",
          )}
        >
          <Link
            href="/"
            onClick={closeMenu}
            className="font-display text-base tracking-[0.18em] text-foreground sm:text-lg sm:tracking-[0.22em]"
          >
            APEX
          </Link>

          <ul className="hidden items-center gap-5 xl:flex 2xl:gap-7">
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

          <div className="flex items-center gap-0.5 sm:gap-1">
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
              className="hidden px-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted transition-colors hover:text-foreground lg:block"
            >
              Garage
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-muted xl:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
            </button>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-background/96 pt-24 pb-10 xl:hidden">
          <ul className="flex flex-col gap-1 px-6 sm:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-3 font-display text-3xl tracking-tight text-foreground sm:text-4xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/garage"
                onClick={closeMenu}
                className="block py-3 font-display text-3xl tracking-tight sm:text-4xl"
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
