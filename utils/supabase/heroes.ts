import { createClient } from "@/utils/supabase/client";

export type HeroSlide = {
  id: string;
  title: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const heroSelect = "id, title, image, sort_order, created_at, updated_at";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("hero_slides")
    .select(heroSelect)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}
