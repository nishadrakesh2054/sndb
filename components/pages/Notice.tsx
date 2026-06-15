"use client";

import { useEffect, useState } from "react";
import { FaArrowRight, FaDownload, FaFilePdf, FaImage } from "react-icons/fa";
import Link from "next/link";
import { getDocuments, getDocumentFileKind, type Document } from "@/utils/supabase/documents";
import {
  getNoticeDisplayDate,
  getNoticeImageAlt,
  getPublishedNotices,
  type Notice,
} from "@/utils/supabase/notices";
import { getMediaUrl } from "@/lib/mediaUrl";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
    <h2 className="mb-6 inline-block border-b-2 border-green-600 pb-2 text-lg font-semibold text-gray-900">
      {title}
    </h2>
    {children}
  </div>
);

const DocumentFileIcon = ({ filePath }: { filePath: string }) => {
  const kind = getDocumentFileKind(filePath);

  if (kind === "pdf") {
    return (
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600"
        aria-hidden="true"
      >
        <FaFilePdf className="h-5 w-5" />
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-green-100 bg-green-50 text-green-700"
        aria-hidden="true"
      >
        <FaImage className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600"
      aria-hidden="true"
    >
      <FaDownload className="h-5 w-5" />
    </div>
  );
};

const Notice: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [noticeData, documentData] = await Promise.all([
          getPublishedNotices(),
          getDocuments(),
        ]);
        if (!cancelled) {
          setNotices(noticeData);
          setDocuments(documentData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load notices."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageSection>
        <PageContainer>
          <PageHeader
            label="Notice"
            title={
              <>
                Notices & <span className="text-green-600">Documents</span>
              </>
            }
            subtitle="Official announcements and downloadable documents from SNDB."
          />

          {loading ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              <SectionCard title="Latest Notices">
                {error ? (
                  <p className="text-sm text-red-600">{error}</p>
                ) : notices.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No notices available at the moment.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {notices.map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-4 rounded-lg border border-gray-100 p-3 transition hover:border-green-200 hover:bg-emerald-50/40"
                      >
                        <Link
                          href={`/notice/${item.slug}`}
                          className="shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white"
                        >
                          <img
                            src={getMediaUrl(item.image_url)}
                            alt={getNoticeImageAlt(item)}
                            loading="lazy"
                            className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <time className="text-xs font-medium uppercase tracking-wide text-green-700">
                            {formatDate(getNoticeDisplayDate(item))}
                          </time>
                          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <Link
                            href={`/notice/${item.slug}`}
                            className="group mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800"
                          >
                            View Notice
                            <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              <SectionCard title="Important Documents">
                {documents.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No documents available at the moment.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {documents.map((document) => (
                      <li
                        key={document.id}
                        className="flex flex-col gap-3 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3 sm:pr-4">
                          <DocumentFileIcon filePath={document.file_path} />
                          <h3 className="text-sm font-semibold text-gray-800">
                            {document.title}
                          </h3>
                        </div>
                        <a
                          href={getMediaUrl(document.file_path)}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
                        >
                          <FaDownload className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            </div>
          )}
        </PageContainer>
      </PageSection>
    </>
  );
};

export default Notice;
