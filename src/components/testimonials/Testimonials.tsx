import type { CityData } from "@/data/types";
import { CarouselArrow } from "@/components/local-crews/CarouselArrow";

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function Testimonials({ city }: { city: CityData }) {
  return (
    <div className="mt-16">
      <h2 className="text-center text-5xl font-extrabold tracking-tight">Customer testimonials</h2>

      <div className="mt-10 flex items-center gap-4">
        <CarouselArrow direction="prev" />
        <ul className="grid flex-1 gap-6 md:grid-cols-3">
          {city.testimonials.map((testimonial) => (
            <li key={testimonial.author} className="rounded-3xl bg-bg-dark-raised p-7 ring-1 ring-border-dark">
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
