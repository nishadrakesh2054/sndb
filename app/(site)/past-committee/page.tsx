import type { Metadata } from "next";
import PastEXCommPage from "@/components/pages/PastEXComm";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getPastCommitteeServer } from "@/utils/supabase/executiveCommittee.server";

export const metadata: Metadata = createPageMetadata({
  title: "Past Executive Committee",
  description:
    "View the past SNDB executive committee members from the 2021–2022 term, including office bearers and committee members.",
  path: "/past-committee",
  keywords: [
    "past SNDB committee",
    "former executive committee",
    "Nepalese doctors history",
  ],
});

export const revalidate = 300;

export default async function Page() {
  const categories = await getPastCommitteeServer().catch(() => []);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Past Executive Committee", path: "/past-committee" },
        ])}
      />
      <PastEXCommPage initialCategories={categories} />
    </>
  );
}
