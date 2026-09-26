import type { CityData } from "@/data/types";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";

export function Footer({ city }: { city: CityData }) {
  return (
    <footer className="border-t border-white/10 bg-bg-dark py-10 text-text-on-dark-muted">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p className="font-semibold text-text-on-dark">Brightfield Solar</p>
        <p>
          Brightfield Solar is a fictional company created for a hiring exercise. Nothing on this page is a real
          offer.
        </p>
        <p>
          {city.city}, {city.state} · {city.phone}
        </p>
      </Container>
    </footer>
  );
}
