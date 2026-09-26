import Link from "next/link";
import type { CityData } from "@/data/types";
import { LinkButton } from "@/legacy/phoenix-az2/components/ui/Button";
import { Container } from "@/legacy/phoenix-az2/components/ui/Container";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Local crews", href: "#local-crews" },
  { label: "FAQ", href: "#faq" },
];

/**
 * Server Component. The mobile menu open/close state is handled with a
 * plain checkbox + CSS ("peer-checked") instead of React state, so this
 * component needs no "use client" — no JS ships just to toggle a menu.
 */
export function Header({ city }: { city: CityData }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg-dark text-text-on-dark">
      <Container className="flex h-16 items-center justify-between">
        <Link href={`/${city.slug}`} className="text-lg font-extrabold tracking-tight">
          Brightfield<span className="text-text-accent-on-dark">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-text-on-dark-muted hover:text-text-on-dark">
              {link.label}
            </a>
          ))}
        </nav>

        <LinkButton href="#estimate" variant="primary" className="hidden md:inline-flex">
          Get my estimate
        </LinkButton>

        <input id="mobile-menu-toggle" type="checkbox" className="peer hidden" aria-hidden="true" />
        <label
          htmlFor="mobile-menu-toggle"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 4.5H16M2 9H16M2 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </label>

        <div className="pointer-events-none absolute inset-x-0 top-16 hidden max-h-0 flex-col gap-1 overflow-hidden border-b border-white/10 bg-bg-dark px-6 py-0 opacity-0 transition-all peer-checked:pointer-events-auto peer-checked:flex peer-checked:max-h-96 peer-checked:py-4 peer-checked:opacity-100 md:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="py-2 text-text-on-dark-muted hover:text-text-on-dark">
              {link.label}
            </a>
          ))}
          <LinkButton href="#estimate" variant="primary" className="mt-2 w-full">
            Get my estimate
          </LinkButton>
        </div>
      </Container>
    </header>
  );
}
