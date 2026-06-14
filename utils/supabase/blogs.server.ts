import { createClient } from "@/utils/supabase/server";
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
  const supabase = await createClient();

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
