import { createClient } from "@/utils/supabase/client";
import {
  type GalleryImage,
  type GalleryImageRow,
  galleryImageSelect,
  getGalleryImageAlt,
  normalizeGalleryImage,
} from "@/utils/supabase/gallery.shared";

export type { GalleryAlbum, GalleryImage } from "@/utils/supabase/gallery.shared";
export { getGalleryImageAlt };

export async function getPublishedGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .select(galleryImageSelect)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as GalleryImageRow[]).map(normalizeGalleryImage);
}

export async function getPublishedGalleryCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("gallery_images")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  if (error) throw error;
  return count ?? 0;
}
