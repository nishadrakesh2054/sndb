"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { getPublishedBlogs, type BlogPost } from "@/utils/supabase/blogs";
import { getMediaUrl } from "@/lib/mediaUrl";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";

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
        Latest Updates & <span className="text-green-600">Stories</span>
      </>
    }
    subtitle="Latest news and activities from our community."
  />
);

const Blog = ({ isHomeSection = false }: { isHomeSection?: boolean }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const posts = await getPublishedBlogs({
          limit: isHomeSection ? 4 : undefined,
        });
        if (!cancelled) {
          setBlogPosts(posts);
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
  }, [isHomeSection]);

  return (
    <PageSection>
      <PageContainer>
        <SectionHeader as={isHomeSection ? "h2" : "h1"} />

        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-emerald-100 bg-white"
              >
                <div className="h-48 animate-pulse bg-emerald-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-emerald-100" />
                  <div className="h-5 w-full animate-pulse rounded bg-emerald-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-emerald-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-white px-6 py-8 text-center">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !blogPosts.length && (
          <div className="mx-auto max-w-md rounded-lg border border-emerald-100 bg-white px-6 py-12 text-center shadow-sm">
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
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block overflow-hidden"
                  >
                    <img
                      src={getMediaUrl(post.featured_image)}
                      alt={post.featured_image_alt || post.title}
                      loading="lazy"
                      className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
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
                      className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition-colors hover:text-green-800"
                    >
                      Read More
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {isHomeSection && (
              <div className="mt-12 text-center">
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
                >
                  View All Articles
                  <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </PageSection>
  );
};

export default Blog;
