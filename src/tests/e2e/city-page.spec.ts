// End-to-end checks of the Phoenix page in a real browser, including an axe accessibility scan.
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("/ redirects to the Phoenix page, with its title and all sections in order", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/phoenix-az$/);
  await expect(page).toHaveTitle("Solar Panels in Phoenix, AZ | Brightfield Solar");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const order = await page.locator("main section[id]").evaluateAll((sections) => sections.map((s) => s.id));
  expect(order).toEqual(["estimate", "how-it-works", "local-crews", "faq", "contact"]);
});

test("an unknown city returns 404", async ({ page }) => {
  const response = await page.goto("/nowhere-zz");
  expect(response?.status()).toBe(404);
});

test("a visitor estimates their savings and asks to be contacted", async ({ page }) => {
  await page.goto("/phoenix-az");
  const estimate = page.locator("#estimate");

  await estimate.getByRole("button", { name: /typical \$90\/mo/i }).click();
  await expect(estimate.getByRole("slider", { name: "Monthly bill" })).toHaveValue("90");
  await expect(estimate.getByText("8 panels", { exact: true })).toBeVisible();
  await expect(estimate.getByText(/8-panel minimum/)).toBeVisible();

  await estimate.getByRole("link", { name: "Talk to a solar expert" }).click();
  await expect(page).toHaveURL(/#contact$/);

  const form = page.getByRole("form", { name: "Talk to a solar expert" });
  await form.getByRole("textbox", { name: /^name/i }).fill("Jane Smith");
  await form.getByRole("textbox", { name: /^email/i }).fill("jane@example.com");
  await form.getByRole("textbox", { name: /^phone/i }).pressSequentially("6025550100");
  await expect(form.getByRole("textbox", { name: /^phone/i })).toHaveValue("(602) 555-0100");
  await form.getByRole("checkbox", { name: /agree to be contacted/i }).check();
  await form.getByRole("button", { name: "Talk to a solar expert" }).click();

  await expect(page.getByRole("heading", { name: "Thank you. We have received your request." })).toBeFocused();
});

test("the confirmation replaces the form, then gives the form back", async ({ page }) => {
  await page.clock.install();
  await page.goto("/phoenix-az");

  const form = page.getByRole("form", { name: "Talk to a solar expert" });
  await form.getByRole("textbox", { name: /^name/i }).fill("Jane Smith");
  await form.getByRole("textbox", { name: /^email/i }).fill("jane@example.com");
  await form.getByRole("textbox", { name: /^phone/i }).fill("6025550100");
  await form.getByRole("checkbox", { name: /agree to be contacted/i }).check();
  await form.getByRole("button", { name: "Talk to a solar expert" }).click();
  await expect(form.getByRole("button", { name: "Sending…" })).toBeDisabled();

  await page.clock.runFor(1200);
  const heading = page.getByRole("heading", { name: "Thank you. We have received your request." });
  await expect(heading).toBeFocused();
  await expect(form).toBeHidden();

  await expect(page.getByText(/a brightfield solar specialist in phoenix will contact you/i)).toBeVisible();

  await page.clock.runFor(7000);
  await expect(heading).toBeHidden();
  await expect(form).toBeVisible();
  await expect(form.getByRole("textbox", { name: /^name/i })).toHaveValue("");
  await expect(form.getByRole("textbox", { name: /^name/i })).toBeFocused();
});

test("has no automatically detectable WCAG 2.2 AA violations", async ({ page }) => {
  await page.goto("/phoenix-az");
  await page.getByRole("form", { name: "Talk to a solar expert" }).getByRole("button").click();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
});
