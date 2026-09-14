import type { ApiHealth } from "@/lib/types";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export async function getApiHealth(): Promise<ApiHealth | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiHealth;
  } catch {
    return null;
  }
}
