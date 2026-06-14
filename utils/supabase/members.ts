import { createClient } from "@/utils/supabase/client";

export type Member = {
  id: string;
  title: string;
  image: string;
  position: string;
  phone: number | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

function sortMembersByTitle(members: Member[]): Member[] {
  return [...members].sort((a, b) =>
    a.title.replace(/^dr\.?\s*/i, "").localeCompare(
      b.title.replace(/^dr\.?\s*/i, ""),
      undefined,
      { sensitivity: "base" }
    )
  );
}

export async function getAllMembers(): Promise<Member[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("members")
    .select("id, title, image, position, phone, email, created_at, updated_at");

  if (error) throw error;
  return sortMembersByTitle((data ?? []) as Member[]);
}

export async function getMemberCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}
