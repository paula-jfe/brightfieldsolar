// Phone link that also records the click-to-call in analytics.
"use client";

import { track } from "@/lib/analytics";

export function PhoneLink({ phone, city }: { phone: string; city: string }) {
  const tel = phone.replace(/[^\d+]/g, "");
  return (
    <a
      href={`tel:${tel}`}
      onClick={() => track("phone_clicked", { city })}
      className="text-lg font-semibold text-text-on-light underline-offset-4 hover:underline"
    >
      {phone}
    </a>
  );
}
