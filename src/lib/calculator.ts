/**
 * Solar savings calculator.
 *
 * Pure functions, no React/Next imports. This lets the same code run on the
 * server (for the simulator's initial render) and in the browser (for live
 * recomputation on every slider/profile change), and makes it trivially
 * unit-testable in isolation — see calculator.test.ts, which checks this
 * module against the worked example in the challenge brief.
 *
 * Formula order follows the brief exactly:
 *   1. monthly consumption = bill / utility rate
 *   2. consumption to cover = monthly consumption × coverage%
 *   3. one panel's monthly generation = panel kW × peak sun hours × 30 × performance ratio
 *   4. panel count = ceil(consumption to cover / one panel's generation), floored at minPanels
 *   5. total generation = panel count × one panel's generation (uses the FINAL panel count)
 *   6. investment = panel count × panel watts × cost per watt, minus federal credit
 *   7. monthly savings = total generation × utility rate, capped at the bill
 *   8. payback years = investment after credit / (monthly savings × 12)
 */

import type { CityData } from "@/data/types";

/** Simulator slider bounds and step, per the brief. */
export const BILL_MIN = 40;
export const BILL_MAX = 600;
export const BILL_STEP = 10;
export const COVERAGE_MIN = 0.5;
export const COVERAGE_MAX = 1;
export const COVERAGE_STEP = 0.05;

/**
 * Coverage the simulator resets to when a household profile is selected.
 * The brief only says a profile "fills in the typical bill" — it's silent
 * on coverage. 80% is also the suggested initial state the brief itself
 * uses, so reusing it as the profile-selection default keeps one meaning
 * for "default coverage" instead of two. See calculator.test.ts and the
 * README for how this was confirmed against the worked example.
 */
export const DEFAULT_COVERAGE = 0.8;

export interface SimulatorInputs {
  /** Monthly electric bill in dollars. Brief range: 40–600, step 10. */
  monthlyBill: number;
  /** Fraction of usage to cover, 0–1. Brief range: 0.5–1.0, step 0.05. */
  coverage: number;
}

export interface SimulatorResult {
  panelCount: number;
  /** Investment in dollars after the federal credit is applied. */
  investmentAfterFederal: number;
  /** Monthly savings in dollars, capped at the monthly bill. */
  monthlySavings: number;
  /** Years to recoup the investment. */
  paybackYears: number;

  /** True when minPanels pushed the system above what the raw math asked for. */
  isMinPanelsApplied: boolean;
  /** True when generation exceeded the bill and savings were capped. */
  isSavingsCapped: boolean;
  /** Dollar value of generation beyond the bill, turned into a utility credit. Only meaningful when isSavingsCapped. */
  excessCreditValue: number;
  /** The panel count the raw math would have produced, before the minPanels floor. Only meaningful when isMinPanelsApplied. */
  rawPanelCount: number;
}

export function calculateSolarEstimate(
  city: Pick<
    CityData,
    | "utilityRatePerKwh"
    | "peakSunHoursPerDay"
    | "panelWatts"
    | "performanceRatio"
    | "costPerWattInstalled"
    | "minPanels"
    | "federalCreditRate"
  >,
  { monthlyBill, coverage }: SimulatorInputs
): SimulatorResult {
  const monthlyConsumptionKwh = monthlyBill / city.utilityRatePerKwh;
  const consumptionToCoverKwh = monthlyConsumptionKwh * coverage;

  const panelMonthlyGenerationKwh =
    (city.panelWatts / 1000) * city.peakSunHoursPerDay * 30 * city.performanceRatio;

  const rawPanelCount = consumptionToCoverKwh / panelMonthlyGenerationKwh;
  const roundedUpPanelCount = Math.ceil(rawPanelCount);
  const panelCount = Math.max(roundedUpPanelCount, city.minPanels);
  const isMinPanelsApplied = panelCount > roundedUpPanelCount;

  const totalGenerationKwh = panelCount * panelMonthlyGenerationKwh;

  const investmentGross = panelCount * city.panelWatts * city.costPerWattInstalled;
  const investmentAfterFederal = investmentGross * (1 - city.federalCreditRate);

  const rawMonthlySavings = totalGenerationKwh * city.utilityRatePerKwh;
  const isSavingsCapped = rawMonthlySavings > monthlyBill;
  const monthlySavings = Math.min(rawMonthlySavings, monthlyBill);
  const excessCreditValue = isSavingsCapped ? rawMonthlySavings - monthlyBill : 0;

  const paybackYears = investmentAfterFederal / (monthlySavings * 12);

  return {
    panelCount,
    investmentAfterFederal,
    monthlySavings,
    paybackYears,
    isMinPanelsApplied,
    isSavingsCapped,
    excessCreditValue,
    rawPanelCount,
  };
}
