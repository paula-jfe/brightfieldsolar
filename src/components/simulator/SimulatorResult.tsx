// Result card with the estimate and the minimum-panels and capped-savings notes.
import type { SimulatorResult as SimulatorResultData } from "@/lib/calculator";
import { formatCurrency, formatCurrencyPrecise, formatPanelCount, formatYears } from "@/lib/format";
import { SavingsBar } from "./SavingsBar";

function articleFor(n: number) {
  return /^(8|11|18)/.test(String(n)) ? "an" : "a";
}

export function SimulatorResult({
  result,
  monthlyBill,
  minPanels,
}: {
  result: SimulatorResultData;
  monthlyBill: number;
  minPanels: number;
}) {
  const stats = [
    { value: formatPanelCount(result.panelCount), label: "Your system" },
    { value: formatCurrency(result.investmentAfterFederal), label: "Cost after federal credit" },
    { value: formatYears(result.paybackYears), label: "Payback period" },
  ];

  return (
    <div className="flex flex-col gap-5 bg-bg-dark px-6 py-7 text-text-on-dark md:gap-6 md:px-10 md:py-8 lg:rounded-[var(--radius-card)] lg:p-10">
      <h3 className="font-display text-lg font-bold text-text-on-dark-muted md:text-xl">Your solar estimate</h3>

      <SavingsBar bill={monthlyBill} monthlySavings={result.monthlySavings} />

      <p aria-live="polite" className="flex items-center gap-5">
        <span className="font-display text-[40px] font-extrabold leading-none text-text-accent-on-dark md:text-5xl lg:text-[56px]">
          {formatCurrency(result.monthlySavings)}
        </span>
        <span className="text-sm leading-5 text-text-on-dark-muted md:text-lg md:leading-7">
          Estimated monthly savings
        </span>
      </p>

      <ul className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 md:gap-x-8">
        {stats.map((stat) => (
          <li key={stat.label} className="contents">
            <span className="text-lg font-semibold md:text-xl lg:text-2xl">{stat.value}</span>
            <span className="text-sm leading-[1.4] text-text-on-dark-muted md:text-base">{stat.label}</span>
          </li>
        ))}
      </ul>

      {(result.isMinPanelsApplied || result.isSavingsCapped) && (
        <div className="space-y-4 border-t border-border-dark pt-5 text-base leading-[1.5] text-text-on-dark-muted md:text-[17px]">
          {result.isMinPanelsApplied && (
            <p>
              Every installation has {articleFor(minPanels)} {minPanels}-panel minimum, so your system stays at{" "}
              {result.panelCount} panels even if you lower your coverage. Your usage alone would call for fewer.
            </p>
          )}
          {result.isSavingsCapped && (
            <p>
              This system generates more than your bill covers. Savings are capped at your monthly bill. The extra{" "}
              {formatCurrencyPrecise(result.excessCreditValue)}/month becomes a utility credit, not cash back.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
