import { createPublicServerClient } from "@/utils/supabase/public.server";
import type { NoticePopup } from "@/utils/supabase/noticePopup";

export async function getActiveNoticePopupServer(): Promise<NoticePopup | null> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("notice_popups")
    .select("id, image, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as NoticePopup | null) ?? null;
}
