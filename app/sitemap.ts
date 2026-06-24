import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import {
  getStaticSitemapConfig,
  staticRoutes,
} from "@/lib/sitemapConfig";
import { getPublishedBlogSitemapEntries } from "@/utils/supabase/blogs.server";
import { getPublishedNoticeSitemapEntries } from "@/utils/supabase/notices.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => {
    const config = getStaticSitemapConfig(path);

    return {
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    };
  });

  let blogEntries: MetadataRoute.Sitemap = [];
  let noticeEntries: MetadataRoute.Sitemap = [];

  try {
    const [blogs, notices] = await Promise.all([
      getPublishedBlogSitemapEntries(),
      getPublishedNoticeSitemapEntries(),
    ]);

    blogEntries = blogs.map((entry) => ({
      url: absoluteUrl(`/blog/${entry.slug}`),
      lastModified: entry.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    noticeEntries = notices.map((entry) => ({
      url: absoluteUrl(`/notice/${entry.slug}`),
      lastModified: entry.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sitemap still works with static routes if Supabase is unavailable.
  }

  return [...staticEntries, ...blogEntries, ...noticeEntries];
}
