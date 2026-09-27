// @vitest-environment node
// Formatting helper tests.
import { test } from "vitest";
import assert from "node:assert/strict";
import {
  formatCurrency,
  formatCurrencyPrecise,
  formatPercent,
  formatYears,
  formatPanelCount,
} from "@/lib/format";

test("formatCurrency rounds to whole dollars with a $ sign and thousands separator", () => {
  assert.equal(formatCurrency(14726.25), "$14,726");
  assert.equal(formatCurrency(90), "$90");
});

test("formatCurrencyPrecise keeps exactly two decimal places", () => {
  assert.equal(formatCurrencyPrecise(14726.25), "$14,726.25");
  assert.equal(formatCurrencyPrecise(60), "$60.00");
  assert.equal(formatCurrencyPrecise(179.014), "$179.01");
});

test("formatPercent converts a 0-1 fraction to a whole-number percent", () => {
  assert.equal(formatPercent(0.8), "80%");
  assert.equal(formatPercent(0.5), "50%");
  assert.equal(formatPercent(1), "100%");
});

test("formatYears keeps one decimal place", () => {
  assert.equal(formatYears(6.857), "6.9 years");
  assert.equal(formatYears(9.625), "9.6 years");
});

test("formatPanelCount pluralizes correctly", () => {
  assert.equal(formatPanelCount(1), "1 panel");
  assert.equal(formatPanelCount(8), "8 panels");
});
