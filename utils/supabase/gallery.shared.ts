export type GalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  cover_image: string | null;
  status: "draft" | "published" | "archived";
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  album_id: string | null;
  title: string | null;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  album: Pick<GalleryAlbum, "id" | "title" | "slug"> | null;
};

export const galleryImageSelect = `
  id,
  album_id,
  title,
  image_url,
  alt_text,
  caption,
  sort_order,
  status,
  published_at,
  created_at,
  updated_at,
  album:gallery_albums (
    id,
    title,
    slug
  )
`;

export type GalleryImageRow = Omit<GalleryImage, "album"> & {
  album: GalleryImage["album"] | NonNullable<GalleryImage["album"]>[] | null;
};

export function normalizeGalleryImage(row: GalleryImageRow): GalleryImage {
  const album = Array.isArray(row.album) ? row.album[0] ?? null : row.album;
  return { ...row, album };
}

export function getGalleryImageAlt(image: GalleryImage, index: number): string {
  return (
    image.alt_text?.trim() ||
    image.title?.trim() ||
    image.album?.title ||
    `Gallery photo ${index + 1}`
  );
}
