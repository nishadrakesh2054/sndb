import type { Metadata } from "next";
import ExecutiveCommiteePage from "@/components/pages/ExecutiveCommitee";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Executive Committee",
  description:
    "Meet the current SNDB executive committee leadership for the 2023–2025 term, including office bearers, vice-presidents, and members.",
  path: "/executive-comimttee",
  keywords: [
    "SNDB executive committee",
    "medical society leadership",
    "Nepalese doctors committee",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Executive Committee", path: "/executive-comimttee" },
        ])}
      />
      <ExecutiveCommiteePage />
    </>
  );
}
