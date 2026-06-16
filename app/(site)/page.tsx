import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { createHomeMetadata } from "@/lib/seo";
import { getPublishedBlogsServer } from "@/utils/supabase/blogs.server";
import { getHeroSlidesServer } from "@/utils/supabase/heroes.server";

const About = dynamic(() => import("@/components/pages/About"));
const Blog = dynamic(() => import("@/components/pages/Blog"));
const Contact = dynamic(() => import("@/components/pages/Contact"));
const MissionVisionValues = dynamic(() =>
  import("@/components/HomeSections").then((mod) => ({
    default: mod.MissionVisionValues,
  }))
);
const WhyJoinSNDB = dynamic(() =>
  import("@/components/HomeSections").then((mod) => ({
    default: mod.WhyJoinSNDB,
  }))
);

export const metadata: Metadata = createHomeMetadata();

export default async function HomePage() {
  const [heroSlides, homeBlogs] = await Promise.all([
    getHeroSlidesServer(3).catch(() => []),
    getPublishedBlogsServer({ limit: 3 }).catch(() => ({
      posts: [],
      total: 0,
    })),
  ]);

  return (
    <>
      <Hero initialSlides={heroSlides} />
      <About />
      <MissionVisionValues />
      <WhyJoinSNDB />
      <Blog
        isHomeSection
        initialPosts={homeBlogs.posts}
        initialTotal={homeBlogs.total}
      />
      <Contact isHomeSection />
    </>
  );
}
