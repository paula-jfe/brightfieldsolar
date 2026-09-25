import type { CityData } from "./types";
import phoenixAz from "./cities/phoenix-az.json" with { type: "json" };

/**
 * Every city this deployment can render. Adding a city means: drop a new
 * JSON file in `./cities/`, import it here, and add one line to this map —
 * no page or component code changes anywhere else in the app.
 *
 * `satisfies CityData` gives compile-time type checking against the schema
 * without a runtime validation library: this data is authored by us (not
 * submitted by a visitor), so a build-time guarantee is enough.
 */
const cities = {
  // The key here must match this file's own "slug" field — that's what
  // generateStaticParams turns into the /[city] route segment.
  "phoenix-az": phoenixAz satisfies CityData,
} as const satisfies Record<string, CityData>;

export type CitySlug = keyof typeof cities;

/** The city served at the root URL ("/") when no slug is given. */
export const DEFAULT_CITY_SLUG: CitySlug = "phoenix-az";

export function getCityBySlug(slug: string): CityData | undefined {
  return cities[slug as CitySlug];
}

export function getAllCitySlugs(): CitySlug[] {
  return Object.keys(cities) as CitySlug[];
}
