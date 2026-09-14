import { HttpError } from "../middleware/errorHandler.js";
import type { BikeDataProvider, BikeQuery, ExternalBike } from "./bike-data-provider.js";

export class ApiNinjasProvider implements BikeDataProvider {
  constructor(private readonly apiKey: string, private readonly baseUrl: string) {}
  private async fetchRows(params: URLSearchParams): Promise<ExternalBike[]> {
    if (!this.apiKey) throw new HttpError(503, "API_NINJAS_API_KEY is not configured");
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/v1/motorcycles?${params}`, {
        headers: { "X-Api-Key": this.apiKey }, signal: AbortSignal.timeout(10_000),
      });
    } catch (error) {
      throw new HttpError(503, `API Ninjas unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!response.ok) throw new HttpError(response.status === 401 ? 502 : 503, `API Ninjas returned HTTP ${response.status}`);
    const rows = await response.json() as unknown;
    if (!Array.isArray(rows)) throw new HttpError(502, "API Ninjas returned an unsupported response");
    return rows.map((row) => this.map(row as Record<string, unknown>));
  }
  private map(v: Record<string, unknown>): ExternalBike {
    const make = String(v.make ?? "");
    const model = String(v.model ?? "");
    const year = Number.isFinite(Number(v.year)) ? Number(v.year) : null;
    return {
      externalId: `${make}-${model}-${year ?? ""}`.toLowerCase().replace(/\W+/g, "-"),
      source: "api-ninjas", brand: make, model, year,
      power: v.power as string | number | null, torque: v.torque as string | number | null,
      weight: (v.total_weight ?? v.dry_weight) as string | number | null,
      displacement: v.displacement as string | number | null,
      topSpeed: v.top_speed as string | number | null,
      seatHeight: v.seat_height as string | number | null,
      fuelCapacity: v.fuel_capacity as string | number | null,
      engineConfiguration: typeof v.engine === "string" ? v.engine : null,
      raw: v,
    };
  }
  async getBike(id: string) {
    const rows = await this.fetchRows(new URLSearchParams({ model: id }));
    if (!rows[0]) throw new HttpError(404, "Bike not found at API Ninjas");
    return rows[0];
  }
  searchBikes(query: string) { return this.fetchRows(new URLSearchParams({ model: query })); }
  getBikes(params: BikeQuery) {
    const query = new URLSearchParams();
    if (params.brand) query.set("make", params.brand);
    if (params.q) query.set("model", params.q);
    if (params.year) query.set("year", String(params.year));
    return this.fetchRows(query);
  }
}
