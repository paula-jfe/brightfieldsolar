// Root URL redirects to the default city page.
import { redirect } from "next/navigation";
import { DEFAULT_CITY_SLUG } from "@/data/cities.ts";

export default function RootPage() {
  redirect(`/${DEFAULT_CITY_SLUG}`);
}
