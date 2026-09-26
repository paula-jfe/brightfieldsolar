// @vitest-environment node
import { test } from "vitest";
import assert from "node:assert/strict";
import { getCityBySlug, getAllCitySlugs, DEFAULT_CITY_SLUG } from "@/data/cities";

test("getCityBySlug returns the matching city", () => {
  const city = getCityBySlug("phoenix-az");
  assert.ok(city);
  assert.equal(city?.city, "Phoenix");
  assert.equal(city?.state, "AZ");
});

test("getCityBySlug returns undefined for an unknown slug", () => {
  assert.equal(getCityBySlug("nowhere-zz"), undefined);
});

test("getAllCitySlugs includes phoenix-az", () => {
  assert.ok(getAllCitySlugs().includes("phoenix-az"));
});

test("DEFAULT_CITY_SLUG resolves to a real city", () => {
  assert.ok(getCityBySlug(DEFAULT_CITY_SLUG));
});
