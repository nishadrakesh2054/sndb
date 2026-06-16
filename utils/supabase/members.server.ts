import { createPublicServerClient } from "@/utils/supabase/public.server";
import type { Member } from "@/utils/supabase/members";

export async function getAllMembersServer(): Promise<Member[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("members")
    .select("id, title, image, position, phone, email, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Member[];
}
