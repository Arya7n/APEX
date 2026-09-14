import type { MetadataRoute } from "next";
import { getArticles, getBikes } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = ["", "/explore", "/compare", "/lab", "/rankings", "/learn", "/find-your-bike", "/garage"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
  const [bikes, articles] = await Promise.all([getBikes({ limit: 100 }).then((r) => r.items).catch(() => []), getArticles().catch(() => [])]);
  return [...routes, ...bikes.map((b) => ({ url: `${base}/bike/${b.slug}`, lastModified: new Date(b.metadata?.updatedAt ?? Date.now()) })), ...articles.map((a) => ({ url: `${base}/learn/${a.slug}`, lastModified: new Date(a.publishedAt) }))];
}
