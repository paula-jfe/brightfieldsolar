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
import { Container } from "@/components/ui/Container";
import { ProfileSelector } from "./ProfileSelector";
import { RangeSlider } from "./RangeSlider";
import { SimulatorResult } from "./SimulatorResult";

const INITIAL_BILL = 220;

/**
 * The only Client Component in the page. Everything here is interactive
 * state (bill, coverage, which profile is highlighted) that has to live in
 * the browser and recompute on every change — there's no way to do that as
 * a Server Component. City data comes in as a prop from the server-rendered
 * parent, so the client bundle doesn't need its own data-fetching logic.
 */
export function Simulator({ city }: { city: CityData }) {
  const initialProfileIndex = useMemo(
    () => city.householdProfiles.findIndex((profile) => profile.typicalBill === INITIAL_BILL),
    [city]
  );

  const [monthlyBill, setMonthlyBill] = useState(INITIAL_BILL);
  const [coverage, setCoverage] = useState(DEFAULT_COVERAGE);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(
    initialProfileIndex >= 0 ? initialProfileIndex : null
  );

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
    <section id="estimate" className="bg-bg-light-muted py-16 md:py-24">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
          <div className="flex flex-col gap-7 rounded-[2rem] bg-bg-card p-8 ring-1 ring-border-light md:p-10">
            <h2 className="text-2xl font-extrabold">Which home is closest to yours?</h2>
            <ProfileSelector
              profiles={city.householdProfiles}
              selectedIndex={selectedProfileIndex}
              onSelect={handleSelectProfile}
            />
            <RangeSlider
              label="Monthly electric bill"
              valueLabel={`${formatCurrency(monthlyBill)}/mo`}
              minLabel={`${formatCurrency(BILL_MIN)}/mo`}
              maxLabel={`${formatCurrency(BILL_MAX)}/mo`}
              min={BILL_MIN}
              max={BILL_MAX}
              step={BILL_STEP}
              value={monthlyBill}
              onChange={handleBillChange}
            />
            <RangeSlider
              label="How much do you want to cover?"
              valueLabel={formatPercent(coverage)}
              minLabel={formatPercent(COVERAGE_MIN)}
              maxLabel={formatPercent(COVERAGE_MAX)}
              min={COVERAGE_MIN}
              max={COVERAGE_MAX}
              step={COVERAGE_STEP}
              value={coverage}
              onChange={handleCoverageChange}
            />
          </div>

          <SimulatorResult
            result={result}
            monthlyBill={monthlyBill}
            minPanels={city.minPanels}
            stateIncentiveNote={city.stateIncentiveNote}
          />
        </div>
      </Container>
    </section>
  );
}
