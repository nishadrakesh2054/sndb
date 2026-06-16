"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import {
  getNoticeBySlug,
  getNoticeDisplayDate,
  getNoticeImageAlt,
  type Notice,
} from "@/utils/supabase/notices";
import { getMediaUrl } from "@/lib/mediaUrl";
import { PageContainer, PageHeader, PageSection } from "@/components/PageHeader";
import Loader from "./Loader";

const formatDate = (timestamp: string): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const NoticeDetails = ({
  slug,
  initialNotice = null,
}: {
  slug: string;
  initialNotice?: Notice | null;
}) => {
  const [notice, setNotice] = useState<Notice | null>(initialNotice);
  const [loading, setLoading] = useState(!initialNotice);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadNotice = async () => {
      setError(null);

      try {
        const data = await getNoticeBySlug(slug);
        if (!cancelled) {
          setNotice(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load notice."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!initialNotice) {
      setLoading(true);
    }

    loadNotice();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageSection>
        <PageContainer className="text-center">
          <Loader />
        </PageContainer>
      </PageSection>
    );
  }

  if (error) {
    return (
      <PageSection>
        <PageContainer className="max-w-4xl text-center">
          <p className="text-lg font-semibold text-red-600">{error}</p>
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
            subtitle={formatDate(getNoticeDisplayDate(notice))}
            align="left"
          />

          {notice.excerpt && (
            <p className="mb-6 text-gray-600">{notice.excerpt}</p>
          )}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <img
              src={getMediaUrl(notice.image_url)}
              alt={getNoticeImageAlt(notice)}
              loading="lazy"
              className="mx-auto w-full max-w-3xl rounded-lg object-contain"
            />
          </div>

          {notice.content && (
            <div className="prose prose-gray mt-8 max-w-none">
              <p className="whitespace-pre-line text-gray-700">{notice.content}</p>
            </div>
          )}
        </PageContainer>
      </PageSection>
    </>
  );
};

export default NoticeDetails;
