import { HttpError } from "../middleware/errorHandler.js";
import type { BikeDataProvider, BikeQuery, ExternalBike } from "./bike-data-provider.js";

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && trimmed.toLowerCase() !== "n/a" ? trimmed : null;
}

function asNumberish(value: unknown): string | number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return asString(value);
}

function mapCategory(type: string | null): string | null {
  if (!type) return null;
  const key = type.toLowerCase();
  if (key.includes("super") && key.includes("sport")) return "supersport";
  if (key.includes("superbike") || key.includes("super bike")) return "superbike";
  if (key.includes("naked") || key.includes("streetfighter")) return "naked";
  if (key.includes("sport")) return "sport";
  if (key.includes("track") || key.includes("race")) return "track";
  return key.replace(/\s+/g, "-");
}

function parseBoreStroke(value: string | null): { bore: string | null; stroke: string | null } {
  if (!value) return { bore: null, stroke: null };
  const match = value.match(/([\d.]+)\s*[x×]\s*([\d.]+)/i);
  if (!match) return { bore: null, stroke: null };
  return { bore: match[1] ?? null, stroke: match[2] ?? null };
}

export class ApiNinjasProvider implements BikeDataProvider {
  constructor(private readonly apiKey: string, private readonly baseUrl: string) {}

  private async fetchRows(params: URLSearchParams): Promise<ExternalBike[]> {
    if (!this.apiKey) throw new HttpError(503, "API_NINJAS_API_KEY is not configured");
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/v1/motorcycles?${params}`, {
        headers: { "X-Api-Key": this.apiKey },
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      throw new HttpError(503, `API Ninjas unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!response.ok) {
      throw new HttpError(response.status === 401 ? 502 : 503, `API Ninjas returned HTTP ${response.status}`);
    }
    const rows = await response.json() as unknown;
    if (!Array.isArray(rows)) throw new HttpError(502, "API Ninjas returned an unsupported response");
    return rows.map((row) => this.map(row as Record<string, unknown>));
  }

  private map(v: Record<string, unknown>): ExternalBike {
    const make = String(v.make ?? "").trim();
    const model = String(v.model ?? "").trim();
    const year = Number.isFinite(Number(v.year)) ? Number(v.year) : null;
    const type = asString(v.type);
    const boreStroke = parseBoreStroke(asString(v.bore_stroke));
    return {
      externalId: `${make}-${model}-${year ?? ""}`.toLowerCase().replace(/\W+/g, "-"),
      source: "api-ninjas",
      brand: make,
      model,
      year,
      category: mapCategory(type),
      power: asNumberish(v.power),
      torque: asNumberish(v.torque),
      weight: asNumberish(v.total_weight ?? v.dry_weight),
      displacement: asNumberish(v.displacement),
      topSpeed: asNumberish(v.top_speed),
      seatHeight: asNumberish(v.seat_height),
      fuelCapacity: asNumberish(v.fuel_capacity),
      length: asNumberish(v.total_length),
      wheelbase: asNumberish(v.wheelbase),
      engineConfiguration: asString(v.engine),
      cooling: asString(v.cooling),
      compressionRatio: asString(v.compression),
      bore: boreStroke.bore,
      stroke: boreStroke.stroke,
      frame: asString(v.frame),
      frontSuspension: asString(v.front_suspension),
      rearSuspension: asString(v.rear_suspension),
      frontBrake: asString(v.front_brakes),
      rearBrake: asString(v.rear_brakes),
      frontTyre: asString(v.front_tire),
      rearTyre: asString(v.rear_tire),
      description: [make, model, year].filter(Boolean).join(" "),
      raw: v,
    };
  }

  async getBike(id: string) {
    const rows = await this.fetchRows(new URLSearchParams({ model: id }));
    if (!rows[0]) throw new HttpError(404, "Bike not found at API Ninjas");
    return rows[0];
  }

  searchBikes(query: string) {
    return this.fetchRows(new URLSearchParams({ model: query }));
  }

  getBikes(params: BikeQuery) {
    const query = new URLSearchParams();
    if (params.brand) query.set("make", params.brand);
    if (params.q) query.set("model", params.q);
    if (params.year) query.set("year", String(params.year));
    if (params.offset != null) query.set("offset", String(params.offset));
    return this.fetchRows(query);
  }
}
