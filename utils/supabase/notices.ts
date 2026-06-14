import { createClient } from "@/utils/supabase/client";

export type Notice = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string;
  image_alt: string | null;
  show_in_popup: boolean;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
};

export const noticeSelect = `
  id,
  title,
  slug,
  excerpt,
  content,
  image_url,
  image_alt,
  show_in_popup,
  status,
  published_at,
  sort_order,
  meta_title,
  meta_description,
  meta_keywords,
  og_title,
  og_description,
  og_image,
  created_at,
  updated_at
`;

export function getNoticeSeoTitle(notice: Notice): string {
  return notice.meta_title?.trim() || notice.title;
}

export function getNoticeSeoDescription(notice: Notice): string {
  return (
    notice.meta_description?.trim() ||
    notice.excerpt?.trim() ||
    `Official notice from SNDB: ${notice.title}`
  );
}

export function getNoticeOgImage(notice: Notice): string | null {
  return notice.og_image?.trim() || notice.image_url || null;
}

export function getNoticeImageAlt(notice: Notice): string {
  return notice.image_alt?.trim() || notice.title;
}

export function getNoticeDisplayDate(notice: Notice): string {
  return notice.published_at ?? notice.created_at;
}

export async function getPublishedNotices(): Promise<Notice[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notices")
    .select(noticeSelect)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Notice[];
}

export async function getNoticeBySlug(slug: string): Promise<Notice | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notices")
    .select(noticeSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return (data as Notice | null) ?? null;
}

export async function getPublishedNoticeCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("notices")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  if (error) throw error;
  return count ?? 0;
}
