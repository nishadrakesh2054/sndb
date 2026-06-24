import { createClient } from "@/utils/supabase/client";

export type NoticePopup = {
  id: string;
  image: string;
  link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getActiveNoticePopup(): Promise<NoticePopup | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notice_popups")
    .select("id, image, link, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as NoticePopup | null) ?? null;
}
