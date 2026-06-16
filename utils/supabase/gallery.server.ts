import { createPublicServerClient } from "@/utils/supabase/public.server";
import {
  type GalleryImage,
  type GalleryImageRow,
  galleryImageSelect,
  normalizeGalleryImage,
} from "@/utils/supabase/gallery.shared";

export async function getPublishedGalleryImagesServer(): Promise<GalleryImage[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .select(galleryImageSelect)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as GalleryImageRow[]).map(normalizeGalleryImage);
}
