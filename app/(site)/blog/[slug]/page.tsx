import type { Metadata } from "next";
import BlogDetails from "@/components/pages/BlogDetails";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  createArticleMetadata,
} from "@/lib/seo";
import {
  getBlogOgImage,
  getBlogSeoDescription,
  getBlogSeoTitle,
} from "@/utils/supabase/blogs";
import {
  getBlogBySlugServer,
  getPublishedBlogSlugs,
} from "@/utils/supabase/blogs.server";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlugServer(slug);

  if (!blog) {
    return createArticleMetadata({
      title: "Blog Article",
      description: "Read articles and updates from SNDB.",
      path: `/blog/${slug}`,
    });
  }

  return createArticleMetadata({
    title: getBlogSeoTitle(blog),
    description: getBlogSeoDescription(blog),
    path: `/blog/${blog.slug}`,
    image: getBlogOgImage(blog),
    imageAlt: blog.featured_image_alt ?? blog.title,
    keywords: blog.meta_keywords?.length ? blog.meta_keywords : blog.tags ?? undefined,
    publishedTime: blog.published_at ?? blog.created_at,
    modifiedTime: blog.updated_at,
    authors: [blog.author_name],
    canonicalUrl: blog.canonical_url,
    ogTitle: blog.og_title,
    ogDescription: blog.og_description,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlugServer(slug);

  return (
    <>
      {blog ? (
        <JsonLd
          data={[
            buildBreadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: blog.title, path: `/blog/${blog.slug}` },
            ]),
            buildArticleJsonLd({
              title: getBlogSeoTitle(blog),
              description: getBlogSeoDescription(blog),
              path: `/blog/${blog.slug}`,
              image: getBlogOgImage(blog),
              publishedTime: blog.published_at ?? blog.created_at,
              modifiedTime: blog.updated_at,
              authorName: blog.author_name,
            }),
          ]}
        />
      ) : null}
      <BlogDetails slug={slug} initialBlog={blog} />
    </>
  );
}
