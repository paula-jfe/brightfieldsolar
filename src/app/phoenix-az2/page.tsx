import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityBySlug } from "@/data/cities";
import { Header } from "@/legacy/phoenix-az2/components/layout/Header";
import { Footer } from "@/legacy/phoenix-az2/components/layout/Footer";
import { Hero } from "@/legacy/phoenix-az2/components/hero/Hero";
import { Simulator } from "@/legacy/phoenix-az2/components/simulator/Simulator";
import { HowItWorks } from "@/legacy/phoenix-az2/components/how-it-works/HowItWorks";
import { LocalCrews } from "@/legacy/phoenix-az2/components/local-crews/LocalCrews";
import { Testimonials } from "@/legacy/phoenix-az2/components/testimonials/Testimonials";
import { Faq } from "@/legacy/phoenix-az2/components/faq/Faq";
import { FinalCta } from "@/legacy/phoenix-az2/components/final-cta/FinalCta";

/**
 * TEMPORARY comparison route — not part of the challenge deliverable.
 *
 * This is a frozen snapshot of the pre-Figma-fidelity "foundation" build,
 * kept only so /phoenix-az (the real, data-driven route) can be compared
 * side by side with this earlier version. It intentionally does NOT go
 * through [city] dynamic routing — it always renders Phoenix, and it
 * imports its own self-contained copies of every component from
 * src/legacy/phoenix-az2/ (including Button/Container) so that ongoing
 * work on the real components never changes what's shown here.
 *
 * Delete this folder and src/legacy/ before submitting the challenge.
 */
export const metadata: Metadata = {
  title: "Brightfield Solar — Phoenix (comparison build)",
  robots: { index: false, follow: false },
};

export default function PhoenixAz2Page() {
  const city = getCityBySlug("phoenix-az");
  if (!city) notFound();

  return (
    <>
      <Header city={city} />
      <main>
        <Hero city={city} />
        <Simulator city={city} />
        <HowItWorks />
        <LocalCrews city={city} />
        <Testimonials city={city} />
        <Faq city={city} />
        <FinalCta city={city} />
      </main>
      <Footer city={city} />
    </>
  );
}
