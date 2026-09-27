// Registry of the cities this site can render.
import type { CityData } from "./types";
import phoenixAz from "./cities/phoenix-az.json" with { type: "json" };

const cities = {
  "phoenix-az": phoenixAz satisfies CityData,
} as const satisfies Record<string, CityData>;

export type CitySlug = keyof typeof cities;

export const DEFAULT_CITY_SLUG: CitySlug = "phoenix-az";

export function getCityBySlug(slug: string): CityData | undefined {
  return cities[slug as CitySlug];
}

export function getAllCitySlugs(): CitySlug[] {
  return Object.keys(cities) as CitySlug[];
}
