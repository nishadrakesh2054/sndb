import type { Metadata } from "next";
import AboutAffiliationsPage from "@/components/pages/about/AboutAffiliations";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Affiliations with NMA",
  description:
    "Learn about SNDB's affiliation with the Nepal Medical Association (NMA) and what it means for members.",
  path: "/about/affiliations",
  keywords: [
    "SNDB NMA affiliation",
    "Nepal Medical Association",
    "Nepalese doctors society",
    "medical association Nepal",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about/history" },
          {
            name: "Affiliations with NMA",
            path: "/about/affiliations",
          },
        ])}
      />
      <AboutAffiliationsPage />
    </>
  );
}
