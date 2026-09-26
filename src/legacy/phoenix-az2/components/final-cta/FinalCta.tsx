import type { CityData } from "@/data/types";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";
import { Button } from "@/legacy/phoenix-az2/components/ui/Button";

/**
 * The brief says the CTA can point at an empty address — no backend, no
 * scheduling, no auth. This form has no `action`/`onSubmit`; it's a static
 * mockup of the lead-capture step, matching the design without pretending
 * to have a server behind it.
 */
export function FinalCta({ city }: { city: CityData }) {
  return (
    <section className="bg-bg-light-muted py-16 md:py-24">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to take the next step?</h2>
          <p className="mt-4 text-text-on-light-muted">
            Talk to a {city.city} solar expert about your estimate, no pressure, no obligation. We&apos;ll follow up
            within a business day.
          </p>
          <p className="mt-6 text-sm text-text-on-light-muted">
            Prefer to call? <span className="font-semibold text-text-on-light">{city.phone}</span>
          </p>
        </div>

        <form className="rounded-2xl bg-bg-card p-6 shadow-sm ring-1 ring-border-light">
          <div className="grid gap-4">
            <label className="text-sm font-medium">
              Name
              <input
                type="text"
                name="name"
                placeholder="Jane Smith"
                className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm font-medium">
              Email
              <input
                type="email"
                name="email"
                placeholder="jane@example.com"
                className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm font-medium">
              Phone
              <input
                type="tel"
                name="phone"
                placeholder="(555) 555-0100"
                className="mt-1 w-full rounded-lg border border-border-light px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-start gap-2 text-xs text-text-on-light-muted">
              <input type="checkbox" name="consent" className="mt-0.5 accent-action-primary cursor-pointer" />
              I agree to be contacted by Brightfield Solar about my estimate.
            </label>
            <Button type="submit" variant="primary" className="w-full">
              Talk to a solar expert
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}
