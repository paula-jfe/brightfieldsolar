import { formatCurrency } from "@/lib/format";

/**
 * Figma "Savings Bar": the monthly bill split into what you would still pay
 * with solar (muted) and what solar saves (yellow). Widths are percentages
 * of the bill, so they always sum to 100% — monthlySavings is already capped
 * at the bill (see calculator.ts), so the remainder is never negative. When
 * savings are capped the whole bar turns yellow and "with solar" reads $0.
 */
export function SavingsBar({ bill, monthlySavings }: { bill: number; monthlySavings: number }) {
  const withSolar = Math.max(bill - monthlySavings, 0);
  const savingsPercent = bill > 0 ? Math.min((monthlySavings / bill) * 100, 100) : 0;

  return (
    <div className="w-full">
      <p className="text-right text-xs leading-5 text-text-on-dark-muted md:text-sm">{formatCurrency(bill)}/mo bill</p>
      <div
        className="mt-2 flex h-4 w-full overflow-hidden rounded-full bg-border-dark"
        role="img"
        aria-label={`${formatCurrency(monthlySavings)} of your ${formatCurrency(bill)} bill covered by solar`}
      >
        <div
          style={{ width: `${100 - savingsPercent}%` }}
          className="h-full bg-text-on-dark-muted transition-[width] duration-300 ease-out"
        />
        <div
          style={{ width: `${savingsPercent}%` }}
          className="h-full bg-accent-sun transition-[width] duration-300 ease-out"
        />
      </div>
      <div className="mt-2 flex justify-between gap-3 text-xs font-bold leading-5 md:text-sm">
        <span className="text-text-on-dark-muted">{formatCurrency(withSolar)}/mo with solar</span>
        <span className="text-text-accent-on-dark">{formatCurrency(monthlySavings)}/mo savings</span>
      </div>
    </div>
  );
}
