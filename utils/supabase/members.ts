import { createClient } from "@/utils/supabase/client";

export type Member = {
  id: string;
  title: string;
  image: string;
  position: string;
  phone: number | null;
  email: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getAllMembers(): Promise<Member[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("members")
    .select("id, title, image, position, phone, email, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Member[];
}

export async function getMemberCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}
