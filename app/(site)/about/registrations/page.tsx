import type { Metadata } from "next";
import AboutRegistrationsPage from "@/components/pages/about/AboutRegistrations";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Registrations",
  description:
    "SNDB legal registration with the Government of Nepal and information on how doctors can register for society membership.",
  path: "/about/registrations",
  keywords: [
    "SNDB registration",
    "Nepalese doctors society registration",
    "SNDB membership",
    "non-profit medical society Nepal",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about/history" },
          { name: "Registrations", path: "/about/registrations" },
        ])}
      />
      <AboutRegistrationsPage />
    </>
  );
}
