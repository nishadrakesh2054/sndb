import type { Metadata } from "next";
import GalleryPage from "@/components/pages/Gallery";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Photo Gallery",
  description:
    "Browse photos from SNDB events, community gatherings, and activities of Nepalese doctors from Bangladesh.",
  path: "/gallery",
  keywords: [
    "SNDB gallery",
    "Nepalese doctors events",
    "medical community photos",
    "SNDB activities",
  ],
  ogImage: "/about.jpg",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <GalleryPage />
    </>
  );
}
