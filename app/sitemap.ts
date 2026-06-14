import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { site, staticRoutes } from "@/lib/site";
import { getPublishedBlogSlugs } from "@/utils/supabase/blogs.server";
import { getPublishedNoticeSlugs } from "@/utils/supabase/notices.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  let noticeEntries: MetadataRoute.Sitemap = [];

  try {
    const [blogSlugs, noticeSlugs] = await Promise.all([
      getPublishedBlogSlugs(),
      getPublishedNoticeSlugs(),
    ]);

    blogEntries = blogSlugs.map((slug) => ({
      url: absoluteUrl(`/blog/${slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    noticeEntries = noticeSlugs.map((slug) => ({
      url: absoluteUrl(`/notice/${slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Sitemap still works with static routes if Supabase is unavailable.
  }

  return [...staticEntries, ...blogEntries, ...noticeEntries];
}
