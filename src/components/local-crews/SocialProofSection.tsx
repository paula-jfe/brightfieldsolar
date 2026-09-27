import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LocalCrews } from "./LocalCrews";
import { Testimonials } from "@/components/testimonials/Testimonials";

/**
 * Local Crews and Testimonials share one dark section in the Figma file
 * ("Section 04 - Local Crews and testimonials") rather than being two
 * separate page sections — this wrapper matches that.
 */
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
