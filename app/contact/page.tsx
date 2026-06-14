import type { Metadata } from "next";
import ContactPage from "@/components/pages/Contact";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact the Society for Nepalese Doctors from Bangladesh (SNDB) for membership, partnerships, and general inquiries in Kathmandu, Nepal.",
  path: "/contact",
  keywords: [
    "contact SNDB",
    "Nepalese doctors contact",
    "SNDB Kathmandu",
    "medical society contact",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactPage />
    </>
  );
}
