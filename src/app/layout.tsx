import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fonts from the Figma file: Hanken Grotesk for display (headings, big
// numbers) and Inter for body/UI text. Self-hosted variable fonts (from
// @fontsource-variable, latin subset) via next/font/local, so the build
// never needs network access to Google Fonts and there is no layout shift.
const hankenGrotesk = localFont({
  src: "./fonts/hanken-grotesk-latin-wght.woff2",
  weight: "100 900",
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin-wght.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

// Fallback metadata for the root layout. The actual per-city title and
// description are set by app/[city]/page.tsx via generateMetadata, since
// that's where the city-specific content lives.
export const metadata: Metadata = {
  title: "Brightfield Solar",
  description: "Solar installation estimates for your city.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${inter.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-bg-light font-sans text-text-on-light">{children}</body>
    </html>
  );
}
