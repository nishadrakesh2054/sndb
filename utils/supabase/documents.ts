import { createClient } from "@/utils/supabase/client";

export type Document = {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
  updated_at: string;
};

export async function getDocuments(): Promise<Document[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, file_path, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Document[];
}
