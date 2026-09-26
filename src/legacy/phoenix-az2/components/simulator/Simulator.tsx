"use client";

import { useMemo, useState } from "react";
import type { CityData } from "@/data/types";
import {
  BILL_MAX,
  BILL_MIN,
  BILL_STEP,
  COVERAGE_MAX,
  COVERAGE_MIN,
  COVERAGE_STEP,
  DEFAULT_COVERAGE,
  calculateSolarEstimate,
} from "@/lib/calculator";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";
import { ProfileSelector } from "./ProfileSelector";
import { RangeSlider } from "./RangeSlider";
import { SimulatorResult } from "./SimulatorResult";

/**
 * The only Client Component in the page. Everything here is interactive
 * state (bill, coverage, which profile is highlighted) that has to live in
 * the browser and recompute on every change — there's no way to do that as
 * a Server Component. City data comes in as a prop from the server-rendered
 * parent, so the client bundle doesn't need its own data-fetching logic.
 */
export function Simulator({ city }: { city: CityData }) {
  const [monthlyBill, setMonthlyBill] = useState(220);
  const [coverage, setCoverage] = useState(DEFAULT_COVERAGE);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(null);

  const result = useMemo(
    () => calculateSolarEstimate(city, { monthlyBill, coverage }),
    [city, monthlyBill, coverage]
  );

  function handleSelectProfile(index: number) {
    const profile = city.householdProfiles[index];
    setMonthlyBill(profile.typicalBill);
    setCoverage(DEFAULT_COVERAGE);
    setSelectedProfileIndex(index);
  }

  function handleBillChange(value: number) {
    setMonthlyBill(value);
    setSelectedProfileIndex(null);
  }

  function handleCoverageChange(value: number) {
    setCoverage(value);
    setSelectedProfileIndex(null);
  }

  return (
    <section id="estimate" className="bg-bg-light py-16 md:py-24">
      <Container>
        <h2 className="text-3xl font-extrabold tracking-tight">Your solar estimate</h2>
        <p className="mt-2 max-w-2xl text-text-on-light-muted">
          Move the sliders or pick the home closest to yours — the estimate updates instantly, using {city.city}
          &apos;s own utility rates and sun hours.
        </p>

        <div className="mt-10 grid gap-6 rounded-2xl bg-bg-card p-6 shadow-sm ring-1 ring-border-light md:grid-cols-2 md:p-8">
          <div className="space-y-8">
            <ProfileSelector
              profiles={city.householdProfiles}
              selectedIndex={selectedProfileIndex}
              onSelect={handleSelectProfile}
            />
            <RangeSlider
              label="Monthly bill"
              valueLabel={formatCurrency(monthlyBill)}
              min={BILL_MIN}
              max={BILL_MAX}
              step={BILL_STEP}
              value={monthlyBill}
              onChange={handleBillChange}
            />
            <RangeSlider
              label="How much of your usage do you want to cover?"
              valueLabel={formatPercent(coverage)}
              min={COVERAGE_MIN}
              max={COVERAGE_MAX}
              step={COVERAGE_STEP}
              value={coverage}
              onChange={handleCoverageChange}
            />
          </div>

          <SimulatorResult result={result} minPanels={city.minPanels} />
        </div>

        <p className="mt-4 text-xs text-text-on-light-muted">{city.stateIncentiveNote}</p>
      </Container>
    </section>
  );
}
