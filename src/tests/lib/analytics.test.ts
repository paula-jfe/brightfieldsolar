// @vitest-environment node
// Analytics: events go to GA4 only when a measurement ID is configured.
import { afterEach, describe, expect, test, vi } from "vitest";
import { sendGAEvent } from "@next/third-parties/google";
import { track } from "@/lib/analytics";

vi.mock("@next/third-parties/google", () => ({ sendGAEvent: vi.fn() }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.mocked(sendGAEvent).mockClear();
});

describe("track", () => {
  test("sends nothing when no measurement ID is configured (dev, tests, previews)", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    track("lead_submitted", { city: "Phoenix" });
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  test("sends the event with its parameters when a measurement ID is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123");
    track("simulator_started", { city: "Phoenix", monthly_bill: 430, coverage_percent: 80 });
    expect(sendGAEvent).toHaveBeenCalledWith("event", "simulator_started", {
      city: "Phoenix",
      monthly_bill: 430,
      coverage_percent: 80,
    });
  });
});
