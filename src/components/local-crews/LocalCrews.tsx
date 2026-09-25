import type { CityData } from "@/data/types";
import { CarouselArrow } from "./CarouselArrow";

export function LocalCrews({ city }: { city: CityData }) {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-5xl font-extrabold tracking-tight">Local Crews</h2>
        <p className="mt-3 text-lg text-text-on-dark-muted">
          Showing {city.crews.length} of our {city.crewsAvailable} {city.city} crews.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <CarouselArrow direction="prev" />
        <ul className="grid flex-1 gap-6 md:grid-cols-3">
          {city.crews.map((crew) => (
            <li key={crew.name} className="overflow-hidden rounded-3xl bg-bg-card ring-1 ring-border-light">
              <div aria-hidden="true" className="h-[200px] bg-bg-light-muted" />
              <div className="space-y-2 px-6 py-5">
                <h3 className="text-2xl font-extrabold text-text-on-light">{crew.name}</h3>
                <p className="text-sm font-bold text-text-accent-on-light">
                  {crew.installs} installs · ★ {crew.rating.toFixed(1)} · since {crew.since}
                </p>
                <p className="text-text-on-light-muted">{crew.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
        <CarouselArrow direction="next" />
      </div>
    </div>
  );
}
