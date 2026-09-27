// Solar estimate for a city, following the brief's formula step by step.
import type { CityData } from "@/data/types";

export const BILL_MIN = 40;
export const BILL_MAX = 600;
export const BILL_STEP = 10;
export const COVERAGE_MIN = 0.5;
export const COVERAGE_MAX = 1;
export const COVERAGE_STEP = 0.05;

export const DEFAULT_COVERAGE = 0.8;

export interface SimulatorInputs {
  monthlyBill: number;
  coverage: number;
}

export interface SimulatorResult {
  panelCount: number;
  investmentAfterFederal: number;
  monthlySavings: number;
  paybackYears: number;

  isMinPanelsApplied: boolean;
  isSavingsCapped: boolean;
  excessCreditValue: number;
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
