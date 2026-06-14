import type { Metadata } from "next";
import MemberPage from "@/components/pages/Member";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Life Members",
  description:
    "Meet SNDB life members — Nepalese doctors who graduated from Bangladesh and contribute to healthcare in Nepal and abroad.",
  path: "/member",
  keywords: [
    "SNDB members",
    "life members",
    "Nepalese doctors list",
    "Bangladesh medical graduates",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Life Members", path: "/member" },
        ])}
      />
      <MemberPage />
    </>
  );
}
