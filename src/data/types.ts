/**
 * City data schema.
 *
 * This is the single source of truth for everything that differs from one
 * Brightfield Solar city page to the next. It mirrors the JSON schema from
 * the challenge brief field-for-field. A new city is added by dropping a new
 * JSON file that satisfies this type into `src/data/cities/` and registering
 * it in `src/data/cities.ts` — no component or page code changes.
 */

export interface HouseholdProfile {
  /** e.g. "Three-bedroom house, no pool" */
  label: string;
  /** Typical monthly bill in dollars for this profile. Used to prefill the simulator. */
  typicalBill: number;
  /**
   * Optional shorter label for narrow (mobile) layouts, where the full label
   * wraps to three lines inside a half-width card. Falls back to `label`.
   */
  shortLabel?: string;
  /**
   * Optional illustrative icon shown on desktop cards: "apartment", "house",
   * "houseAC" or "pool". Typed as string because JSON imports widen literals;
   * unknown values simply render no icon.
   */
  icon?: string;
}

export interface Crew {
  name: string;
  installs: number;
  rating: number;
  /** Year the crew started, e.g. 2019 */
  since: number;
  blurb: string;
  /** Optional photo path under /public. A neutral placeholder is shown when missing. */
  photo?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  neighborhood: string;
  /** ISO date string, e.g. "2025-08-11" */
  date: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface CityData {
  /** URL-safe identifier, also used as the route segment: /[slug] */
  slug: string;
  city: string;
  state: string;
  stateFull: string;
  metroArea: string;

  // --- Calculator inputs (see src/lib/calculator.ts for how these combine) ---
  utilityName: string;
  /** Dollars per kWh */
  utilityRatePerKwh: number;
  peakSunHoursPerDay: number;
  /** Rated wattage of a single panel */
  panelWatts: number;
  /** 0-1, accounts for real-world system losses */
  performanceRatio: number;
  costPerWattInstalled: number;
  /** Minimum number of panels for any installation in this city */
  minPanels: number;
  /** 0-1, e.g. 0.3 for the 30% federal tax credit */
  federalCreditRate: number;
  /** Informational only — never used in the calculator, see brief */
  stateIncentiveNote: string;

  // --- Trust / social proof content ---
  installsCompleted: number;
  crewsAvailable: number;
  avgRating: number;
  avgPermitDays: number;
  phone: string;
  popularNeighborhoods: string[];
  householdProfiles: HouseholdProfile[];
  crews: Crew[];
  testimonials: Testimonial[];
  faq: FaqEntry[];
}
