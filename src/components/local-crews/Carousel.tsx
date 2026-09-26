"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Figma "Carousel Header" + "Carousel Dots" + "Mobile Carousel". One real
 * scroll-snap row for both breakpoints:
 * - Mobile: swipe, with dots underneath that track the visible card and
 *   jump to a card when tapped.
 * - Desktop: fixed 400px cards (Figma width) with prev/next arrows next to
 *   the title (dots hidden, matching the Figma "Show dots = false" choice).
 *   Arrows enable themselves whenever the cards don't all fit — on a
 *   narrower window, or for a city with more crews/testimonials — and
 *   disable when there's nothing left to scroll. At 1440px Phoenix's three
 *   cards fit, so both render disabled, exactly as in the design.
 */
export function Carousel({
  title,
  subtitle,
  label,
  children,
}: {
  title: string;
  subtitle?: string;
  label: string;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const items = Children.toArray(children);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
    const cards = Array.from(track.children) as HTMLElement[];
    const start = track.getBoundingClientRect().left;
    let closest = 0;
    let best = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - start);
      if (distance < best) {
        best = distance;
        closest = index;
      }
    });
    setActive(track.scrollLeft >= max - 4 && max > 0 ? cards.length - 1 : closest);
  }, []);

  useEffect(() => {
    update();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.children[0] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: "smooth" });
  }

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full bg-bg-card font-display text-2xl font-extrabold leading-none text-text-on-light ring-1 ring-border-light transition-[opacity,background-color] hover:enabled:bg-mirage-100 disabled:cursor-default disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-sun";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="flex items-end gap-6">
        <div className="flex flex-1 flex-col gap-2">
          <h2 className="font-display text-[32px] font-extrabold leading-[1.15] tracking-tight md:text-4xl">{title}</h2>
          {subtitle && <p className="text-lg leading-7 text-text-on-dark-muted">{subtitle}</p>}
        </div>
        <div className="hidden gap-3 md:flex">
          <button
            type="button"
            className={arrowClass}
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label={`Previous ${label.toLowerCase()}`}
          >
            ‹
          </button>
          <button
            type="button"
            className={arrowClass}
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label={`Next ${label.toLowerCase()}`}
          >
            ›
          </button>
        </div>
      </div>

      {/* Desktop centres the row when the cards fit (Figma); `safe` falls back
          to start-aligned when they overflow, so the first card is never cut
          off and the row still scrolls from its beginning.
          When the cards overflow, the track itself takes keyboard focus so
          arrow keys can scroll it (WCAG 2.1.1); the ring is inset because
          the track runs edge to edge on mobile. */}
      <ul
        ref={trackRef}
        tabIndex={canPrev || canNext ? 0 : undefined}
        aria-label={canPrev || canNext ? `${label}, scroll with arrow keys` : undefined}
        className="focus-visible:outline-offset-[-2px] no-scrollbar md:[justify-content:safe_center] -mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 md:mx-0 md:mt-8 md:scroll-px-0 md:px-0"
      >
        {items.map((child, index) => (
          <li
            key={index}
            className="relative w-[320px] max-w-[85vw] shrink-0 snap-start md:w-[400px] md:max-w-none"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            {child}
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-center md:hidden">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === active}
              // 8px dot inside a 24px-wide, 44px-tall tap target (WCAG 2.5.8),
              // which also sets the 16px visual gap between dots.
              className="flex h-11 items-center justify-center px-2"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  index === active ? "w-6 bg-accent-sun" : "w-2 bg-mirage-300"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
