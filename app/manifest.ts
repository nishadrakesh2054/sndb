import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    lang: "en",
    icons: [
      {
        src: site.defaultOgImage,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
