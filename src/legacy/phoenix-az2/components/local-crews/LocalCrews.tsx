import type { CityData } from "@/data/types";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";

export function LocalCrews({ city }: { city: CityData }) {
  return (
    <section id="local-crews" className="bg-bg-dark py-16 text-text-on-dark md:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Local crews</h2>
            <p className="mt-2 text-text-on-dark-muted">
              Showing 3 of {city.crewsAvailable} crews in {city.city}.
            </p>
          </div>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {city.crews.map((crew) => (
            <li key={crew.name} className="rounded-2xl bg-bg-dark-raised p-6">
              <div
                aria-hidden="true"
                className="mb-4 h-32 w-full rounded-xl bg-gradient-to-br from-mirage-700 to-mirage-800"
              />
              <h3 className="text-lg font-bold">{crew.name}</h3>
              <p className="mt-1 text-sm text-text-accent-on-dark">
                ★ {crew.rating.toFixed(1)} · {crew.installs} installs · since {crew.since}
              </p>
              <p className="mt-3 text-sm text-text-on-dark-muted">{crew.blurb}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
