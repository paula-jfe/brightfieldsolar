// City page: static params, per-city metadata and the six sections.
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

export function generateStaticParams(): Params[] {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Solar Panels in ${city.city}, ${city.state} | Brightfield Solar`;
  const description = `See your solar savings estimate for ${city.city}, ${city.stateFull} in real time. ${city.installsCompleted.toLocaleString("en-US")} installs completed, ${city.avgRating.toFixed(1)}/5 average rating.`;

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
