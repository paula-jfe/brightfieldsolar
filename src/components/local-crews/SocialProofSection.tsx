import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LocalCrews } from "./LocalCrews";
import { Testimonials } from "@/components/testimonials/Testimonials";

/**
 * In the Figma file, "Local crews" and "Customer testimonials" are one
 * section (one dark background, one set of top/bottom padding) — not two
 * stacked sections. LocalCrews and Testimonials stay separate components
 * (each is independently testable/reusable) but share this one wrapper so
 * the rendered markup matches that single-section structure.
 */
export function SocialProofSection({ city }: { city: CityData }) {
  return (
    <section id="local-crews" className="bg-bg-dark py-16 text-text-on-dark md:py-24">
      <Container>
        <LocalCrews city={city} />
        <Testimonials city={city} />
      </Container>
    </section>
  );
}
