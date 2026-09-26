import type { ReactNode } from "react";

// Mobile-first: the Figma mobile frame (390px canvas) uses a 20px side
// gutter throughout every section. At the md breakpoint we switch to the
// desktop canvas's spec — 1440px wide with a fixed 64px gutter (content
// width 1312px).
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-16 ${className}`}>{children}</div>;
}
