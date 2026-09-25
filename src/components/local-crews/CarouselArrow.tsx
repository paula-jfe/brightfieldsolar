/**
 * Purely decorative, matching the Figma file's "disabled" arrow state.
 * There's nothing to page through — every city in this data set (Phoenix
 * included) lists exactly 3 crews and 3 testimonials, the same count the
 * carousel shows at once, so a working carousel would have nothing to do.
 * Kept as a visual match rather than wired to fake pagination.
 */
export function CarouselArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-light bg-bg-card text-2xl font-extrabold text-text-on-light opacity-35"
    >
      {direction === "prev" ? "‹" : "›"}
    </span>
  );
}
