import type { Metadata } from "next";
import AboutFoundersMessagePage from "@/components/pages/about/AboutFoundersMessage";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Founder's Message",
  description:
    "Read the founder's message from Dr. Rakesh Shah on establishing SNDB and uniting Nepalese doctors trained in Bangladesh.",
  path: "/about/founders-message",
  keywords: [
    "SNDB founder message",
    "Dr. Rakesh Shah SNDB",
    "Nepalese doctors Bangladesh founder",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about/history" },
          { name: "Founder's Message", path: "/about/founders-message" },
        ])}
      />
      <AboutFoundersMessagePage />
    </>
  );
}
