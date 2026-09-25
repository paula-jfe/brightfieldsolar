/**
 * The Figma file has a real logo mark, but it's a Figma-hosted asset (only
 * reachable at figma.com, which this sandbox's network policy blocks — see
 * the note in app/layout.tsx for the same constraint on fonts). This is an
 * original sun-mark icon in the same brand colors, not a copy of the
 * Figma asset. Swap the <svg> below for an <img> of the real exported
 * logo whenever it's available as a project asset.
 */
export function Logo({ tone = "on-dark" }: { tone?: "on-dark" | "on-light" }) {
  const textColor = tone === "on-dark" ? "text-text-on-dark" : "text-text-on-light";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="32" height="30" viewBox="0 0 32 30" fill="none" aria-hidden="true">
        <circle cx="16" cy="12" r="8" fill="#fcdb04" />
        <path d="M2 29 L16 15 L30 29 Z" fill="#4ebbe2" />
      </svg>
      <span className={`font-extrabold text-2xl leading-none ${textColor}`}>Brightfield</span>
    </span>
  );
}
