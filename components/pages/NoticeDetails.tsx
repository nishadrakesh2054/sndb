"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { getNoticeById, type NoticeItem } from "@/data/staticApi";
import { getMediaUrl } from "@/lib/mediaUrl";
import { PageContainer, PageHeader, PageSection } from "@/components/PageHeader";
import Loader from "./Loader";

const NoticeDetails = ({ noticeId }: { noticeId: string }) => {
  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNotice(getNoticeById(noticeId) ?? null);
    setLoading(false);
  }, [noticeId]);

  if (loading) {
    return (
      <PageSection>
        <PageContainer className="text-center">
          <Loader />
        </PageContainer>
      </PageSection>
    );
  }

  if (!notice) {
    return (
      <PageSection>
        <PageContainer className="max-w-4xl text-center">
          <p className="text-lg font-semibold text-gray-800">Notice not found</p>
          <Link
            href="/notice"
            className="mt-4 inline-block text-sm font-semibold text-green-700 hover:text-green-800"
          >
            Back to Notices
          </Link>
        </PageContainer>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection>
        <PageContainer className="max-w-4xl">
          <Link
            href="/notice"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            <FaArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Notices
          </Link>

          <PageHeader
            label="Notice"
            title={notice.title}
            subtitle={new Date(notice.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            align="left"
          />

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <img
              src={getMediaUrl(notice.images)}
              loading="lazy"
              alt={notice.title}
              className="mx-auto w-full max-w-3xl rounded-lg object-contain"
            />
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
};

export default NoticeDetails;
