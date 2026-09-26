import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "./LeadForm";

/**
 * Final call to action: copy + phone on the left, the lead form (with its
 * validation, loading and submitted states — see LeadForm) on the right.
 * The brief allows the CTA to go nowhere, so there's no backend. The phone
 * number is a tel: link, because many visitors are on a phone.
 */
export function FinalCta({ city }: { city: CityData }) {
  const tel = city.phone.replace(/[^\d+]/g, "");
  return (
    <section id="contact" className="bg-bg-light py-14 md:py-24">
      <Container className="flex flex-col gap-10 md:grid md:grid-cols-[minmax(0,587fr)_minmax(0,653fr)] md:gap-[72px]">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-[32px] font-extrabold leading-[1.15] tracking-tight md:text-4xl">
            Ready to take the next step?
          </h2>
          <p className="text-lg leading-7 text-text-on-light-muted">
            Talk to a {city.city} solar expert about your estimate, no pressure, no obligation. We&apos;ll follow up
            within a business day.
          </p>
          <p className="flex flex-wrap items-baseline gap-x-1.5 leading-6">
            <span className="text-text-on-light-muted">Prefer to call?</span>
            <a href={`tel:${tel}`} className="text-lg font-semibold text-text-on-light underline-offset-4 hover:underline">
              {city.phone}
            </a>
          </p>
        </div>

        <LeadForm city={city.city} />
      </Container>
    </section>
  );
}
