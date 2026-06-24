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

export const StatsSection = ({ initialStats }: { initialStats?: SiteStats }) => {
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
  }, []);

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

export const FaqSection = ({ initialFaqs = [] }: { initialFaqs?: Faq[] }) => {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [loading, setLoading] = useState(initialFaqs.length === 0);
  const [openId, setOpenId] = useState<string | null>(initialFaqs[0]?.id ?? null);

  useEffect(() => {
    let cancelled = false;

    const loadFaqs = async () => {
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

    if (initialFaqs.length === 0) {
      setLoading(true);
    }

    loadFaqs();

    return () => {
      cancelled = true;
    };
  }, []);

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

const aboutimg = "/about.png";

const AboutImageVisual = ({ priority = false }: { priority?: boolean }) => (
  <div className="relative isolate w-full max-w-full">
    <div
      className="pointer-events-none absolute right-0 top-0 z-0 h-[92%] w-[86%] rounded-2xl bg-gradient-to-br from-green-700 to-green-600 shadow-lg"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute bottom-0 left-0 z-0 h-[76%] w-[72%] rounded-2xl border-2 border-green-600/25 bg-[#e4f7ef]"
      aria-hidden="true"
    />

    <div
      className="pointer-events-none absolute right-3 top-6 z-20 h-12 w-12 rounded-full border-[3px] border-white bg-green-600 shadow-md md:h-14 md:w-14"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute bottom-10 left-3 z-20 h-8 w-8 rotate-45 rounded-sm bg-green-600/90 shadow-sm md:h-10 md:w-10"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute right-[20%] top-2 z-20 h-3 w-3 rounded-full bg-green-800/70"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute bottom-5 left-[20%] z-20 hidden h-16 w-16 rounded-full border-2 border-dashed border-green-600/40 md:block"
      aria-hidden="true"
    />

    <div className="relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_48px_-20px_rgba(22,101,52,0.55)]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-800 via-green-600 to-green-700" />
      <MediaImage
        src={aboutimg}
        alt="Society of Nepal Doctors from Bangladesh"
        width={1800}
        height={900}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="block h-auto w-full object-contain"
      />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-green-900/10 to-transparent" />
    </div>
  </div>
);

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
        <PageContainer className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10 lg:gap-12">
          <div className="min-w-0 md:col-span-6">
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
              Society for Nepalese Doctors from Bangladesh (SNDB) is a non-political, non-profit organization representing Nepalese doctors who completed their medical education in Bangladesh and are currently practicing in Nepal and around the world.
              </p>
              <p>
              SNDB promotes professional growth, networking, and collaboration among its members while fostering knowledge exchange, career development, and unity. Through shared expertise and collective efforts, we strive to contribute to the advancement of healthcare services in Nepal.
              </p>
            </div>

            <Link
              href="/about/history"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
            >
              Read More
              <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="min-w-0 w-full md:col-span-6">
            <AboutImageVisual priority={standalone} />
          </div>
        </PageContainer>
      </PageSection>

      {showStats ? <StatsSection initialStats={initialStats} /> : null}
      {showFaq ? <FaqSection initialFaqs={initialFaqs} /> : null}
    </>
  );
};

export default About;
