import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

// Repeating-gradient stand-in for the Figma file's 48px grid-line pattern
// (dozens of 1px line layers) — same visual result, one CSS rule instead
// of ~60 DOM nodes. Shown on every breakpoint, a bit fainter on mobile
// (10% vs 18%) so the denser grid doesn't compete with the headline.
const gridPatternStyle = {
  backgroundImage:
    "repeating-linear-gradient(to right, var(--color-border-dark) 0 1px, transparent 1px 48px), repeating-linear-gradient(to bottom, var(--color-border-dark) 0 1px, transparent 1px 48px)",
} as const;

/**
 * The section is pulled up under the sticky header (negative top margin equal
 * to the header height, 96px / 102px) so the translucent header sits on the
 * same dark background instead of on the light page, as in the Figma frame
 * where the hero starts at y=0 behind the header.
 *
 * Mobile: headline → animated visual → body → full-width button, matching
 * the Figma mobile frame's order. Desktop: copy on the left, visual on the
 * right. The primary CTA scrolls to the simulator, because the brief says
 * the savings simulation is what most often leads to a site-visit request.
 */
export function Hero({ city }: { city: CityData }) {
  return (
    <section className="surface-dark relative -mt-24 overflow-hidden bg-bg-dark pb-14 pt-28 text-text-on-dark md:-mt-[102px] md:pb-24 md:pt-[200px]">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.1] md:opacity-[0.18]" style={gridPatternStyle} />

      <Container className="relative flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,715fr)_minmax(0,533fr)] md:items-center md:gap-16">
        <div className="contents md:flex md:flex-col md:gap-6">
          <h1 className="font-display order-1 text-[36px] font-extrabold leading-[1.12] tracking-tight md:text-5xl md:leading-[54px]">
            Make the most of <span className="text-text-accent-on-dark">{city.city}</span> sunshine.
          </h1>
          <p className="order-3 max-w-xl text-lg leading-7 text-text-on-dark-muted">
            See how much you could save on your electric bill with solar. Get a personalized estimate in under a
            minute, no visit required.
          </p>
          <LinkButton href="#estimate" variant="primary" className="order-4 w-full md:w-fit">
            Get my estimate
          </LinkButton>
        </div>

        <div className="order-2">
          <HeroVisual city={city} />
        </div>
      </Container>
    </section>
  );
}
