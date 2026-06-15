import { createPublicServerClient } from "@/utils/supabase/public.server";
import type { HeroSlide } from "@/utils/supabase/heroes";

export async function getHeroSlidesServer(limit = 3): Promise<HeroSlide[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, title, image, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}
