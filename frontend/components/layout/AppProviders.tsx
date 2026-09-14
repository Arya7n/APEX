"use client";

import { SearchProvider } from "@/components/search/SearchProvider";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Navbar } from "@/components/layout/Navbar";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <Navbar />
      <SearchOverlay />
      {children}
    </SearchProvider>
  );
}
