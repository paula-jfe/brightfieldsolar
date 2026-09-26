// @vitest-environment node
import { test } from "vitest";
import assert from "node:assert/strict";
import { calculateSolarEstimate, DEFAULT_COVERAGE, type SimulatorInputs } from "@/lib/calculator";
import type { CityData } from "@/data/types";

// Phoenix constants, copied from data/cities/phoenix-az.json. Duplicated
// (rather than imported) so this test doesn't depend on Node's JSON import
// syntax and stays readable as a standalone spec of the worked example.
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

// The brief's worked example, walked through exactly as described. This is
// the single most important test in the project: it's the acceptance
// criteria the brief itself provides.
//
// Row 4 is where a real UX decision lives: the brief says selecting a
// household profile "fills in the typical bill" but doesn't say what happens
// to coverage. The only reading that reproduces the brief's own numbers
// (8 panels / $6,930.00 / $84.24 / 6.9 years, and its claim that the raw ask
// was 7 panels) is that selecting a profile also resets coverage to the
// 80% default. See the README for how this was investigated.
test("worked example from the challenge brief, Phoenix data", () => {
  // 1. Initial state: $220 bill, 80% coverage
  assertResult(
    { monthlyBill: 220, coverage: 0.8 },
    { panelCount: 17, investmentAfterFederal: 14726.25, monthlySavings: 179.01, paybackYears: 6.9 },
    "row 1: initial state"
  );

  // 2. Select "House with a pool and an EV in the garage" ($430 bill), coverage unchanged at 80%
  assertResult(
    { monthlyBill: 430, coverage: 0.8 },
    { panelCount: 33, investmentAfterFederal: 28586.25, monthlySavings: 347.49, paybackYears: 6.9 },
    "row 2: select pool + EV profile"
  );

  // 3. Raise coverage to 100% (bill stays $430) — savings cap kicks in here:
  // raw generation is worth $431.73/mo but the bill is $430, so savings cap
  // at $430 and $1.73 becomes a utility credit.
  const row3 = assertResult(
    { monthlyBill: 430, coverage: 1.0 },
    { panelCount: 41, investmentAfterFederal: 35516.25, monthlySavings: 430.0, paybackYears: 6.9 },
    "row 3: raise coverage to 100%"
  );
  assert.equal(row3.isSavingsCapped, true, "row 3: savings should be capped");
  assert.equal(round2(row3.excessCreditValue), 1.73, "row 3: excess credit");

  // 4. Select "Apartment or small condo" ($90 bill) — per the decision above,
  // this resets coverage to 80%. Raw ask is 7 panels; minPanels (8) applies.
  const row4 = assertResult(
    { monthlyBill: 90, coverage: DEFAULT_COVERAGE },
    { panelCount: 8, investmentAfterFederal: 6930.0, monthlySavings: 84.24, paybackYears: 6.9 },
    "row 4: select apartment profile"
  );
  assert.equal(row4.isMinPanelsApplied, true, "row 4: minPanels should apply");
  assert.equal(row4.rawPanelCount < 8, true, "row 4: raw ask should be below minPanels");
  assert.equal(Math.ceil(row4.rawPanelCount), 7, "row 4: raw ask, rounded up, should be 7");

  // 5. Manually lower the bill to $60 (coverage stays 80%). minPanels still
  // binds (8 panels), and now savings are capped at the $60 bill.
  const row5 = assertResult(
    { monthlyBill: 60, coverage: DEFAULT_COVERAGE },
    { panelCount: 8, investmentAfterFederal: 6930.0, monthlySavings: 60.0, paybackYears: 9.6 },
    "row 5: lower bill to $60"
  );
  assert.equal(row5.isMinPanelsApplied, true, "row 5: minPanels should still apply");
  assert.equal(row5.isSavingsCapped, true, "row 5: savings should be capped");

  // 6. Manually lower coverage to 50% (bill stays $60). Nothing changes:
  // minPanels was already binding, so a lower coverage target doesn't
  // shrink the system further, and savings were already capped by the bill.
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
  // 220/0.15 * 0.8 / panelGen(70.2) = 16.714... must become 17, not 16.
  const result = calculateSolarEstimate(phoenix, { monthlyBill: 220, coverage: 0.8 });
  assert.equal(result.panelCount, 17);
});

test("investment and generation use the final (post-minPanels) panel count, not the raw one", () => {
  // At $90/80%, raw ask is ~5.7 panels but minPanels=8 applies. Investment
  // must be priced on 8 panels, not on the smaller raw figure.
  const result = calculateSolarEstimate(phoenix, { monthlyBill: 90, coverage: 0.8 });
  const expectedInvestment = 8 * phoenix.panelWatts * phoenix.costPerWattInstalled * (1 - phoenix.federalCreditRate);
  assert.equal(round2(result.investmentAfterFederal), round2(expectedInvestment));
});
