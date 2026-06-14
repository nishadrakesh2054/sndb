/** Resolve upload paths to public URLs (local /uploads, Supabase storage, or full URL) */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  const normalized = path.replace(/\\/g, "/");
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  if (normalized.startsWith("site-media/")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/${normalized}`;
    }
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
