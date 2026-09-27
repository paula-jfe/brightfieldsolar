// FAQ section.
import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { FaqList } from "./FaqList";

export function Faq({ city }: { city: CityData }) {
  return (
    <section id="faq" className="bg-bg-light py-14 md:py-20 lg:py-24">
      <Container>
        <h2 className="font-display text-left text-[32px] font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-center">
          Questions? We&apos;ve got answers.
        </h2>
        <FaqList entries={city.faq} />
      </Container>
    </section>
  );
}
