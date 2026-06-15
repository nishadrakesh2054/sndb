import { createClient } from "@/utils/supabase/client";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getActiveFaqs(): Promise<Faq[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Faq[];
}
