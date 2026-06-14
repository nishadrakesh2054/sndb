import type { Metadata } from "next";
import MessagePage from "@/components/pages/Message";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "President's Message",
  description:
    "Read the message from the SNDB President on community, professional growth, and the mission of Nepalese doctors from Bangladesh.",
  path: "/executive-message",
  keywords: [
    "SNDB president message",
    "Nepalese doctors leadership",
    "medical society president",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "President's Message", path: "/executive-message" },
        ])}
      />
      <MessagePage />
    </>
  );
}
