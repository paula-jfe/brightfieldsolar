import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-bg-dark py-8">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo tone="on-dark" />
        <p className="text-sm text-text-on-dark-muted">
          Brightfield Solar is a fictional company created for a design challenge.
        </p>
      </Container>
    </footer>
  );
}
