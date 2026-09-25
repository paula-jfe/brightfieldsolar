/**
 * Formatting helpers. Centralized so the whole app agrees on locale/units —
 * the brief's own worked-example table uses pt-BR-style punctuation
 * ("$14.726,25") because it's written in Portuguese, but this is a US city
 * page for a US audience, so everything here formats as US English.
 */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(fraction: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(fraction);
}

export function formatYears(years: number): string {
  const rounded = Math.round(years * 10) / 10;
  return `${rounded.toFixed(1)} years`;
}

export function formatPanelCount(count: number): string {
  return `${count} ${count === 1 ? "panel" : "panels"}`;
}
