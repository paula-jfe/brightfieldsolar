import type { SimulatorResult as SimulatorResultData } from "@/lib/calculator";
import { formatCurrency, formatPanelCount } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import { SavingsBar } from "./SavingsBar";

export function SimulatorResult({
  result,
  monthlyBill,
  minPanels,
  stateIncentiveNote,
}: {
  result: SimulatorResultData;
  monthlyBill: number;
  minPanels: number;
  stateIncentiveNote: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-[2rem] bg-bg-dark p-8 text-text-on-dark md:p-10">
      <p className="text-2xl font-extrabold">Your solar estimate</p>

      <SavingsBar bill={monthlyBill} monthlySavings={result.monthlySavings} />

      <p className="text-3xl font-extrabold text-text-accent-on-dark">
        {formatCurrency(result.monthlySavings)} estimated monthly savings
      </p>

      <div className="space-y-2 rounded-3xl bg-bg-dark-raised p-6 ring-1 ring-border-dark">
        <p className="text-sm font-bold text-text-on-dark-muted">Your System</p>
        <p className="text-2xl font-extrabold">{formatPanelCount(result.panelCount)}</p>
        <p className="text-lg">{formatCurrency(result.investmentAfterFederal)} after federal incentive</p>
        <p className="text-lg">{result.paybackYears.toFixed(1)} year payback</p>
      </div>

      {(result.isMinPanelsApplied || result.isSavingsCapped) && (
        <div className="space-y-2 text-sm text-text-on-dark-muted">
          {result.isMinPanelsApplied && (
            <p>
              Every installation has a {minPanels}-panel minimum, so your system is sized at {result.panelCount}{" "}
              panels even though your usage alone would call for fewer.
            </p>
          )}
          {result.isSavingsCapped && (
            <p>
              This system generates more than your bill covers. Savings are capped at your monthly bill — the extra{" "}
              {formatCurrency(result.excessCreditValue)}/mo becomes a utility credit, not cash back.
            </p>
          )}
        </div>
      )}

      <p className="text-sm text-text-on-dark-muted">{stateIncentiveNote}</p>

      <LinkButton href="#contact" variant="primary" className="w-full">
        Talk to a solar expert
      </LinkButton>
    </div>
  );
}
