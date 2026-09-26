import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCitySlugs, getCityBySlug } from "@/data/cities";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Simulator } from "@/components/simulator/Simulator";
import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { SocialProofSection } from "@/components/local-crews/SocialProofSection";
import { Faq } from "@/components/faq/Faq";
import { FinalCta } from "@/components/final-cta/FinalCta";

type Params = { city: string };

/**
 * Tells Next.js which [city] values to prerender to static HTML at build
 * time (currently just "phoenix-az"). Any slug not in this list falls
 * through to notFound() below rather than 500ing. When a second city's data
 * file is added to src/data/cities.ts, it's picked up here automatically.
 */
export function generateStaticParams(): Params[] {
  return getAllCitySlugs().map((city) => ({ city }));
}

/**
 * Per-city <title>/<meta description>, generated from the data file. This
 * matters for this page specifically: half the brief's stated traffic is
 * organic search ("residential solar" queries) and AI assistants, both of
 * which read this metadata rather than rendering the page.
 */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Solar Panels in ${city.city}, ${city.state} | Brightfield Solar`;
  const description = `See your solar savings estimate for ${city.city}, ${city.stateFull} in real time. ${city.installsCompleted.toLocaleString("en-US")} installs completed, ${city.avgRating.toFixed(1)}/5 average rating.`;

  // Open Graph: the brief notes visitors send this link to whoever decides
  // with them, so the chat-app preview should look trustworthy.
  return {
    title,
    description,
    openGraph: { title, description, type: "website", siteName: "Brightfield Solar", locale: "en_US" },
    twitter: { card: "summary", title, description },
  };
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  return (
    <>
      {/* First tab stop: jumps keyboard users past the header (WCAG 2.4.1).
          Hidden until focused. */}
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-action-primary px-5 py-3 font-semibold text-action-primary-text focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header city={city} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero city={city} />
        <Simulator city={city} />
        <HowItWorks city={city} />
        <SocialProofSection city={city} />
        <Faq city={city} />
        <FinalCta city={city} />
      </main>
      <Footer city={city} />
    </>
  );
}
