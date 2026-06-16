import { createPublicServerClient } from "@/utils/supabase/public.server";
import type { HeroSlide } from "@/utils/supabase/heroes";

const heroSelect = "id, title, image, sort_order, created_at, updated_at";

export async function getHeroSlidesServer(): Promise<HeroSlide[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("hero_slides")
    .select(heroSelect)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}
