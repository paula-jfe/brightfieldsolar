import type { ReactNode } from "react";

// Figma canvas is 1440px wide with a fixed 64px side gutter (content width
// 1312px). max-w-[1440px] + px-16 at the md breakpoint reproduces that.
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-6 md:px-16 ${className}`}>{children}</div>;
}
