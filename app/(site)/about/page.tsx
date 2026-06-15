import type { Metadata } from "next";
import AboutPage from "@/components/pages/About";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, createPageMetadata } from "@/lib/seo";
import { createPublicServerClient } from "@/utils/supabase/public.server";

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

export default async function Page() {
  const supabase = createPublicServerClient();
  const { data: faqs } = await supabase
    .from("faqs")
    .select("question, answer")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const faqItems = (faqs ?? []).map((item) => ({
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
      <AboutPage showStats showFaq />
    </>
  );
}
