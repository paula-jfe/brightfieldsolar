/**
 * Brand loading indicator (Figma "Loader"), built from the Brand DNA "Sun":
 * the 8 rays light up in sequence, clockwise, around a static circle. Each
 * ray runs the same `sun-ray` keyframes with a 0.1s stagger (see
 * globals.css), so one full turn takes 0.8s. `tone` switches between the
 * brand yellow (on dark) and the dark navy (inside the yellow button).
 */
const RAYS: [number, number, number, number][] = [
  [296, 52, 296, 160],
  [457, 130, 392, 192],
  [446, 295, 534, 295],
  [457, 468, 392, 406],
  [296, 546, 296, 438],
  [135, 468, 200, 406],
  [58, 295, 146, 295],
  [135, 130, 200, 192],
];

export function Loader({
  size = "sm",
  tone = "sun",
  label = "Loading",
  decorative = false,
  className = "",
}: {
  size?: "sm" | "lg";
  tone?: "sun" | "dark";
  /** Text announced to screen readers. */
  label?: string;
  /** When the surrounding element already announces the state (e.g. a busy button). */
  decorative?: boolean;
  className?: string;
}) {
  const px = size === "sm" ? 24 : 64;
  const color = tone === "sun" ? "var(--color-accent-sun)" : "var(--color-action-primary-text)";
  return (
    <svg
      width={px}
      height={px}
      viewBox="40 34 512 530"
      fill="none"
      className={`sun-loader shrink-0 ${className}`}
      {...(decorative ? { "aria-hidden": true } : { role: "status", "aria-label": label })}
    >
      <g stroke={color} strokeWidth="30">
        <path d="M192 303C192 245.56 238.56 199 296 199C353.44 199 400 245.56 400 303" />
        <path d="M192 295C192 352.44 238.56 399 296 399C353.44 399 400 352.44 400 295" />
      </g>
      <g stroke={color} strokeWidth="30" strokeLinecap="round">
        {RAYS.map(([x1, y1, x2, y2], index) => (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="sun-loader-ray"
            // Negative delays start every ray mid-cycle, so the loop is
            // already "spinning" on the first frame.
            style={{ animationDelay: `${index * 0.1 - 0.8}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
