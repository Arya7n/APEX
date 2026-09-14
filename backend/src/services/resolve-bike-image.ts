const USER_AGENT = "APEXBikeArchive/0.1 (local-dev; motorcycle-catalog-sync)";

type CommonsPage = {
  title?: string;
  imageinfo?: Array<{ url?: string; mime?: string; width?: number; height?: number }>;
};

function titleCandidates(brand: string, model: string): string[] {
  const compact = `${brand} ${model}`.replace(/\s+/g, " ").trim();
  const noYear = compact.replace(/\b(19|20)\d{2}\b/g, "").replace(/\s+/g, " ").trim();
  const underscored = noYear.replace(/\s+/g, "_");
  const spaced = noYear;
  const brandModel = `${brand}_${model.split(/\s+/)[0] ?? ""}`.replace(/_+/g, "_");
  return [...new Set([underscored, spaced.replace(/\s+/g, "_"), brandModel, noYear])].filter(Boolean);
}

async function fromWikipedia(brand: string, model: string): Promise<string | null> {
  for (const title of titleCandidates(brand, model)) {
    const url = new URL("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title));
    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      continue;
    }
    if (!response.ok) continue;
    const payload = (await response.json()) as {
      type?: string;
      thumbnail?: { source?: string };
      originalimage?: { source?: string };
    };
    if (payload.type === "disambiguation") continue;
    const image = payload.originalimage?.source ?? payload.thumbnail?.source;
    if (image?.startsWith("https://")) return image;
  }
  return null;
}

async function fromCommons(brand: string, model: string, year?: number | null): Promise<string | null> {
  const queries = [
    `${brand} ${model} ${year ?? ""} motorcycle`.replace(/\s+/g, " ").trim(),
    `${brand} ${model} motorcycle`,
    `${brand} ${model}`,
  ];

  for (const search of queries) {
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("format", "json");
    url.searchParams.set("origin", "*");
    url.searchParams.set("generator", "search");
    url.searchParams.set("gsrnamespace", "6");
    url.searchParams.set("gsrsearch", search);
    url.searchParams.set("gsrlimit", "8");
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url|mime|size");

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(12_000),
      });
    } catch {
      continue;
    }
    if (!response.ok) continue;

    const payload = (await response.json()) as { query?: { pages?: Record<string, CommonsPage> } };
    const pages = Object.values(payload.query?.pages ?? {});
    const scored = pages
      .map((page) => {
        const info = page.imageinfo?.[0];
        const imageUrl = info?.url;
        const mime = info?.mime ?? "";
        if (!imageUrl || !mime.startsWith("image/")) return null;
        if (mime.includes("svg")) return null;
        const title = (page.title ?? "").toLowerCase();
        if (title.includes("logo") || title.includes("icon") || title.includes("badge")) return null;
        const area = (info?.width ?? 0) * (info?.height ?? 0);
        const brandHit = title.includes(brand.toLowerCase().split(/\s+/)[0] ?? "");
        return { imageUrl, score: area + (brandHit ? 1_000_000 : 0) };
      })
      .filter((row): row is { imageUrl: string; score: number } => Boolean(row))
      .sort((a, b) => b.score - a.score);

    if (scored[0]?.imageUrl) return scored[0].imageUrl;
  }

  return null;
}

/**
 * Resolve a representative motorcycle photo.
 * API Ninjas does not provide images — Wikipedia/Commons are the dynamic photo sources.
 */
export async function resolveMotorcycleImageUrl(
  brand: string,
  model: string,
  year?: number | null,
): Promise<string | null> {
  return (await fromWikipedia(brand, model)) ?? (await fromCommons(brand, model, year));
}
