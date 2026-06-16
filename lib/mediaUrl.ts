/** Resolve upload paths to public URLs (local /public, Supabase storage, or full URL) */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  const normalized = path.replace(/\\/g, "/").trim();

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  if (normalized.startsWith("site-media/")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/${normalized}`;
    }
  }

  const legacyUpload = normalized.match(
    /^\/?uploads\/(profile|galleries|blog|notices|hero)\/image-\d+\.(.+)$/i
  );
  if (legacyUpload) {
    const folder = legacyUpload[1].toLowerCase();
    const fileName = legacyUpload[2];

    if (folder === "galleries") {
      return resolveLegacyGalleryFile(fileName);
    }

    if (folder === "hero") {
      return `/uploads/hero/${fileName}`;
    }

    return fileName.startsWith("/") ? fileName : `/${fileName}`;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function resolveLegacyGalleryFile(fileName: string): string {
  if (fileName === "hero1.jpg" || fileName === "hero2.jpg") {
    return `/uploads/hero/${fileName}`;
  }

  const heroMatch = fileName.match(/^hero(\d+)\.jpe?g$/i);
  if (heroMatch) {
    const index = parseInt(heroMatch[1], 10);
    if (index >= 1 && index <= 5) {
      return `/sndb${index}.jpg`;
    }
    return `/sndb${((index - 1) % 5) + 1}.jpg`;
  }

  return `/uploads/galleries/${fileName}`;
}
