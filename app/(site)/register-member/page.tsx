import type { Metadata } from "next";
import MemberShipPage from "@/components/pages/MemberShip";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Membership Information",
  description:
    "Learn about SNDB membership requirements, fees, and how to apply online as a life or associate member.",
  path: "/register-member",
  keywords: [
    "SNDB membership",
    "join SNDB",
    "life membership Nepal doctors",
    "medical society application",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Membership", path: "/register-member" },
        ])}
      />
      <MemberShipPage />
    </>
  );
}
