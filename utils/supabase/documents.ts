import { createClient } from "@/utils/supabase/client";

export type Document = {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
  updated_at: string;
};

export type DocumentFileKind = "pdf" | "image" | "other";

export function getDocumentFileKind(filePath: string): DocumentFileKind {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();
  const withoutQuery = normalized.split(/[?#]/)[0];
  const ext = withoutQuery.split(".").pop() ?? "";

  if (ext === "pdf" || withoutQuery.endsWith(".pdf")) return "pdf";
  if (
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"].includes(ext) ||
    /\.(jpe?g|png|gif|webp|bmp|svg|avif)$/.test(withoutQuery)
  ) {
    return "image";
  }

  return "other";
}

export function isDocumentPdf(filePath: string): boolean {
  return getDocumentFileKind(filePath) === "pdf";
}

export function isDocumentImage(filePath: string): boolean {
  return getDocumentFileKind(filePath) === "image";
}

export async function getDocuments(): Promise<Document[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, file_path, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Document[];
}
