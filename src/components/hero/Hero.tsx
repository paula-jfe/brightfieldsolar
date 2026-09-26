import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

// Repeating-gradient stand-in for the Figma file's 48px grid-line pattern
// (dozens of 1px line layers) — same visual result, one CSS rule instead
// of ~60 DOM nodes. Desktop only — the Figma mobile frame doesn't show it.
const gridPatternStyle = {
  backgroundImage:
    "repeating-linear-gradient(to right, var(--color-border-dark) 0 1px, transparent 1px 48px), repeating-linear-gradient(to bottom, var(--color-border-dark) 0 1px, transparent 1px 48px)",
  opacity: 0.18,
} as const;

/**
 * Mobile-first. Below md: single column, stacked in the Figma mobile
 * frame's own order (headline → image → body copy → button), 40px
 * headline, full-width button. At md: two-column grid, 60px headline,
 * inline-width button — matching the Figma desktop frame.
 */
export function Hero({ city }: { city: CityData }) {
  return (
    <section className="relative overflow-hidden bg-bg-dark pt-16 pb-14 text-text-on-dark md:pt-24 md:pb-16">
      <div aria-hidden="true" className="absolute inset-0 hidden md:block" style={gridPatternStyle} />

      <Container className="relative flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-10">
        <h1 className="order-1 text-4xl font-extrabold leading-tight tracking-tight md:order-none md:text-5xl">
          Make the most of <span className="text-text-accent-on-dark">{city.city}</span> sunshine.
        </h1>

        <div className="relative order-2 flex h-60 items-center justify-center overflow-visible rounded-3xl border border-accent-sky bg-bg-dark-raised md:order-none md:row-span-2 md:h-[28rem]">
          <p aria-hidden="true" className="px-8 text-center text-sm text-text-on-dark-muted">
            Photo: {city.city} home with a fresh solar install
          </p>

          {/* Sun graphic, positioned to bleed past the image card's edge —
              bottom-left on mobile, bottom-right on desktop, roughly
              matching each Figma frame's placement. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full md:-bottom-10 md:-left-auto md:-right-10 md:h-40 md:w-40"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent-sun) 0%, var(--color-accent-sun) 40%, transparent 72%)",
            }}
          />
        </div>

        <div className="order-3 flex flex-col gap-6 md:order-none">
          <p className="max-w-md text-lg text-text-on-dark-muted">See how much you could save with solar.</p>
          <LinkButton href="#estimate" variant="primary" className="w-full md:w-fit">
            Get my estimate
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
