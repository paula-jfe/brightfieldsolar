// Analytics events sent to Google Analytics 4 in production. Only these events exist, and none carries personal data.
import { sendGAEvent } from "@next/third-parties/google";

type AnalyticsEvents = {
  simulator_started: {
    city: string;
    monthly_bill: number;
    coverage_percent: number;
    profile?: string;
  };
  lead_submitted: { city: string };
  phone_clicked: { city: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

export function track<Name extends AnalyticsEventName>(
  name: Name,
  params: AnalyticsEvents[Name],
): void {
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  sendGAEvent("event", name, params);
}
