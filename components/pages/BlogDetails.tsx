"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import SafeHtml from "@/components/safeHtml";
import { getBlogById, type BlogPost } from "@/data/staticApi";
import { getMediaUrl } from "@/lib/mediaUrl";
import { PageContainer, PageSection } from "@/components/PageHeader";

const formatDate = (timestamp: string): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const cleanDescription = (html: string) =>
  html
    .replace(/<strong>\s*Description:\s*<\/strong>/gi, "")
    .replace(/^Description:\s*/i, "");

const BlogDetails = ({ blogId }: { blogId: string }) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBlog(getBlogById(blogId) ?? null);
    setLoading(false);
  }, [blogId]);

  return (
    <>
      <PageSection>
        <PageContainer className="max-w-4xl">
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            <FaArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Blogs
          </Link>

          {loading && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="aspect-[16/9] animate-pulse bg-gray-200" />
              <div className="space-y-4 p-6 md:p-8">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          )}

          {!loading && !blog && (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-800">
                Article not found
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-block text-sm font-semibold text-green-700 hover:text-green-800"
              >
                Return to Blogs
              </Link>
            </div>
          )}

          {!loading && blog && (
            <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-hidden border-b border-gray-100">
                <img
                  src={getMediaUrl(blog.image)}
                  alt={blog.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>

              <div className="p-6 md:p-10">
                <p className="text-xs font-medium uppercase tracking-widest text-green-700">
                  Activities & Blog
                </p>
                <time className="mt-3 block text-sm text-gray-500">
                  {formatDate(blog.createdAt)}
                </time>
                <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                  {blog.title}
                </h1>

                <div className="prose prose-green mt-8 max-w-none text-justify leading-relaxed text-gray-700 [&_li]:text-gray-700 [&_p]:mb-4 [&_strong]:text-gray-900 [&_ul]:my-4">
                  <SafeHtml htmlString={cleanDescription(blog.description)} />
                </div>
              </div>
            </article>
          )}
        </PageContainer>
      </PageSection>
    </>
  );
};

export default BlogDetails;
