import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/data/cities.ts";

/**
 * The root URL always shows one city — currently Phoenix. Rather than
 * duplicating the page markup here AND in app/[city]/page.tsx, "/" simply
 * redirects to the canonical /[city] URL, so there is exactly one place
 * that renders a city page.
 */
export default function RootPage() {
  redirect(`/${DEFAULT_CITY_SLUG}`);
}
