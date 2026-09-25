import { formatCurrency } from "@/lib/format";

/**
 * Visualizes the monthly bill split into "what you'd still pay with solar"
 * vs. "what solar saves you" as a segmented bar, matching the Figma design.
 * Segment widths are percentages of the bill, so they always sum to 100%
 * — monthlySavings is already capped at the bill (see calculator.ts), so
 * the "with solar" remainder is never negative.
 */
export function SavingsBar({ bill, monthlySavings }: { bill: number; monthlySavings: number }) {
  const withSolar = Math.max(bill - monthlySavings, 0);
  const savingsPercent = bill > 0 ? (monthlySavings / bill) * 100 : 0;
  const withSolarPercent = 100 - savingsPercent;

  return (
    <div className="w-full">
      <div className="flex justify-end text-xs text-text-on-dark-muted">
        <span>{formatCurrency(bill)}</span>
      </div>
      <div className="mt-2 flex h-4 w-full overflow-hidden rounded-full bg-border-dark">
        <div style={{ width: `${withSolarPercent}%` }} className="h-full bg-text-on-dark-muted" />
        <div style={{ width: `${savingsPercent}%` }} className="h-full bg-accent-sun" />
      </div>
      <div className="mt-2 flex justify-between text-xs font-bold">
        <span className="text-text-on-dark-muted">{formatCurrency(withSolar)} with solar</span>
        <span className="text-text-accent-on-dark">{formatCurrency(monthlySavings)} savings</span>
      </div>
    </div>
  );
}
