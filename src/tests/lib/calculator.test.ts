// @vitest-environment node
// Calculator tests, including the brief's six-step worked example.
import { test } from "vitest";
import assert from "node:assert/strict";
import { calculateSolarEstimate, DEFAULT_COVERAGE, type SimulatorInputs } from "@/lib/calculator";
import type { CityData } from "@/data/types";

const phoenix: Pick<
  CityData,
  | "utilityRatePerKwh"
  | "peakSunHoursPerDay"
  | "panelWatts"
  | "performanceRatio"
  | "costPerWattInstalled"
  | "minPanels"
  | "federalCreditRate"
> = {
  utilityRatePerKwh: 0.15,
  peakSunHoursPerDay: 6.5,
  panelWatts: 450,
  performanceRatio: 0.8,
  costPerWattInstalled: 2.75,
  minPanels: 8,
  federalCreditRate: 0.3,
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function assertResult(
  inputs: SimulatorInputs,
  expected: { panelCount: number; investmentAfterFederal: number; monthlySavings: number; paybackYears: number },
  label: string
) {
  const result = calculateSolarEstimate(phoenix, inputs);
  assert.equal(result.panelCount, expected.panelCount, `${label}: panelCount`);
  assert.equal(
    round2(result.investmentAfterFederal),
    expected.investmentAfterFederal,
    `${label}: investmentAfterFederal`
  );
  assert.equal(round2(result.monthlySavings), expected.monthlySavings, `${label}: monthlySavings`);
  assert.equal(Math.round(result.paybackYears * 10) / 10, expected.paybackYears, `${label}: paybackYears`);
  return result;
}

test("worked example from the challenge brief, Phoenix data", () => {
  assertResult(
    { monthlyBill: 220, coverage: 0.8 },
    { panelCount: 17, investmentAfterFederal: 14726.25, monthlySavings: 179.01, paybackYears: 6.9 },
    "row 1: initial state"
  );

  assertResult(
    { monthlyBill: 430, coverage: 0.8 },
    { panelCount: 33, investmentAfterFederal: 28586.25, monthlySavings: 347.49, paybackYears: 6.9 },
    "row 2: select pool + EV profile"
  );

  const row3 = assertResult(
    { monthlyBill: 430, coverage: 1.0 },
    { panelCount: 41, investmentAfterFederal: 35516.25, monthlySavings: 430.0, paybackYears: 6.9 },
    "row 3: raise coverage to 100%"
  );
  assert.equal(row3.isSavingsCapped, true, "row 3: savings should be capped");
  assert.equal(round2(row3.excessCreditValue), 1.73, "row 3: excess credit");

  const row4 = assertResult(
    { monthlyBill: 90, coverage: DEFAULT_COVERAGE },
    { panelCount: 8, investmentAfterFederal: 6930.0, monthlySavings: 84.24, paybackYears: 6.9 },
    "row 4: select apartment profile"
  );
  assert.equal(row4.isMinPanelsApplied, true, "row 4: minPanels should apply");
  assert.equal(row4.rawPanelCount < 8, true, "row 4: raw ask should be below minPanels");
  assert.equal(Math.ceil(row4.rawPanelCount), 7, "row 4: raw ask, rounded up, should be 7");

  const row5 = assertResult(
    { monthlyBill: 60, coverage: DEFAULT_COVERAGE },
    { panelCount: 8, investmentAfterFederal: 6930.0, monthlySavings: 60.0, paybackYears: 9.6 },
    "row 5: lower bill to $60"
  );
  assert.equal(row5.isMinPanelsApplied, true, "row 5: minPanels should still apply");
  assert.equal(row5.isSavingsCapped, true, "row 5: savings should be capped");

  const row6 = assertResult(
    { monthlyBill: 60, coverage: 0.5 },
    { panelCount: 8, investmentAfterFederal: 6930.0, monthlySavings: 60.0, paybackYears: 9.6 },
    "row 6: lower coverage to 50%"
  );
  assert.equal(row6.isMinPanelsApplied, true, "row 6: minPanels should still apply");
  assert.equal(row6.isSavingsCapped, true, "row 6: savings should still be capped");
});

test("edge case: coverage and bill at the slider minimums does not throw or divide by zero", () => {
  const result = calculateSolarEstimate(phoenix, { monthlyBill: 40, coverage: 0.5 });
  assert.equal(Number.isFinite(result.panelCount), true);
  assert.equal(Number.isFinite(result.investmentAfterFederal), true);
  assert.equal(Number.isFinite(result.monthlySavings), true);
  assert.equal(Number.isFinite(result.paybackYears), true);
});

test("edge case: coverage and bill at the slider maximums does not throw", () => {
  const result = calculateSolarEstimate(phoenix, { monthlyBill: 600, coverage: 1.0 });
  assert.equal(Number.isFinite(result.panelCount), true);
  assert.equal(Number.isFinite(result.investmentAfterFederal), true);
  assert.equal(Number.isFinite(result.monthlySavings), true);
  assert.equal(Number.isFinite(result.paybackYears), true);
});

test("panel count always rounds up, never down", () => {
  const result = calculateSolarEstimate(phoenix, { monthlyBill: 220, coverage: 0.8 });
  assert.equal(result.panelCount, 17);
});

test("investment and generation use the final (post-minPanels) panel count, not the raw one", () => {
  const result = calculateSolarEstimate(phoenix, { monthlyBill: 90, coverage: 0.8 });
  const expectedInvestment = 8 * phoenix.panelWatts * phoenix.costPerWattInstalled * (1 - phoenix.federalCreditRate);
  assert.equal(round2(result.investmentAfterFederal), round2(expectedInvestment));
});
