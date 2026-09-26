import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * One end-to-end flow against the production build. It covers what unit and
 * component tests can't: the async Server Component page, static params,
 * the redirect from "/", images and the real CSS at two viewport sizes.
 * First run on a new machine: `npx playwright install chromium`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    // Optional override for environments with a preinstalled Chromium.
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/phoenix-az`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
