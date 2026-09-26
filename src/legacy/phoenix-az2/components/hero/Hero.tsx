import type { CityData } from "@/data/types";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";
import { LinkButton } from "@/legacy/phoenix-az2/components/ui/Button";

export function Hero({ city }: { city: CityData }) {
  return (
    <section className="bg-bg-dark text-text-on-dark">
      <Container className="grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Make the most of <span className="text-text-accent-on-dark">{city.city}</span> sunshine.
          </h1>
          <p className="mt-4 max-w-md text-lg text-text-on-dark-muted">
            See how much you could save on your {city.utilityName} bill with solar — get a real estimate in under a
            minute, no visit required.
          </p>
          <LinkButton href="#estimate" variant="primary" className="mt-8">
            Get my estimate
          </LinkButton>
          <dl className="mt-10 grid grid-cols-3 gap-6 text-sm">
            <div>
              <dt className="text-text-on-dark-muted">Installs completed</dt>
              <dd className="mt-1 text-xl font-bold">{city.installsCompleted.toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt className="text-text-on-dark-muted">Average rating</dt>
              <dd className="mt-1 text-xl font-bold">{city.avgRating.toFixed(1)} / 5</dd>
            </div>
            <div>
              <dt className="text-text-on-dark-muted">Crews available</dt>
              <dd className="mt-1 text-xl font-bold">{city.crewsAvailable}</dd>
            </div>
          </dl>
        </div>

        <div
          aria-hidden="true"
          className="relative h-64 overflow-hidden rounded-3xl bg-gradient-to-br from-bg-dark-raised to-mirage-800 sm:h-80 md:h-full md:min-h-[22rem]"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-sun/70 blur-3xl" />
          <div className="absolute inset-x-8 bottom-8 h-24 rounded-2xl bg-bg-dark/60" />
        </div>
      </Container>
    </section>
  );
}
