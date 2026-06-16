import { createPublicServerClient } from "@/utils/supabase/public.server";
import {
  blogSelect,
  type BlogPost,
} from "@/utils/supabase/blogs";

type BlogRow = Omit<BlogPost, "category"> & {
  category: BlogPost["category"] | NonNullable<BlogPost["category"]>[] | null;
};

function normalizeBlog(row: BlogRow): BlogPost {
  const category = Array.isArray(row.category)
    ? row.category[0] ?? null
    : row.category;

  return { ...row, category };
}

export async function getBlogBySlugServer(slug: string): Promise<BlogPost | null> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("blogs")
    .select(blogSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeBlog(data as BlogRow) : null;
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedBlogsServer(
  options: { limit?: number; page?: number; pageSize?: number } = {}
) {
  const { limit, page = 1, pageSize } = options;
  const supabase = createPublicServerClient();

  let query = supabase
    .from("blogs")
    .select(blogSelect, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (pageSize) {
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
  } else if (limit) {
    query = query.limit(limit);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    posts: ((data ?? []) as BlogRow[]).map(normalizeBlog),
    total: count ?? 0,
  };
}
