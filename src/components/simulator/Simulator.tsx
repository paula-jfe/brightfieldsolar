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
import { LinkButton } from "@/components/ui/Button";
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
 *
 * Mobile-first: single card, single column (matching the Figma mobile
 * frame's "Simulator (Live)" instance), kept on tablets with roomier
 * padding. At lg (1024px) it splits into a two-column grid — inputs on the
 * left, live result on the right — matching desktop.
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
    // Coverage isn't part of a profile, so changing it keeps the selection.
    setCoverage(value);
  }

  return (
    <section id="estimate" className="bg-bg-light py-14 md:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-[28px] font-extrabold leading-[1.15] md:text-[34px] lg:text-[40px]">
            Estimate your savings
          </h2>
          <p className="text-lg leading-7 text-text-on-light-muted">
            Move the sliders or pick the home closest to yours. The estimate updates instantly
            <span className="hidden md:inline">, using {city.city}&apos;s own utility rates and sun hours</span>.
          </p>
        </div>

        {/* Mobile: one white card holding inputs + result, with the dark
            estimate running edge to edge (Figma mobile "Simulator card").
            Desktop: two columns — inputs card on the left, result column on
            the right (Figma desktop "Columns"). */}
        <div className="mt-8 flex flex-col gap-6 overflow-hidden rounded-[var(--radius-card)] bg-bg-card py-6 ring-1 ring-border-light md:mt-10 md:gap-8 md:py-8 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,681fr)_minmax(0,599fr)] lg:items-start lg:overflow-visible lg:rounded-none lg:bg-transparent lg:py-0 lg:ring-0">
          <div className="flex flex-col gap-5 px-6 md:gap-6 md:px-10 lg:gap-7 lg:rounded-[var(--radius-card)] lg:bg-bg-card lg:p-10 lg:ring-1 lg:ring-border-light">
            <h3 className="font-display text-lg font-extrabold md:text-xl lg:text-2xl">Which home is closest to yours?</h3>
            <ProfileSelector
              profiles={city.householdProfiles}
              selectedIndex={selectedProfileIndex}
              onSelect={handleSelectProfile}
            />
            <RangeSlider
              label="Monthly bill"
              valueLabel={formatCurrency(monthlyBill)}
              minLabel={`${formatCurrency(BILL_MIN)}/mo`}
              maxLabel={`${formatCurrency(BILL_MAX)}/mo`}
              min={BILL_MIN}
              max={BILL_MAX}
              step={BILL_STEP}
              value={monthlyBill}
              onChange={handleBillChange}
            />
            <RangeSlider
              label="How much of your usage do you want to cover?"
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

          <div className="flex flex-col gap-6 lg:gap-5">
            <SimulatorResult result={result} monthlyBill={monthlyBill} minPanels={city.minPanels} />
            <div className="flex flex-col gap-3 px-6 md:gap-4 md:px-10 lg:gap-5 lg:px-0">
              <p className="text-[15px] leading-[1.5] text-text-on-light-muted">{city.stateIncentiveNote}</p>
              <LinkButton href="#contact" variant="primary" className="w-full">
                Talk to a solar expert
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
