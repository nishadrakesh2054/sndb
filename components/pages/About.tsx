"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { getPublishedBlogCount } from "@/utils/supabase/blogs";
import { getMemberCount } from "@/utils/supabase/members";
import { getPublishedNoticeCount } from "@/utils/supabase/notices";
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

const StatsSection = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { value: "1000+", label: "Doctors Network" },
    { value: "—", label: "Life Members" },
    { value: "—", label: "Notices & Updates" },
    { value: "—", label: "Blog Articles" },
  ]);

  useEffect(() => {
    const loadStats = async () => {
      let memberCount = 0;
      let blogCount = 0;
      let noticeCount = 0;

      try {
        [memberCount, blogCount, noticeCount] = await Promise.all([
          getMemberCount(),
          getPublishedBlogCount(),
          getPublishedNoticeCount(),
        ]);
      } catch {
        memberCount = 0;
        blogCount = 0;
        noticeCount = 0;
      }

      setStats([
        { value: "1000+", label: "Doctors Network" },
        { value: `${memberCount}+`, label: "Life Members" },
        { value: `${noticeCount}+`, label: "Notices & Updates" },
        { value: `${blogCount}+`, label: "Blog Articles" },
      ]);
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

const aboutimg = "/about.jpg";

const About: React.FC<{ showStats?: boolean }> = ({ showStats = false }) => {
  return (
    <>
      <PageSection>
        <PageContainer className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <PageHeader
              label="About Us"
              align="left"
              as="h2"
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
                Society for Nepalese Doctor from Bangladesh (SNDB) is the
                non-political, non-profitable organization for the Neplase Doctors
                who have accomplished either MBBS/BDS or MD/MS or both degrees
                from Bangladesh, currently practicing in Nepal or abroad. It is
                our pleasure to inform you that there are thousand of doctors who
                have graduates from Bangladesh and many of them are holding major
                positions in most of the prestigious and reputed
                institutions/Hospitals across Nepal.
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
              <img
                src={aboutimg}
                alt="Society of Nepal Doctors from Bangladesh"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </PageContainer>
      </PageSection>

      {showStats && <StatsSection />}
    </>
  );
};

export default About;
