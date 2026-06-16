import { createPublicServerClient } from "@/utils/supabase/public.server";
import type { HeroSlide } from "@/utils/supabase/heroes";

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

export async function getHeroSlidesServer(): Promise<HeroSlide[]> {
  const supabase = createPublicServerClient();

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
