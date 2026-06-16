"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MediaImage from "@/components/MediaImage";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getPublishedBlogs, type BlogPost } from "@/utils/supabase/blogs";
import {
  PageContainer,
  PageHeader,
} from "@/components/PageHeader";

const HOME_BLOG_LIMIT = 3;
const BLOG_PAGE_SIZE = 6;

const formatDate = (timestamp: string | null): string => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SectionHeader = ({ as = "h2" }: { as?: "h1" | "h2" }) => (
  <PageHeader
    label="Activities & Blog"
    as={as}
    title={
      <>
        Latest Updates & <span className="text-green-700">Stories</span>
      </>
    }
    subtitle="Latest news and activities from our community."
  />
);

const Blog = ({
  isHomeSection = false,
  initialPosts = [],
  initialTotal = 0,
}: {
  isHomeSection?: boolean;
  initialPosts?: BlogPost[];
  initialTotal?: number;
}) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialPosts);
  const [totalPosts, setTotalPosts] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(
    isHomeSection ? initialPosts.length === 0 : initialPosts.length === 0
  );
  const [error, setError] = useState<string | null>(null);

  const pageCount = Math.ceil(totalPosts / BLOG_PAGE_SIZE);

  useEffect(() => {
    if (isHomeSection && initialPosts.length > 0) {
      return;
    }

    if (!isHomeSection && currentPage === 1 && initialPosts.length > 0) {
      return;
    }

    let cancelled = false;

    const loadBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getPublishedBlogs(
          isHomeSection
            ? { limit: HOME_BLOG_LIMIT }
            : { page: currentPage, pageSize: BLOG_PAGE_SIZE }
        );

        if (!cancelled) {
          setBlogPosts(result.posts);
          setTotalPosts(result.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load blog posts."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [isHomeSection, currentPage, initialPosts.length]);

  const sectionClassName = isHomeSection
    ? "relative overflow-hidden border-t border-green-200/60 bg-[#e4f7ef] py-12 md:py-16"
    : "relative overflow-hidden bg-[#e4f7ef] py-12 md:py-16";

  const startIndex = (currentPage - 1) * BLOG_PAGE_SIZE;

  return (
    <section className={sectionClassName}>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 25%, rgba(134, 239, 172, 0.35) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(110, 231, 183, 0.3) 0%, transparent 40%)",
        }}
      />

      <PageContainer className="relative">
        <SectionHeader as={isHomeSection ? "h2" : "h1"} />

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(isHomeSection ? HOME_BLOG_LIMIT : BLOG_PAGE_SIZE)].map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-green-200/70 bg-white/90 shadow-sm"
                >
                  <div className="h-48 animate-pulse bg-green-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-green-100" />
                    <div className="h-5 w-full animate-pulse rounded bg-green-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-green-100" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-white px-6 py-8 text-center shadow-sm">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !blogPosts.length && (
          <div className="mx-auto max-w-md rounded-2xl border border-green-200/70 bg-white/90 px-6 py-12 text-center shadow-sm">
            <p className="text-xl font-semibold text-gray-800">No blogs yet</p>
            <p className="mt-2 text-gray-600">
              Stay tuned for our latest updates and stories.
            </p>
          </div>
        )}

        {!loading && !error && blogPosts.length > 0 && (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-green-200/70 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block h-48 overflow-hidden"
                  >
                    <MediaImage
                      src={post.featured_image}
                      alt={post.featured_image_alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wide text-green-700">
                      {post.category?.name && <span>{post.category.name}</span>}
                      <time dateTime={post.published_at ?? post.created_at}>
                        {formatDate(post.published_at ?? post.created_at)}
                      </time>
                      {post.reading_time_minutes ? (
                        <span>{post.reading_time_minutes} min read</span>
                      ) : null}
                    </div>

                    <Link href={`/blog/${post.slug}`} className="mt-2 block">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-gray-900 transition-colors hover:text-green-700">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition-colors hover:text-green-800"
                    >
                      Read More
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {isHomeSection && (
              <div className="mt-12 text-center">
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-lg"
                >
                  View All Blogs
                  <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}

            {!isHomeSection && totalPosts > BLOG_PAGE_SIZE && (
              <div className="mt-12 flex flex-col items-center gap-6">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + BLOG_PAGE_SIZE, totalPosts)} of{" "}
                  {totalPosts} articles
                </p>

                <nav
                  className="flex flex-wrap items-center justify-center gap-2"
                  aria-label="Blog pagination"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-2 rounded-full border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
                  >
                    <FaChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>

                  {Array.from({ length: pageCount }).map((_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        aria-current={
                          currentPage === pageNumber ? "page" : undefined
                        }
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition",
                          currentPage === pageNumber
                            ? "bg-green-600 text-white shadow-sm"
                            : "border border-green-200 bg-white text-gray-600 hover:border-green-600 hover:text-green-700",
                        ].join(" ")}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(pageCount, page + 1))
                    }
                    disabled={currentPage >= pageCount}
                    className="inline-flex items-center gap-2 rounded-full border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
                  >
                    Next
                    <FaChevronRight className="h-3.5 w-3.5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </section>
  );
};

export default Blog;
