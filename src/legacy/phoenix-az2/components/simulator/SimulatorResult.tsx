import type { SimulatorResult as SimulatorResultData } from "@/lib/calculator";
import { formatCurrency, formatCurrencyPrecise, formatPanelCount, formatYears } from "@/lib/format";

export function SimulatorResult({
  result,
  minPanels,
}: {
  result: SimulatorResultData;
  minPanels: number;
}) {
  return (
    <div className="rounded-2xl bg-bg-dark p-6 text-text-on-dark">
      <p className="text-sm font-semibold text-text-on-dark-muted">Your solar estimate</p>

      <p className="mt-3 text-3xl font-extrabold text-text-accent-on-dark">
        {formatCurrencyPrecise(result.monthlySavings)}
        <span className="ml-1 text-base font-medium text-text-on-dark-muted">estimated monthly savings</span>
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-text-on-dark-muted">Your system</dt>
          <dd className="mt-1 text-lg font-bold">{formatPanelCount(result.panelCount)}</dd>
        </div>
        <div>
          <dt className="text-text-on-dark-muted">Investment after federal credit</dt>
          <dd className="mt-1 text-lg font-bold">{formatCurrency(result.investmentAfterFederal)}</dd>
        </div>
        <div>
          <dt className="text-text-on-dark-muted">Payback period</dt>
          <dd className="mt-1 text-lg font-bold">{formatYears(result.paybackYears)}</dd>
        </div>
      </dl>

      {(result.isMinPanelsApplied || result.isSavingsCapped) && (
        <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-xs text-text-on-dark-muted">
          {result.isMinPanelsApplied && (
            <p>
              Every installation has a {minPanels}-panel minimum, so your system is sized at {result.panelCount}{" "}
              panels even though your usage alone would call for fewer.
            </p>
          )}
          {result.isSavingsCapped && (
            <p>
              This system generates more than your bill covers. Savings are capped at your monthly bill — the extra{" "}
              {formatCurrencyPrecise(result.excessCreditValue)}/mo becomes a utility credit, not cash back.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
