import { getMediaUrl } from "@/lib/mediaUrl";

export function getOptimizedImageSrc(path: string): string {
  return getMediaUrl(path);
}

export function canOptimizeImage(path: string): boolean {
  const url = getMediaUrl(path);
  if (!url) return false;
  // Only use next/image for static files in /public (avoids Vercel remote config errors).
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  return false;
}
