// Root layout: Google Fonts (downloaded at build time and served from this site) and global styles.
import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken-grotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

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
