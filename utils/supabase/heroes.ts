import { createClient } from "@/utils/supabase/client";

export type HeroSlide = {
  id: string;
  title: string;
  image: string;
  created_at: string;
  updated_at: string;
};

export async function getHeroSlides(limit = 3): Promise<HeroSlide[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, title, image, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}
