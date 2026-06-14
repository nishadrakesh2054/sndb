import { createClient } from "@/utils/supabase/server";
import { noticeSelect, type Notice } from "@/utils/supabase/notices";

export async function getNoticeBySlugServer(
  slug: string
): Promise<Notice | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notices")
    .select(noticeSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return (data as Notice | null) ?? null;
}

export async function getPublishedNoticeSlugs(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notices")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
