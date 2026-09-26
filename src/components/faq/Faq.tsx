import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";

/**
 * Server Component — no "use client" needed. The accordion behavior comes
 * from the native <details>/<summary> elements, which handle open/close
 * state (and keyboard/accessibility) in the browser without any React
 * state or shipped JS.
 *
 * Question/answer text comes from the city data file verbatim (the
 * challenge brief's own JSON), not the Figma mockup's shortened copy —
 * the brief's data is the source of truth for content.
 */
export function Faq({ city }: { city: CityData }) {
  return (
    <section id="faq" className="bg-bg-light py-14 md:py-24">
      <Container className="max-w-3xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">
          Questions? We&apos;ve got answers.
        </h2>
        <div className="mt-8 space-y-3 md:mt-10">
          {city.faq.map((entry) => (
            <details key={entry.q} className="group rounded-3xl bg-bg-card px-6 py-5 ring-1 ring-border-light">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold marker:content-none">
                {entry.q}
                <span aria-hidden="true" className="relative h-5 w-5 shrink-0">
                  <span className="absolute left-0 top-1/2 h-[2.5px] w-5 -translate-y-1/2 rounded-full bg-accent-warm" />
                  <span className="absolute left-1/2 top-0 h-5 w-[2.5px] -translate-x-1/2 rounded-full bg-accent-warm transition-transform group-open:rotate-90" />
                </span>
              </summary>
              <p className="mt-3 text-text-on-light-muted">{entry.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
