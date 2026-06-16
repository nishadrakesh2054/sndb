import { cache } from "react";
import { createPublicServerClient } from "@/utils/supabase/public.server";
import { noticeSelect, type Notice } from "@/utils/supabase/notices";

export async function getPublishedNoticesServer(): Promise<Notice[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("notices")
    .select(noticeSelect)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Notice[];
}

export const getNoticeBySlugServer = cache(
  async (slug: string): Promise<Notice | null> => {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("notices")
    .select(noticeSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return (data as Notice | null) ?? null;
  }
);

export async function getPublishedNoticeSlugs(): Promise<string[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("notices")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedNoticeSitemapEntries(): Promise<
  Array<{ slug: string; lastModified: Date }>
> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("notices")
    .select("slug, updated_at, published_at")
    .eq("status", "published");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    slug: row.slug,
    lastModified: new Date(row.updated_at ?? row.published_at ?? Date.now()),
  }));
}
