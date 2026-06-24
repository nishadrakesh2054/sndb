import type { Metadata } from "next";
import AboutHistoryPage from "@/components/pages/about/AboutHistory";
import { FaqSection, StatsSection } from "@/components/pages/About";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, createPageMetadata } from "@/lib/seo";
import { getSiteStatsServer } from "@/utils/supabase/content.server";
import { getActiveFaqsServer } from "@/utils/supabase/faqs.server";

export const metadata: Metadata = createPageMetadata({
  title: "History",
  description:
    "Learn about the history of the Society for Nepalese Doctors from Bangladesh (SNDB), from its early community roots to formal registration and NMA affiliation.",
  path: "/about/history",
  keywords: [
    "SNDB history",
    "Nepalese doctors Bangladesh",
    "medical society Nepal",
    "SNDB registration",
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
            { name: "About Us", path: "/about/history" },
            { name: "History", path: "/about/history" },
          ]),
          ...(faqItems.length > 0 ? [buildFaqJsonLd(faqItems)] : []),
        ]}
      />
      <AboutHistoryPage />
      <StatsSection initialStats={stats} />
      <FaqSection initialFaqs={faqs} />
    </>
  );
}
