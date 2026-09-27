// Root layout: self-hosted fonts and global styles.
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
