import { createPublicServerClient } from "@/utils/supabase/public.server";

export async function getSiteStatsServer() {
  const supabase = createPublicServerClient();

  const [members, blogs, notices] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase
      .from("blogs")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("notices")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  return {
    memberCount: members.count ?? 0,
    blogCount: blogs.count ?? 0,
    noticeCount: notices.count ?? 0,
  };
}
