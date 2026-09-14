import type {
  AdminStats, ApiHealth, Article, AuthResult, Bike, BikeStats, ComparisonResult,
  Favorite, GarageEntry, Paginated, Questionnaire, RankingKind, Recommendation,
  SearchResult, User,
} from "@/lib/types";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

let accessToken: string | null = null;
export function setAccessToken(token: string | null) { accessToken = token; }
export function getAccessToken() { return accessToken; }

async function request<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  if (auth && accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  const response = await fetch(`${getApiBaseUrl()}${path}`, { ...init, headers, credentials: "include" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string; error?: string } | null;
    throw new Error(payload?.message ?? payload?.error ?? `APEX API error ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function queryString<T extends object>(values: T) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  const value = params.toString();
  return value ? `?${value}` : "";
}

export interface BikeFilters { brand?: string; category?: string; minPower?: number; maxPower?: number; minWeight?: number; maxWeight?: number; sort?: string; page?: number; limit?: number; q?: string }
export const getBikes = (filters: BikeFilters = {}) => request<Paginated<Bike>>(`/api/bikes${queryString(filters)}`, { next: { revalidate: 60 } });
export const searchBikes = (q: string) => request<Paginated<Bike>>(`/api/bikes/search${queryString({ q })}`, { cache: "no-store" });
export const getBike = (slug: string) => request<Bike>(`/api/bikes/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
export const getSimilar = (slug: string) => request<Bike[]>(`/api/bikes/${encodeURIComponent(slug)}/similar`, { next: { revalidate: 60 } });
export const getStats = (slug: string) => request<BikeStats>(`/api/bikes/${encodeURIComponent(slug)}/stats`, { next: { revalidate: 60 } });
export const compareBikes = (slugs: string[]) => request<ComparisonResult>("/api/comparisons", { method: "POST", body: JSON.stringify({ slugs }) });
export const getRanking = (kind: RankingKind) => request<Bike[]>(`/api/rankings/${kind}`, { next: { revalidate: 60 } });
export const getArticles = () => request<Article[]>("/api/articles", { next: { revalidate: 300 } });
export const getArticle = (slug: string) => request<Article>(`/api/articles/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
export const searchAll = (q: string) => request<SearchResult>(`/api/search${queryString({ q })}`, { cache: "no-store" });
export const getRecommendations = (body: Questionnaire) => request<Recommendation[]>("/api/recommendations", { method: "POST", body: JSON.stringify(body) });

export async function login(email: string, password: string) {
  const result = await request<AuthResult>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  setAccessToken(result.accessToken); return result;
}
export async function register(email: string, password: string, name: string) {
  const result = await request<AuthResult>("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) });
  setAccessToken(result.accessToken); return result;
}
export const me = () => request<User>("/api/auth/me", {}, true);
export const logout = async () => { await request<void>("/api/auth/logout", { method: "POST" }, true); setAccessToken(null); };
export async function refreshAuth(refreshToken: string) {
  const tokens = await request<Pick<AuthResult, "accessToken" | "refreshToken">>("/api/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) });
  setAccessToken(tokens.accessToken);
  return { ...tokens, user: await me() };
}
export const getGarage = () => request<GarageEntry[]>("/api/garage", {}, true);
export const addGarage = (bikeId: string, details: Partial<Pick<GarageEntry, "nickname" | "notes" | "category">> = {}) => request<GarageEntry>("/api/garage", { method: "POST", body: JSON.stringify({ bike: bikeId, ...details }) }, true);
export const removeGarage = (id: string) => request<void>(`/api/garage/${id}`, { method: "DELETE" }, true);
export const getFavorites = () => request<Favorite[]>("/api/favorites", {}, true);
export const addFavorite = (bikeId: string) => request<Favorite>(`/api/favorites/${bikeId}`, { method: "POST" }, true);
export const removeFavorite = (bikeId: string) => request<void>(`/api/favorites/${bikeId}`, { method: "DELETE" }, true);
export const getAdminStats = () => request<AdminStats>("/api/admin/stats", {}, true);
export const importAdminBike = (id: string) => request<Bike>("/api/admin/bikes/import", { method: "POST", body: JSON.stringify({ id }) }, true);

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
