import type { Metadata } from "next";
import GalleryPage from "@/components/pages/Gallery";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getPublishedGalleryImagesServer } from "@/utils/supabase/gallery.server";

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

export const revalidate = 300;

export default async function Page() {
  const images = await getPublishedGalleryImagesServer().catch(() => []);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <GalleryPage initialImages={images} />
    </>
  );
}
