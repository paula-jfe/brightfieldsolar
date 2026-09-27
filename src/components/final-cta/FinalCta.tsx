// Final call to action: copy, phone link and the lead form.
import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "./LeadForm";
import { PhoneLink } from "./PhoneLink";

export function FinalCta({ city }: { city: CityData }) {
  return (
    <section id="contact" className="bg-bg-light py-14 md:py-20 lg:py-24">
      <Container className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,587fr)_minmax(0,653fr)] lg:gap-[72px]">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-[32px] font-extrabold leading-[1.15] tracking-tight md:text-4xl">
            Ready to take the next step?
          </h2>
          <p className="max-w-2xl text-lg leading-7 text-text-on-light-muted">
            Talk to a {city.city} solar expert about your estimate, no pressure, no obligation. We&apos;ll follow up
            within a business day.
          </p>
          <p className="flex flex-wrap items-baseline gap-x-1.5 leading-6">
            <span className="text-text-on-light-muted">Prefer to call?</span>
            <PhoneLink phone={city.phone} city={city.city} />
          </p>
        </div>

        <LeadForm city={city.city} />
      </Container>
    </section>
  );
}
