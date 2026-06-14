import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/pages/About";
import Blog from "@/components/pages/Blog";
import Contact from "@/components/pages/Contact";
import {
  MissionVisionValues,
  WhyJoinSNDB,
} from "@/components/HomeSections";

export const metadata: Metadata = {
  title: "SNDB | Society of Nepal Doctors of Bangladesh",
  description:
    "Welcome to the Society for Nepalese Doctors from Bangladesh (SNDB). Discover our mission, meet our members, read our blogs, and learn about our contributions to healthcare in Nepal.",
  keywords: [
    "Nepalese doctors",
    "Bangladesh doctors",
    "SNDB",
    "healthcare in Nepal",
    "medical professionals",
  ],
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <MissionVisionValues />
      <WhyJoinSNDB />
      <Blog isHomeSection />
      <Contact isHomeSection />
    </>
  );
}
