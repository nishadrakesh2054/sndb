/** Resolve upload paths from static JSON to public URLs (e.g. /uploads/profile/...) */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  const normalized = path.replace(/\\/g, "/");
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
