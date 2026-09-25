import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

// Repeating-gradient stand-in for the Figma file's 48px grid-line pattern
// (dozens of 1px line layers) — same visual result, one CSS rule instead
// of ~60 DOM nodes.
const gridPatternStyle = {
  backgroundImage:
    "repeating-linear-gradient(to right, var(--color-border-dark) 0 1px, transparent 1px 48px), repeating-linear-gradient(to bottom, var(--color-border-dark) 0 1px, transparent 1px 48px)",
  opacity: 0.18,
} as const;

export function Hero({ city }: { city: CityData }) {
  return (
    <section className="relative overflow-hidden bg-bg-dark pt-24 pb-16 text-text-on-dark md:pb-24">
      <div aria-hidden="true" className="absolute inset-0" style={gridPatternStyle} />

      <Container className="relative grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
            Make the most of <span className="text-text-accent-on-dark">{city.city}</span> sunshine.
          </h1>
          <p className="mt-6 max-w-md text-lg text-text-on-dark-muted">See how much you could save with solar.</p>
          <LinkButton href="#estimate" variant="primary" className="mt-8">
            Get my estimate
          </LinkButton>
        </div>

        <div className="relative flex h-80 items-center justify-center overflow-visible rounded-[2rem] border border-accent-sky bg-bg-dark-raised md:h-[28rem]">
          <p aria-hidden="true" className="px-8 text-center text-sm text-text-on-dark-muted">
            Photo: {city.city} home with a fresh solar install
          </p>

          {/* Sun graphic, positioned to bleed past the image card's edge,
              roughly matching the Figma file's bottom-right placement. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent-sun) 0%, var(--color-accent-sun) 40%, transparent 72%)",
            }}
          />
        </div>
      </Container>
    </section>
  );
}
