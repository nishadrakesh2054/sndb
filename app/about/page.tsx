import type { Metadata } from "next";
import AboutPage from "@/components/pages/About";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about the Society for Nepalese Doctors from Bangladesh (SNDB), our mission, vision, and the professional network supporting Nepalese doctors trained in Bangladesh.",
  path: "/about",
  keywords: [
    "about SNDB",
    "Nepalese doctors Bangladesh",
    "medical society Nepal",
    "SNDB mission",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ])}
      />
      <AboutPage showStats />
    </>
  );
}
