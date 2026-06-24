import type { Metadata } from "next";
import GeneralMembersPage from "@/components/pages/GeneralMembers";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";
import { getGeneralMembersServer } from "@/utils/supabase/executiveCommittee.server";

export const metadata: Metadata = createPageMetadata({
  title: "General Members",
  description:
    "View SNDB general members — doctors and professionals associated with the Society for Nepalese Doctors from Bangladesh.",
  path: "/members/general-members",
  keywords: [
    "SNDB general members",
    "Nepalese doctors Bangladesh",
    "medical society members",
  ],
});

export const revalidate = 300;

export default async function Page() {
  const categories = await getGeneralMembersServer().catch(() => []);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "General Members", path: "/members/general-members" },
        ])}
      />
      <GeneralMembersPage initialCategories={categories} />
    </>
  );
}
