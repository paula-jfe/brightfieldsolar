// Carousel of the city's local crews.
import Image from "next/image";
import type { CityData } from "@/data/types";
import { publicAssetExists } from "@/lib/public-asset";
import { Carousel } from "./Carousel";

export function LocalCrews({ city }: { city: CityData }) {
  return (
    <Carousel
      title="Local crews"
      subtitle={`Meet ${city.crews.length} of our ${city.crewsAvailable} crews in ${city.city}.`}
      label="Local crews"
    >
      {city.crews.map((crew) => (
        <article
          key={crew.name}
          className="flex h-full flex-col gap-6 rounded-[var(--radius-card)] bg-bg-dark-raised p-6"
        >
          {publicAssetExists(crew.photo) ? (
            <Image
              src={crew.photo}
              alt={`${crew.name} at work on a ${city.city} roof`}
              width={1776}
              height={896}
              sizes="(min-width: 768px) 400px, 320px"
              className="h-[140px] w-full rounded-[var(--radius-inner)] object-cover"
            />
          ) : (
            <div aria-hidden="true" className="h-[140px] w-full rounded-[var(--radius-inner)] bg-mirage-700" />
          )}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold leading-[1.3] text-text-on-dark">{crew.name}</h3>
            <p className="leading-[1.4] text-text-accent-on-dark">
              <span aria-hidden="true">★ </span>
              <span className="sr-only">Rated </span>
              {crew.rating.toFixed(1)} · {crew.installs.toLocaleString("en-US")} installs · since {crew.since}
            </p>
            <p className="leading-[1.5] text-text-on-dark-muted">{crew.blurb}</p>
          </div>
        </article>
      ))}
    </Carousel>
  );
}
