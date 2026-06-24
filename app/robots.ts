import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

const privatePaths = [
  "/dashboard",
  "/dashboard/",
  "/login",
  "/login/",
  "/api/",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...privatePaths],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [...privatePaths],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
