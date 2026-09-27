import Image from "next/image";
import type { CityData } from "@/data/types";
// Same art for every city, so it's a static import from src/assets:
// Next hashes, resizes and serves it as WebP/AVIF automatically.
import houseDay from "@/assets/house-day.png";
import houseNight from "@/assets/house-night.png";

const STARS: [number, number, number][] = [
  [8, 8, 3], [25, 16, 2], [37, 5, 3], [48, 23, 2], [60, 13, 3], [79, 6, 2], [89, 20, 3], [13, 31, 2], [71, 35, 2], [42, 37, 3],
];

/**
 * Figma "HeroImg" + "Hero Stats". The scene plays night -> day once (sun
 * rises, moon sets, stars and the night photo fade out) and then stays on
 * day. The three stat cards sit on top as siblings of the scene — not
 * inside it — so their floating loop runs independently of the sky
 * transition (the same fix made in Figma). Pure CSS: no client JS.
 * prefers-reduced-motion jumps straight to the final day state.
 *
 * Sizes: a wide image on phones and tablets (capped at 640px), square from
 * lg. The stat cards are compact wherever the image is narrow (phones, and
 * lg where the square is only ~355px wide) and regular on tablets and xl+,
 * so they never overlap each other.
 */
export function HeroVisual({ city }: { city: CityData }) {
  const stats = [
    { label: "Installations", value: city.installsCompleted.toLocaleString("en-US"), speed: "float-slow", pos: "left-[25%] top-[78%] max-[359px]:left-[8%] lg:left-[4%] lg:top-[40%]" },
    { label: "Average rating", value: `${city.avgRating.toFixed(1)} / 5`, speed: "float-medium", pos: "right-[3%] top-[65%] lg:right-[4%] lg:top-[54%]" },
    { label: "Local crews", value: String(city.crewsAvailable), speed: "float-fast", pos: "left-[4%] top-[36%] lg:left-[22%] lg:top-[73%]" },
  ];

  return (
    <div className="relative aspect-[350/231] w-full md:max-w-[640px] lg:mx-auto lg:aspect-square lg:max-w-[424px]">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[var(--radius-card)]">
        {/* Day sky, revealed as the night layers fade out. */}
        <div className="absolute inset-0 bg-gradient-to-b from-seagull-400 to-seagull-100" />
        <div className="hero-sun absolute left-[10%] top-[6%] aspect-square w-[15%] rounded-full bg-accent-sun shadow-[0_0_48px_12px_rgba(252,219,4,0.55)] lg:left-[44%] lg:w-[16%]" />
        <Image
          src={houseDay}
          alt=""
          loading="eager"
          sizes="(min-width: 1024px) 573px, (min-width: 768px) 640px, 100vw"
          className="absolute inset-x-0 bottom-0 h-auto w-full lg:origin-bottom lg:scale-[1.35]"
        />

        {/* Night layers on top, fading out. */}
        <div className="hero-night absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-mirage-950 to-mirage-700" />
          {STARS.map(([x, y, s]) => (
            <span
              key={`${x}-${y}`}
              className="absolute rounded-full bg-white/85"
              style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }}
            />
          ))}
          <div className="hero-moon absolute left-[13%] top-[7%] aspect-square w-[10%] rounded-full bg-mirage-100 shadow-[0_0_28px_4px_rgba(255,255,255,0.35)] lg:left-[47%]" />
          <Image
            src={houseNight}
            alt=""
            loading="eager"
            sizes="(min-width: 1024px) 573px, (min-width: 768px) 640px, 100vw"
            className="absolute inset-x-0 bottom-0 h-auto w-full lg:origin-bottom lg:scale-[1.35]"
          />
        </div>
      </div>

      <ul className="absolute inset-0">
        {stats.map((stat) => (
          <li key={stat.label} className={`absolute ${stat.pos}`}>
            <div
              className={`${stat.speed} w-[111px] rounded-[var(--radius-inner)] border border-white/12 bg-mirage-950/70 px-3 py-2.5 shadow-[0_8px_20px_rgba(13,18,26,0.28)] backdrop-blur-md md:w-[141px] md:px-5 md:py-4 lg:w-[111px] lg:px-3 lg:py-2.5 xl:w-[141px] xl:px-5 xl:py-4`}
            >
              <p className="text-xs leading-[1.4] text-text-on-dark-muted md:text-sm lg:text-xs xl:text-sm">{stat.label}</p>
              <p className="text-lg font-bold leading-[1.2] text-text-on-dark md:text-[26px] lg:text-lg xl:text-[26px]">{stat.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
