/**
 * BikeSpecs.org implementation will live here in Phase 3.
 * The rest of APEX must depend on BikeDataProvider, never BikeSpecs payloads.
 */
export class BikeSpecsProvider {
  constructor(private readonly apiKey: string, private readonly baseUrl: string) {}
}
