"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import SafeHtml from "@/components/safeHtml";
import { getBlogBySlug, type BlogPost } from "@/utils/supabase/blogs";
import { getMediaUrl } from "@/lib/mediaUrl";
import { PageContainer, PageSection } from "@/components/PageHeader";

const formatDate = (timestamp: string | null): string => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BlogDetails = ({
  slug,
  initialBlog = null,
}: {
  slug: string;
  initialBlog?: BlogPost | null;
}) => {
  const [blog, setBlog] = useState<BlogPost | null>(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBlog) {
      return;
    }

    let cancelled = false;

    const loadBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const post = await getBlogBySlug(slug);
        if (!cancelled) {
          setBlog(post);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load this article."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      cancelled = true;
    };
  }, [slug, initialBlog]);

  return (
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

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-white px-6 py-10 text-center shadow-sm">
            <p className="font-medium text-red-600">{error}</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-sm font-semibold text-green-700 hover:text-green-800"
            >
              Return to Blogs
            </Link>
          </div>
        )}

        {!loading && !error && !blog && (
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

        {!loading && !error && blog && (
          <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-hidden border-b border-gray-100">
              <img
                src={getMediaUrl(blog.featured_image)}
                alt={blog.featured_image_alt || blog.title}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-widest text-green-700">
                {blog.category?.name && <span>{blog.category.name}</span>}
                <time dateTime={blog.published_at ?? blog.created_at}>
                  {formatDate(blog.published_at ?? blog.created_at)}
                </time>
                {blog.reading_time_minutes ? (
                  <span>{blog.reading_time_minutes} min read</span>
                ) : null}
              </div>

              <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {blog.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-gray-600">
                {blog.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-y border-gray-100 py-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {blog.author_name}
                </span>
                {blog.author_title ? (
                  <span className="text-gray-500">· {blog.author_title}</span>
                ) : null}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-green-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-green mt-8 max-w-none text-justify leading-relaxed text-gray-700 [&_li]:text-gray-700 [&_p]:mb-4 [&_strong]:text-gray-900 [&_ul]:my-4">
                <SafeHtml htmlString={blog.content} />
              </div>
            </div>
          </article>
        )}
      </PageContainer>
    </PageSection>
  );
};

export default BlogDetails;
