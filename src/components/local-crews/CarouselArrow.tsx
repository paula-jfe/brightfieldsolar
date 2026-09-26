/**
 * Desktop only (see LocalCrews/Testimonials — hidden below md). On mobile,
 * the Figma file shows these lists as a native horizontal swipe/scroll
 * ("overflow-x-auto" on the wrapping frame, no arrow controls at all); at
 * desktop width they become a fixed 3-up grid, so an arrow control appears
 * there instead. It's purely decorative rather than wired to fake
 * pagination: every city in this data set (Phoenix included) lists exactly
 * 3 crews and 3 testimonials, the same count the desktop grid shows at
 * once, so a working carousel would have nothing to page through.
 */
export function CarouselArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <span
      aria-hidden="true"
      className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-light bg-bg-card text-2xl font-extrabold text-text-on-light opacity-35 md:flex"
    >
      {direction === "prev" ? "‹" : "›"}
    </span>
  );
}
