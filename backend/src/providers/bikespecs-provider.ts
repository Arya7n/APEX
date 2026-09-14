import { HttpError } from "../middleware/errorHandler.js";
import type { BikeDataProvider, BikeQuery, ExternalBike } from "./bike-data-provider.js";

export class BikeSpecsProvider implements BikeDataProvider {
  constructor(private readonly apiKey: string, private readonly baseUrl: string) {}

  private async request(path: string): Promise<unknown> {
    let last: Error | null = null;
    for (const headers of [
      { Authorization: `Bearer ${this.apiKey}` },
      { "X-Api-Key": this.apiKey },
    ] as Array<Record<string, string>>) {
      try {
        const response = await fetch(`${this.baseUrl}${path}`, { headers, signal: AbortSignal.timeout(10_000) });
        if (response.ok) return response.json();
        last = new Error(`HTTP ${response.status}`);
      } catch (error) { last = error instanceof Error ? error : new Error(String(error)); }
    }
    throw new HttpError(503, `BikeSpecs provider unavailable: ${last?.message ?? "request failed"}`);
  }

  private map(value: unknown): ExternalBike {
    const v = value as Record<string, unknown>;
    return {
      externalId: String(v.id ?? v.externalId ?? `${v.make ?? v.brand}-${v.model}-${v.year ?? ""}`),
      source: "bikespecs", brand: String(v.make ?? v.brand ?? ""), model: String(v.model ?? ""),
      variant: typeof v.variant === "string" ? v.variant : null,
      year: Number.isFinite(Number(v.year)) ? Number(v.year) : null,
      power: v.power as string | number | null, torque: v.torque as string | number | null,
      weight: v.weight as string | number | null, displacement: v.displacement as string | number | null,
      topSpeed: (v.topSpeed ?? v.top_speed) as string | number | null,
      seatHeight: (v.seatHeight ?? v.seat_height) as string | number | null,
      fuelCapacity: (v.fuelCapacity ?? v.fuel_capacity) as string | number | null,
      raw: v,
    };
  }
  async getBike(id: string) { return this.map(await this.request(`/motorcycles/${encodeURIComponent(id)}`)); }
  async searchBikes(query: string) {
    const data = await this.request(`/motorcycles?search=${encodeURIComponent(query)}`);
    return this.list(data);
  }
  async getBikes(params: BikeQuery) {
    const entries: Array<[string, string]> = Object.entries(params).map(([k, v]) => [k, String(v)]);
    const data = await this.request(`/motorcycles?${new URLSearchParams(entries)}`);
    return this.list(data);
  }
  private list(data: unknown) {
    const rows = Array.isArray(data) ? data : ((data as Record<string, unknown>)?.data ?? (data as Record<string, unknown>)?.results);
    if (!Array.isArray(rows)) throw new HttpError(502, "BikeSpecs returned an unsupported response");
    return rows.map((row) => this.map(row));
  }
}
