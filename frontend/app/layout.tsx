import type { Metadata } from "next";
import { Geist, Syne, IBM_Plex_Mono } from "next/font/google";
import { AppProviders } from "@/components/layout/AppProviders";
import { Footer } from "@/components/layout/Footer";
import { getApiHealth } from "@/lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "APEX — Performance, Engineered.",
    template: "%s | APEX",
  },
  description:
    "Explore the world's most iconic performance motorcycles. Specs, comparison, and performance intelligence.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const health = await getApiHealth();
  const archiveStatus = health?.status === "ok" ? "live" : "standby";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${syne.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <div className="apex-grain" aria-hidden="true" />
        <AppProviders>
          <div className="flex min-h-full flex-col">
            <main className="flex-1">{children}</main>
            <Footer archiveStatus={archiveStatus} />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
