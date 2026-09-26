import type { CityData } from "@/data/types";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function Testimonials({ city }: { city: CityData }) {
  return (
    <section className="bg-bg-dark pb-16 text-text-on-dark md:pb-24">
      <Container>
        <h2 className="text-3xl font-extrabold tracking-tight">Customer testimonials</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {city.testimonials.map((testimonial) => (
            <li key={testimonial.author} className="flex flex-col rounded-2xl bg-bg-dark-raised p-6">
              <p aria-hidden="true" className="text-text-accent-on-dark">
                ★★★★★
              </p>
              <p className="mt-3 flex-1 text-sm text-text-on-dark-muted">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold">{testimonial.author}</p>
              <p className="text-xs text-text-on-dark-muted">
                {testimonial.neighborhood} · {formatDate(testimonial.date)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
