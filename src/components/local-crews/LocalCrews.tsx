import type { CityData } from "@/data/types";
import { CarouselArrow } from "./CarouselArrow";

/**
 * Mobile-first: below md this is a native horizontal-scroll row
 * (snap-x, each card a fixed 320px, matching the Figma mobile frame's own
 * "overflow-x-auto" carousel with no arrow controls — a swipe gesture,
 * not JS). At md it becomes a static 3-column grid with decorative
 * prev/next arrows either side, matching the Figma desktop frame.
 */
export function LocalCrews({ city }: { city: CityData }) {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Local Crews</h2>
        <p className="mt-3 text-lg text-text-on-dark-muted">
          Showing {city.crews.length} of our {city.crewsAvailable} {city.city} crews.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4 md:mt-10">
        <CarouselArrow direction="prev" />
        <ul className="flex flex-1 snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {city.crews.map((crew) => (
            <li
              key={crew.name}
              className="w-[320px] shrink-0 snap-start overflow-hidden rounded-3xl bg-bg-card ring-1 ring-border-light md:w-auto"
            >
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
