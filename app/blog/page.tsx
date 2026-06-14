import type { Metadata } from "next";
import BlogPage from "@/components/pages/Blog";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Read articles, healthcare insights, and community updates from the Society of Nepal Doctors of Bangladesh.",
  path: "/blog",
  keywords: [
    "SNDB blog",
    "Nepalese doctors articles",
    "healthcare Nepal",
    "medical community updates",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <BlogPage />
    </>
  );
}
