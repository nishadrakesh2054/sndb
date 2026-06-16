import type { Metadata } from "next";
import NoticePage from "@/components/pages/Notice";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getDocumentsServer } from "@/utils/supabase/documents.server";
import { getPublishedNoticesServer } from "@/utils/supabase/notices.server";

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

export const revalidate = 300;

export default async function Page() {
  const [notices, documents] = await Promise.all([
    getPublishedNoticesServer().catch(() => []),
    getDocumentsServer().catch(() => []),
  ]);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Notices", path: "/notice" },
        ])}
      />
      <NoticePage initialNotices={notices} initialDocuments={documents} />
    </>
  );
}
