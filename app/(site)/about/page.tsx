import type { Metadata } from "next";
import AboutPage from "@/components/pages/About";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, createPageMetadata } from "@/lib/seo";
import { getSiteStatsServer } from "@/utils/supabase/content.server";
import { getActiveFaqsServer } from "@/utils/supabase/faqs.server";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about the Society for Nepalese Doctors from Bangladesh (SNDB), our mission, vision, and the professional network supporting Nepalese doctors trained in Bangladesh.",
  path: "/about",
  keywords: [
    "about SNDB",
    "Nepalese doctors Bangladesh",
    "medical society Nepal",
    "SNDB mission",
    "SNDB FAQ",
  ],
});

export const revalidate = 300;

export default async function Page() {
  const [faqs, stats] = await Promise.all([
    getActiveFaqsServer().catch(() => []),
    getSiteStatsServer().catch(() => ({
      memberCount: 0,
      blogCount: 0,
      noticeCount: 0,
    })),
  ]);

  const faqItems = faqs.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
          ]),
          ...(faqItems.length > 0 ? [buildFaqJsonLd(faqItems)] : []),
        ]}
      />
      <AboutPage showStats showFaq initialFaqs={faqs} initialStats={stats} standalone />
    </>
  );
}
