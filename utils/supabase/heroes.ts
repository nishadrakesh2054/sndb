import { createClient } from "@/utils/supabase/client";

export type HeroSlide = {
  id: string;
  title: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const heroSelectWithOrder =
  "id, title, image, sort_order, created_at, updated_at";
const heroSelectBasic = "id, title, image, created_at, updated_at";

function isMissingSortOrderColumn(message: string): boolean {
  return /sort_order/i.test(message);
}

function withFallbackSortOrder(
  rows: Omit<HeroSlide, "sort_order">[]
): HeroSlide[] {
  return rows.map((row, index) => ({
    ...row,
    sort_order: index + 1,
  }));
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();

  const ordered = await supabase
    .from("hero_slides")
    .select(heroSelectWithOrder)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!ordered.error) {
    return (ordered.data ?? []) as HeroSlide[];
  }

  if (!isMissingSortOrderColumn(ordered.error.message)) {
    throw ordered.error;
  }

  const fallback = await supabase
    .from("hero_slides")
    .select(heroSelectBasic)
    .order("created_at", { ascending: true });

  if (fallback.error) throw fallback.error;
  return withFallbackSortOrder((fallback.data ?? []) as Omit<HeroSlide, "sort_order">[]);
}
