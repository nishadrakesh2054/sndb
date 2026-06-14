import { createClient } from "@/utils/supabase/client";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type BlogPost = {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_alt: string | null;
  author_name: string;
  author_title: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  reading_time_minutes: number | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  category: BlogCategory | null;
};

export const blogSelect = `
  id,
  category_id,
  title,
  slug,
  excerpt,
  content,
  featured_image,
  featured_image_alt,
  author_name,
  author_title,
  status,
  published_at,
  reading_time_minutes,
  tags,
  meta_title,
  meta_description,
  meta_keywords,
  og_title,
  og_description,
  og_image,
  canonical_url,
  created_at,
  updated_at,
  category:blog_categories (
    id,
    name,
    slug,
    description
  )
`;

export function getBlogSeoTitle(blog: BlogPost): string {
  return blog.meta_title?.trim() || blog.title;
}

export function getBlogSeoDescription(blog: BlogPost): string {
  return blog.meta_description?.trim() || blog.excerpt;
}

export function getBlogOgImage(blog: BlogPost): string | null {
  return blog.og_image?.trim() || blog.featured_image || null;
}

type BlogRow = Omit<BlogPost, "category"> & {
  category: BlogCategory | BlogCategory[] | null;
};

function normalizeBlog(row: BlogRow): BlogPost {
  const category = Array.isArray(row.category)
    ? row.category[0] ?? null
    : row.category;

  return { ...row, category };
}

export async function getPublishedBlogs(options: { limit?: number } = {}) {
  const supabase = createClient();
  const { limit } = options;

  let query = supabase
    .from("blogs")
    .select(blogSelect)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as BlogRow[]).map(normalizeBlog);
}

export async function getBlogBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select(blogSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeBlog(data as BlogRow) : null;
}

export async function getPublishedBlogCount() {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("blogs")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  if (error) throw error;
  return count ?? 0;
}
