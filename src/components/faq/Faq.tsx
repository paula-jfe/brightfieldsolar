import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { FaqList } from "./FaqList";

/**
 * Figma "FAQ Item" list: one bordered card with dividers between items.
 * Questions and answers come from the city data file verbatim.
 */
export function Faq({ city }: { city: CityData }) {
  return (
    <section id="faq" className="bg-bg-light py-14 md:py-24">
      <Container>
        <h2 className="font-display text-left text-[32px] md:text-center font-extrabold leading-[1.15] tracking-tight md:text-4xl">
          Questions? We&apos;ve got answers.
        </h2>
        <FaqList entries={city.faq} />
      </Container>
    </section>
  );
}
