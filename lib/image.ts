import { getMediaUrl } from "@/lib/mediaUrl";

export function getOptimizedImageSrc(path: string): string {
  return getMediaUrl(path);
}

function isSupabaseStorageUrl(url: string): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl) return false;
  return (
    url.startsWith(`${supabaseUrl}/storage/v1/object/public/`) ||
    url.includes(".supabase.co/storage/v1/object/public/")
  );
}

export function canOptimizeImage(path: string): boolean {
  const url = getOptimizedImageSrc(path);
  if (!url) return false;
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  return isSupabaseStorageUrl(url);
}
