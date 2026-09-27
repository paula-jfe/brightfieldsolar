// Sticky header with desktop navigation and the mobile menu.
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CityData } from "@/data/types";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Local crews", href: "#local-crews" },
  { label: "FAQs", href: "#faq" },
];

export function Header({ city }: { city: CityData }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menuRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
      setOpen(false);
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="surface-dark sticky top-0 z-40 bg-bg-dark/95 backdrop-blur [@media(max-height:500px)]:relative">
      <Container className="flex h-24 items-center justify-between lg:h-[102px]">
        <Link href={`/${city.slug}`} aria-label="Brightfield Solar home" onClick={close}>
          <Logo tone="on-dark" />
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          <nav aria-label="Main" className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-1 text-text-on-dark-muted transition-colors hover:text-text-on-dark"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent-sun transition-transform group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <LinkButton href="#estimate" variant="primary">
            Get my estimate
          </LinkButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded-full text-text-on-dark active:bg-white/12 lg:hidden"
        >
          <span aria-hidden="true" className="relative block h-[19px] w-6">
            <span
              className={`absolute left-0 top-0 h-[3px] w-6 rounded-full bg-current transition-transform ${
                open ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[8px] h-[3px] w-6 rounded-full bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[16px] h-[3px] w-6 rounded-full bg-current transition-transform ${
                open ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </Container>

      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label="Menu"
        inert={!open}
        className={`absolute inset-x-0 top-full origin-top border-t border-border-dark bg-bg-dark/95 shadow-[0_16px_32px_rgba(13,18,26,0.35)] backdrop-blur transition-[opacity,transform] lg:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <Container className="pb-6 pt-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={close} className="block py-3.5 text-lg text-text-on-dark transition-colors active:text-accent-sun">
              {link.label}
            </a>
          ))}
          <LinkButton href="#estimate" variant="primary" onClick={close} className="mt-4 w-full">
            Get my estimate
          </LinkButton>
        </Container>
      </nav>
    </header>
  );
}
