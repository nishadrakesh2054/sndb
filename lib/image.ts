import { getMediaUrl } from "@/lib/mediaUrl";

export function getOptimizedImageSrc(path: string): string {
  return getMediaUrl(path);
}

export function canOptimizeImage(path: string): boolean {
  const url = getMediaUrl(path);
  if (!url) return false;
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.pathname.includes("/storage/v1/object/public/");
  } catch {
    return false;
  }
}
