import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * The brief says the CTA can point at an empty address — no backend, no
 * scheduling, no auth. This form has no `action`/`onSubmit`; it's a static
 * mockup of the lead-capture step, matching the design without pretending
 * to have a server behind it.
 *
 * Mobile-first: the Figma mobile frame stacks everything in one column
 * (copy + photo, then the form below). At md it becomes two columns
 * side by side with a vertical divider, matching the Figma desktop frame.
 */
export function FinalCta({ city }: { city: CityData }) {
  return (
    <section id="contact" className="bg-bg-light-muted py-14 md:py-24">
      <Container>
        <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">
          Ready to take the next step?
        </h2>

        <div className="mt-10 flex flex-col gap-8 md:mt-12 md:grid md:grid-cols-2 md:gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-lg text-text-on-light-muted">
              Your estimate shows your potential savings, including available federal incentives.
            </p>
            <div
              aria-hidden="true"
              className="flex min-h-[220px] flex-1 items-center justify-center rounded-3xl bg-bg-dark-raised p-6 text-center text-sm text-text-on-dark-muted ring-1 ring-border-dark"
            >
              Photo: homeowner with Brightfield crew
            </div>
          </div>

          <div className="border-t border-border-light pt-8 md:border-t-0 md:border-l md:pl-10 md:pt-0">
            <h3 className="text-2xl font-extrabold">Talk to a solar expert</h3>

            <form className="mt-4 grid gap-4">
              <label className="text-sm font-bold">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  className="mt-1.5 w-full rounded-2xl border border-border-light bg-bg-card px-4 py-3.5 text-sm font-normal text-text-on-light-muted"
                />
              </label>
              <label className="text-sm font-bold">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  className="mt-1.5 w-full rounded-2xl border border-border-light bg-bg-card px-4 py-3.5 text-sm font-normal text-text-on-light-muted"
                />
              </label>
              <label className="text-sm font-bold">
                Phone
                <input
                  type="tel"
                  name="phone"
                  placeholder="(555) 555-0100"
                  className="mt-1.5 w-full rounded-2xl border border-border-light bg-bg-card px-4 py-3.5 text-sm font-normal text-text-on-light-muted"
                />
              </label>
              <label className="flex items-start gap-2.5 text-sm text-text-on-light-muted">
                <input type="checkbox" name="consent" className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-border-light" />
                We will use your information to follow up about your estimate.
              </label>
              <Button type="submit" variant="primary" className="w-full">
                Send
              </Button>
              <div className="pt-2 text-center">
                <p className="text-text-on-light-muted">Prefer to call?</p>
                <p className="text-2xl font-extrabold">{city.phone}</p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
