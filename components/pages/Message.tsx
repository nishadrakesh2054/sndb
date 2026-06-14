"use client";

import Link from "next/link";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";

const drrakesh = "/doctor3.jpeg";

const Message = () => {
  return (
    <>
      <PageSection>
        <PageContainer>
          <PageHeader
            label="Leadership"
            title={
              <>
                President's <span className="text-green-600">Message</span>
              </>
            }
            subtitle="A message from the SNDB leadership on our vision and commitment to the medical community."
          />

          <article className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-5">
              <div className="border-b border-gray-100 bg-emerald-50/60 p-8 lg:col-span-2 lg:border-b-0 lg:border-r lg:p-10">
                <div className="mx-auto max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <img
                    src={drrakesh}
                    loading="lazy"
                    alt="Dr. Rakesh Shah"
                    className="aspect-[3/4] w-full object-cover object-top"
                  />
                </div>
                <div className="mt-6 text-center lg:text-left">
                  <h2 className="text-xl font-bold text-gray-900">
                    Dr. Rakesh Shah
                  </h2>
                  <p className="mt-1 text-sm font-medium text-green-700">
                    President & Founder, SNDB
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Colorectal Surgeon · Everest Hospital, Kathmandu
                  </p>
                </div>
              </div>

              <div className="p-8 md:p-10 lg:col-span-3">
                <div className="mb-6 flex items-start gap-3">
                  <FaQuoteLeft className="mt-1 h-5 w-5 shrink-0 text-green-600/80" />
                  <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    Message From President
                  </h3>
                </div>

                <div className="space-y-5 text-justify leading-relaxed text-gray-600">
                  <p>
                    As the President of the Society of Nepal Doctors of
                    Bangladesh (SNDB), I am honored to lead an organization that
                    strives to bridge the medical communities of Nepal and
                    Bangladesh. Our mission is to foster collaboration, share
                    expertise, and contribute to the improvement of healthcare
                    systems in both countries.
                  </p>
                  <p>
                    SNDB provides a platform for continuous professional growth,
                    networking, and collaboration among doctors who share common
                    academic roots in Bangladesh. Together, we aim to enhance the
                    professional development of our members and advance the
                    medical field through innovation, research, and collective
                    effort.
                  </p>
                  <p>
                    I invite every member to actively participate in our programs,
                    share knowledge, and uphold the values of service and
                    excellence that define our community. With unity and shared
                    purpose, we can make a meaningful contribution to healthcare
                    in Nepal and beyond.
                  </p>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-6">
                  <p className="text-base font-semibold text-gray-900">
                    Dr. Rakesh Shah
                  </p>
                  <p className="text-sm text-gray-500">
                    President & Founder, SNDB
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/executive-comimttee"
                    className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                  >
                    Executive Committee
                    <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </PageContainer>
      </PageSection>
    </>
  );
};

export default Message;
