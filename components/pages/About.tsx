"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import MediaImage from "@/components/MediaImage";
import { getActiveFaqs, type Faq } from "@/utils/supabase/faqs";
import {
  PageContainer,
  PageHeader,
  PageSection,
  SectionHeader,
} from "@/components/PageHeader";

type StatItem = {
  value: string;
  label: string;
};

type SiteStats = {
  memberCount: number;
  blogCount: number;
  noticeCount: number;
};

const buildStats = (stats: SiteStats): StatItem[] => [
  { value: "1000+", label: "Doctors Network" },
  { value: `${stats.memberCount}+`, label: "Life Members" },
  { value: `${stats.noticeCount}+`, label: "Notices & Updates" },
  { value: `${stats.blogCount}+`, label: "Blog Articles" },
];

const StatsSection = ({ initialStats }: { initialStats?: SiteStats }) => {
  const [stats, setStats] = useState<StatItem[]>(
    initialStats
      ? buildStats(initialStats)
      : [
          { value: "1000+", label: "Doctors Network" },
          { value: "—", label: "Life Members" },
          { value: "—", label: "Notices & Updates" },
          { value: "—", label: "Blog Articles" },
        ]
  );

  useEffect(() => {
    if (initialStats) {
      return;
    }

    const loadStats = async () => {
      try {
        const { getMemberCount } = await import("@/utils/supabase/members");
        const { getPublishedBlogCount } = await import("@/utils/supabase/blogs");
        const { getPublishedNoticeCount } = await import(
          "@/utils/supabase/notices"
        );

        const [memberCount, blogCount, noticeCount] = await Promise.all([
          getMemberCount(),
          getPublishedBlogCount(),
          getPublishedNoticeCount(),
        ]);

        setStats(
          buildStats({ memberCount, blogCount, noticeCount })
        );
      } catch {
        setStats(buildStats({ memberCount: 0, blogCount: 0, noticeCount: 0 }));
      }
    };

    loadStats();
  }, [initialStats]);

  return (
    <section className="border-t border-gray-200 bg-white py-10 md:py-14">
      <PageContainer>
        <div className="mx-auto max-w-xl text-center">
          <SectionHeader
            label="Our Impact"
            heading="SNDB at a Glance"
            as="h3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-8 text-center"
            >
              <p className="text-3xl font-bold text-green-700 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

const FaqSection = ({ initialFaqs = [] }: { initialFaqs?: Faq[] }) => {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [loading, setLoading] = useState(initialFaqs.length === 0);
  const [openId, setOpenId] = useState<string | null>(initialFaqs[0]?.id ?? null);

  useEffect(() => {
    if (initialFaqs.length > 0) {
      return;
    }

    let cancelled = false;

    const loadFaqs = async () => {
      setLoading(true);

      try {
        const data = await getActiveFaqs();
        if (!cancelled) {
          setFaqs(data);
          setOpenId(data[0]?.id ?? null);
        }
      } catch {
        if (!cancelled) {
          setFaqs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFaqs();

    return () => {
      cancelled = true;
    };
  }, [initialFaqs.length]);

  return (
    <section className="border-t border-green-200/60 bg-[#e4f7ef] py-12 md:py-16">
      <PageContainer>
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <SectionHeader
            label="FAQ"
            heading="Frequently Asked Questions"
            description="Common questions about SNDB, membership, and how to get in touch."
            as="h3"
          />
        </div>

        {loading ? (
          <div className="mx-auto max-w-3xl space-y-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl border border-green-200/70 bg-white/70"
              />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-sm text-gray-600">
            FAQ content will appear here soon.
          </p>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              const panelId = `faq-panel-${faq.id}`;

              return (
                <article
                  key={faq.id}
                  className="overflow-hidden rounded-xl border border-green-200/70 bg-white/95 shadow-sm"
                >
                  <button
                    type="button"
                    id={`faq-button-${faq.id}`}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-[#f4fbf7]"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="flex-1 pr-2 text-base font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <FaChevronDown
                      className={[
                        "mt-1 h-4 w-4 shrink-0 text-green-700 transition-transform duration-200",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>
                  {isOpen ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={`faq-button-${faq.id}`}
                      className="border-t border-green-100 px-5 pb-5 pt-4 pl-16"
                    >
                      <p className="text-sm leading-relaxed text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </PageContainer>
    </section>
  );
};

const aboutimg = "/about.jpg";

const About: React.FC<{
  showStats?: boolean;
  showFaq?: boolean;
  initialFaqs?: Faq[];
  initialStats?: SiteStats;
  standalone?: boolean;
}> = ({ showStats = false, showFaq = false, initialFaqs, initialStats, standalone = false }) => {
  return (
    <>
      <PageSection>
        <PageContainer className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <PageHeader
              label="About Us"
              align="left"
              as={standalone ? "h1" : "h2"}
              title={
                <>
                  About{" "}
                  <span className="text-green-600">
                    Society of Nepal Doctors of Bangladesh
                  </span>
                </>
              }
            />

            <div className="space-y-6 text-justify leading-relaxed text-gray-600">
              <p>
                Society for Nepalese Doctors from Bangladesh (SNDB) is the
                non-political, non-profit organization for Nepalese doctors
                who have accomplished either MBBS/BDS or MD/MS or both degrees
                from Bangladesh, currently practicing in Nepal or abroad. It is
                our pleasure to inform you that there are thousands of doctors who
                have graduated from Bangladesh and many of them are holding major
                positions in most of the prestigious and reputed
                institutions and hospitals across Nepal.
              </p>
              <p>
                SNDB strives to create a platform for continuous professional
                growth, networking, and collaboration among its members. We aim to
                promote the exchange of knowledge, support career development, and
                foster a sense of unity among doctors who share common academic
                roots in Bangladesh. Our goal is to contribute to the enhancement
                of healthcare services in Nepal through shared expertise and
                collective efforts.
              </p>
            </div>

            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
            >
              Contact Us
              <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <MediaImage
                src={aboutimg}
                alt="Society of Nepal Doctors from Bangladesh"
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </PageContainer>
      </PageSection>

      {showStats ? <StatsSection initialStats={initialStats} /> : null}
      {showFaq ? <FaqSection initialFaqs={initialFaqs} /> : null}
    </>
  );
};

export default About;
