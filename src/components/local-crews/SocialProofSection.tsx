// Social proof section: local crews and testimonials.
import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LocalCrews } from "./LocalCrews";
import { Testimonials } from "@/components/testimonials/Testimonials";

export function SocialProofSection({ city }: { city: CityData }) {
  return (
    <section id="local-crews" className="surface-dark bg-bg-dark py-14 text-text-on-dark md:py-20 lg:py-24">
      <Container>
        <LocalCrews city={city} />
        <Testimonials city={city} />
      </Container>
    </section>
  );
}
