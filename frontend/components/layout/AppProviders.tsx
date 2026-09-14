"use client";

import { SearchProvider } from "@/components/search/SearchProvider";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Navbar } from "@/components/layout/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);
  return (
    <SearchProvider>
      <Navbar />
      <SearchOverlay />
      {children}
    </SearchProvider>
  );
}
