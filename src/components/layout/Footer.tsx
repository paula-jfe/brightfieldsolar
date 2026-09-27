// Footer with logo, disclaimer and city contact.
import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer({ city }: { city: CityData }) {
  return (
    <footer className="surface-dark bg-bg-dark py-8">
      <Container className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <Logo tone="on-dark" size="sm" />
        <p className="text-sm leading-5 text-text-on-dark-muted">
          Brightfield Solar is a fictional company created for a hiring exercise. Nothing on this page is a real
          offer. <span className="block md:inline">
            <span className="hidden md:inline"> · </span>
            {city.city}, {city.state} · {city.phone}
          </span>
        </p>
      </Container>
    </footer>
  );
}
