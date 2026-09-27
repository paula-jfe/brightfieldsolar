/**
 * Brightfield logo: the sun-over-panels symbol vectorized in the Figma
 * file ("Brightfield Symbol (vector)", Brand DNA page) plus the wordmark.
 */
export function LogoMark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="47 37 506 478" className={className} fill="none" aria-hidden="true">
      <g stroke={color} strokeWidth="30" strokeLinecap="round">
        <path d="M300 52V160" />
        <path d="M140 128L205 190" />
        <path d="M460 128L395 190" />
        <path d="M62 292H150" />
        <path d="M450 292H538" />
      </g>
      <path d="M196 300C196 242.56 242.56 196 300 196C357.44 196 404 242.56 404 300" stroke={color} strokeWidth="30" />
      <g fill={color}>
        <path d="M177 355.639C178.9 353.335 181.73 352 184.716 352H226.09C232.305 352 237.015 357.609 235.939 363.73L213.453 491.73C212.613 496.512 208.459 500 203.604 500H79.2028C70.7494 500 66.1096 490.162 71.4865 483.639L177 355.639Z" />
        <path d="M266.46 360.141C267.353 355.419 271.479 352 276.285 352H323.715C328.521 352 332.647 355.419 333.54 360.141L357.756 488.141C358.922 494.3 354.199 500 347.931 500H252.069C245.801 500 241.078 494.3 242.244 488.141L266.46 360.141Z" />
        <path d="M364.061 363.73C362.985 357.609 367.695 352 373.91 352H415.284C418.27 352 421.1 353.335 423 355.639L528.513 483.639C533.89 490.162 529.251 500 520.797 500H396.396C391.541 500 387.387 496.512 386.547 491.73L364.061 363.73Z" />
      </g>
    </svg>
  );
}

/**
 * Figma "Logo" component: yellow symbol + "Brightfield Solar" wordmark
 * (Hanken Grotesk ExtraBold 24/30, 10px gap). `tone` only changes the
 * wordmark colour; the symbol is always the brand yellow.
 * - size "md" (header): base size on mobile and tablet, 1.2× from lg up, as the
 *   desktop header instance in Figma is scaled to 120%.
 * - size "sm" (footer): base size everywhere.
 */
export function Logo({ tone = "on-dark", size = "md" }: { tone?: "on-dark" | "on-light"; size?: "sm" | "md" }) {
  const textColor = tone === "on-dark" ? "text-text-on-dark" : "text-text-on-light";
  const large = size === "md";
  return (
    <span className={`inline-flex items-center gap-2.5 ${large ? "lg:gap-3" : ""}`}>
      <LogoMark
        className={`h-11 w-[47px] shrink-0 ${large ? "lg:h-[52px] lg:w-14" : ""}`}
        color="var(--color-accent-sun)"
      />
      <span
        className={`font-display whitespace-nowrap text-2xl font-extrabold leading-[30px] ${
          large ? "lg:text-[28.8px] lg:leading-9" : ""
        } ${textColor}`}
      >
        Brightfield Solar
      </span>
    </span>
  );
}
