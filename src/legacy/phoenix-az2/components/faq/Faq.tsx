import type { CityData } from "@/data/types";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";

/**
 * Server Component — no "use client" needed. The accordion behavior comes
 * from the native <details>/<summary> elements, which handle open/close
 * state (and keyboard/accessibility) in the browser without any React
 * state or shipped JS.
 */
export function Faq({ city }: { city: CityData }) {
  return (
    <section id="faq" className="bg-bg-light py-16 md:py-24">
      <Container className="max-w-3xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Questions? We&apos;ve got answers.</h2>
        <div className="mt-10 divide-y divide-border-light rounded-2xl bg-bg-card ring-1 ring-border-light">
          {city.faq.map((entry) => (
            <details key={entry.q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none">
                {entry.q}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl leading-none text-text-accent-on-light transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-text-on-light-muted">{entry.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
