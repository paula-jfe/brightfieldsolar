import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-bg-dark py-8">
      <Container className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Logo tone="on-dark" />
        <p className="text-sm text-text-on-dark-muted">
          Brightfield Solar is a fictional company created for a design challenge.
        </p>
      </Container>
    </footer>
  );
}
