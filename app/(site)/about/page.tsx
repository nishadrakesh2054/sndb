import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about the Society of Nepal Doctors of Bangladesh — history, registrations, affiliations, and leadership.",
  path: "/about/history",
  noIndex: true,
  omitCanonical: true,
});

export default function AboutIndexPage() {
  redirect("/about/history");
}
