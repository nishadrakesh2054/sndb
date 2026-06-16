import { createPublicServerClient } from "@/utils/supabase/public.server";
import type { Faq } from "@/utils/supabase/faqs";

export async function getActiveFaqsServer(): Promise<Faq[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Faq[];
}
