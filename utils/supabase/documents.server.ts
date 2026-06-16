import { createPublicServerClient } from "@/utils/supabase/public.server";
import type { Document } from "@/utils/supabase/documents";

export async function getDocumentsServer(): Promise<Document[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, file_path, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Document[];
}
