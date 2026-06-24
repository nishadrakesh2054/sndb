import type { Metadata } from "next";
import AdvisoryBoardPage from "@/components/pages/AdvisoryBoard";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getAdvisoryBoardServer } from "@/utils/supabase/executiveCommittee.server";

export const metadata: Metadata = createPageMetadata({
  title: "Advisory Board Members",
  description:
    "Meet the SNDB advisory board members — experienced doctors guiding the society for Nepalese doctors from Bangladesh.",
  path: "/members/advisory-board",
  keywords: [
    "SNDB advisory board",
    "Nepalese doctors advisory",
    "medical society Nepal",
  ],
});

export const revalidate = 300;

export default async function Page() {
  const categories = await getAdvisoryBoardServer().catch(() => []);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Advisory Board Members", path: "/members/advisory-board" },
        ])}
      />
      <AdvisoryBoardPage initialCategories={categories} />
    </>
  );
}
