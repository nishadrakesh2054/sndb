import type { Metadata } from "next";
import NoticePage from "@/components/pages/Notice";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Notices & Documents",
  description:
    "Official SNDB notices, announcements, and downloadable documents for members and the medical community.",
  path: "/notice",
  keywords: [
    "SNDB notices",
    "official announcements",
    "medical society documents",
    "Nepalese doctors updates",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Notices", path: "/notice" },
        ])}
      />
      <NoticePage />
    </>
  );
}
