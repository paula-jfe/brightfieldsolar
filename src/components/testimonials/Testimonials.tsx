import type { CityData } from "@/data/types";
import { CarouselArrow } from "@/components/local-crews/CarouselArrow";

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Same mobile-scroll / desktop-grid pattern as LocalCrews — see its comment. */
export function Testimonials({ city }: { city: CityData }) {
  return (
    <div className="mt-14 md:mt-16">
      <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">Customer testimonials</h2>

      <div className="mt-8 flex items-center gap-4 md:mt-10">
        <CarouselArrow direction="prev" />
        <ul className="flex flex-1 snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {city.testimonials.map((testimonial) => (
            <li
              key={testimonial.author}
              className="w-[320px] shrink-0 snap-start rounded-3xl bg-bg-dark-raised p-7 ring-1 ring-border-dark md:w-auto"
            >
              <p aria-hidden="true" className="text-text-accent-on-dark">
                ★★★★★
              </p>
              <p className="mt-5 text-text-on-dark">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className="h-10 w-10 shrink-0 rounded-full bg-bg-accent-soft" />
                <div className="text-sm">
                  <p className="font-bold text-text-on-dark">{testimonial.author}</p>
                  <p className="text-text-on-dark-muted">
                    {testimonial.neighborhood} · {formatShortDate(testimonial.date)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <CarouselArrow direction="next" />
      </div>
    </div>
  );
}
