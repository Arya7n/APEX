import { env } from "../config/env.js";
import type { BikeDataProvider } from "./bike-data-provider.js";
import { ApiNinjasProvider } from "./api-ninjas-provider.js";
import { BikeSpecsProvider } from "./bikespecs-provider.js";

export function getBikeDataProvider(): BikeDataProvider {
  if (env.BIKE_DATA_PROVIDER === "api-ninjas") {
    return new ApiNinjasProvider(env.API_NINJAS_API_KEY, env.API_NINJAS_API_BASE_URL);
  }
  return new BikeSpecsProvider(env.BIKESPECS_API_KEY, env.BIKESPECS_API_BASE_URL);
}
