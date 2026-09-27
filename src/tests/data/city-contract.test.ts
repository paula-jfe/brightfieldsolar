// @vitest-environment node
// Checks that every city data file is valid, so a new city is just a JSON file.
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { getAllCitySlugs, getCityBySlug } from "@/data/cities";
import { BILL_MAX, BILL_MIN, BILL_STEP } from "@/lib/calculator";
import { PROFILE_ICON_NAMES } from "@/components/simulator/ProfileIcon";

describe.each(getAllCitySlugs())("city data: %s", (slug) => {
  const city = getCityBySlug(slug)!;

  test("slug matches the key it is registered under", () => {
    expect(city.slug).toBe(slug);
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test("calculator inputs are positive and rates are fractions", () => {
    for (const key of [
      "utilityRatePerKwh",
      "peakSunHoursPerDay",
      "panelWatts",
      "costPerWattInstalled",
      "minPanels",
    ] as const) {
      expect(city[key], key).toBeGreaterThan(0);
    }
    for (const key of ["performanceRatio", "federalCreditRate"] as const) {
      expect(city[key], key).toBeGreaterThan(0);
      expect(city[key], key).toBeLessThanOrEqual(1);
    }
    expect(Number.isInteger(city.minPanels)).toBe(true);
  });

  test("household profiles can be selected on the bill slider", () => {
    expect(city.householdProfiles.length).toBeGreaterThan(0);
    for (const profile of city.householdProfiles) {
      expect(profile.label.trim(), "label").not.toBe("");
      expect(profile.typicalBill, profile.label).toBeGreaterThanOrEqual(BILL_MIN);
      expect(profile.typicalBill, profile.label).toBeLessThanOrEqual(BILL_MAX);
      expect((profile.typicalBill - BILL_MIN) % BILL_STEP, `${profile.label} is off the slider step`).toBe(0);
      if (profile.icon !== undefined) {
        expect(PROFILE_ICON_NAMES, `${profile.label} icon`).toContain(profile.icon);
      }
      if (profile.shortLabel !== undefined) {
        expect(profile.shortLabel.trim(), `${profile.label} shortLabel`).not.toBe("");
      }
    }
    const labels = city.householdProfiles.map((profile) => profile.label);
    expect(new Set(labels).size, "profile labels must be unique (used as React keys)").toBe(labels.length);
    const bills = city.householdProfiles.map((profile) => profile.typicalBill);
    expect(new Set(bills).size, "profile bills must be unique (the selected profile is the one matching the bill)").toBe(bills.length);
  });

  test("crews are complete and their photos exist in /public", () => {
    expect(city.crews.length).toBeGreaterThan(0);
    for (const crew of city.crews) {
      expect(crew.name.trim()).not.toBe("");
      expect(crew.rating).toBeGreaterThan(0);
      expect(crew.rating).toBeLessThanOrEqual(5);
      expect(crew.since).toBeLessThanOrEqual(new Date().getFullYear());
      if (crew.photo !== undefined) {
        expect(crew.photo, crew.name).toMatch(/^\//);
        const file = path.join(process.cwd(), "public", crew.photo);
        expect(existsSync(file), `${crew.name}: missing ${crew.photo}`).toBe(true);
      }
    }
    expect(city.crews.length).toBeLessThanOrEqual(city.crewsAvailable);
  });

  test("testimonials have real dates and FAQ has answers", () => {
    expect(city.testimonials.length).toBeGreaterThan(0);
    for (const testimonial of city.testimonials) {
      expect(testimonial.quote.trim()).not.toBe("");
      expect(testimonial.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(testimonial.date)), testimonial.date).toBe(false);
    }
    expect(city.faq.length).toBeGreaterThan(0);
    for (const entry of city.faq) {
      expect(entry.q.trim()).not.toBe("");
      expect(entry.a.trim()).not.toBe("");
    }
  });

  test("trust figures are in range", () => {
    expect(city.avgRating).toBeGreaterThan(0);
    expect(city.avgRating).toBeLessThanOrEqual(5);
    expect(city.installsCompleted).toBeGreaterThan(0);
    expect(city.avgPermitDays).toBeGreaterThan(0);
    expect(city.phone.replace(/\D/g, "").length).toBeGreaterThanOrEqual(10);
  });
});
