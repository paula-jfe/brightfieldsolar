// Carousel of customer testimonials.
import type { CityData } from "@/data/types";
import { Carousel } from "@/components/local-crews/Carousel";

function formatShortDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const QUOTE_OPEN =
  "M0 21.7143V16C0 14.2645 0.306878 12.4233 0.920635 10.4762C1.55556 8.50794 2.46561 6.61376 3.65079 4.79365C4.85714 2.95238 6.30688 1.3545 8 0L11.1111 2.69842C9.50264 4.56085 8.14815 6.63492 7.04762 8.92064C5.96825 11.1852 5.42857 13.5132 5.42857 15.9048V21.7143H0ZM14.8889 21.7143V16C14.8889 14.2645 15.1958 12.4233 15.8095 10.4762C16.4444 8.50794 17.3545 6.61376 18.5397 4.79365C19.746 2.95238 21.1958 1.3545 22.8889 0L26 2.69842C24.3915 4.56085 23.037 6.63492 21.9365 8.92064C20.8571 11.1852 20.3175 13.5132 20.3175 15.9048V21.7143H14.8889Z";

export function Testimonials({ city }: { city: CityData }) {
  return (
    <div className="mt-14 md:mt-16">
      <Carousel title="Customer testimonials" label="Customer testimonials">
        {city.testimonials.map((testimonial) => (
          <figure
            key={testimonial.author}
            className="relative flex h-full flex-col gap-5 rounded-[var(--radius-inner)] bg-bg-dark-raised px-7 pb-7 pt-16"
          >
            <svg aria-hidden="true" viewBox="0 0 26 22" className="absolute left-7 top-[26px] h-[22px] w-[26px] opacity-90">
              <path d={QUOTE_OPEN} fill="var(--color-accent-sun)" />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 26 22"
              className="absolute bottom-6 right-7 h-[22px] w-[26px] rotate-180 opacity-90"
            >
              <path d={QUOTE_OPEN} fill="var(--color-accent-sun)" />
            </svg>
            <blockquote className="flex-1 leading-6 text-text-on-dark">{testimonial.quote}</blockquote>
            <figcaption className="text-sm leading-5">
              <p className="font-semibold text-text-on-dark">{testimonial.author}</p>
              <p className="text-text-on-dark-muted">
                {testimonial.neighborhood} · <time dateTime={testimonial.date}>{formatShortDate(testimonial.date)}</time>
              </p>
            </figcaption>
          </figure>
        ))}
      </Carousel>
    </div>
  );
}
