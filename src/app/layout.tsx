import type { Metadata } from "next";
import "./globals.css";

// The Figma design specifies Hanken Grotesk. next/font/google is the
// idiomatic way to load it (self-hosted at build time, no layout shift,
// no runtime request to Google) — but fetching it requires build-time
// network access to fonts.googleapis.com, which this sandbox's egress
// policy blocks. Using the system font stack here instead means zero
// external dependency at build time, in any environment. To switch to
// Hanken Grotesk on a host that allows it, swap this back to
// `import { Hanken_Grotesk } from "next/font/google"` and reference its
// `variable` on <html>; --font-sans in globals.css already expects that
// variable name.

// Fallback metadata for the root layout. The actual per-city title and
// description are set by app/[city]/page.tsx via generateMetadata, since
// that's where the city-specific content lives.
export const metadata: Metadata = {
  title: "Brightfield Solar",
  description: "Solar installation estimates for your city.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-bg-light text-text-on-light font-sans">{children}</body>
    </html>
  );
}
