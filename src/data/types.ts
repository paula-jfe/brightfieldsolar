// Schema for a city data file.
export interface HouseholdProfile {
  label: string;
  typicalBill: number;
  shortLabel?: string;
  icon?: string;
}

export interface Crew {
  name: string;
  installs: number;
  rating: number;
  since: number;
  blurb: string;
  photo?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  neighborhood: string;
  date: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface CityData {
  slug: string;
  city: string;
  state: string;
  stateFull: string;
  metroArea: string;

  utilityName: string;
  utilityRatePerKwh: number;
  peakSunHoursPerDay: number;
  panelWatts: number;
  performanceRatio: number;
  costPerWattInstalled: number;
  minPanels: number;
  federalCreditRate: number;
  stateIncentiveNote: string;

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
