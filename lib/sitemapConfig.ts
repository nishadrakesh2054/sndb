import type { MetadataRoute } from "next";
import { aboutNavItems } from "@/lib/aboutNav";
import { membersNavItems } from "@/lib/membersNav";

/** Public indexable routes — kept in sync with site navigation. */
export const staticRoutes = [
  "/",
  ...aboutNavItems.map((item) => item.href),
  "/executive-message",
  "/executive-committee",
  "/past-committee",
  ...membersNavItems.map((item) => item.href),
  "/blog",
  "/notice",
  "/gallery",
  "/contact",
] as const;

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

type RouteSitemapConfig = {
  changeFrequency: ChangeFrequency;
  priority: number;
};

const defaultRouteConfig: RouteSitemapConfig = {
  changeFrequency: "monthly",
  priority: 0.8,
};

const routeSitemapConfig: Partial<Record<(typeof staticRoutes)[number], RouteSitemapConfig>> =
  {
    "/": { changeFrequency: "weekly", priority: 1 },
    "/about/history": { changeFrequency: "monthly", priority: 0.9 },
    "/register-member": { changeFrequency: "monthly", priority: 0.9 },
    "/contact": { changeFrequency: "monthly", priority: 0.9 },
    "/blog": { changeFrequency: "weekly", priority: 0.85 },
    "/notice": { changeFrequency: "weekly", priority: 0.85 },
    "/executive-committee": { changeFrequency: "monthly", priority: 0.8 },
    "/past-committee": { changeFrequency: "yearly", priority: 0.7 },
    "/members/advisory-board": { changeFrequency: "monthly", priority: 0.8 },
    "/members/general-members": { changeFrequency: "monthly", priority: 0.8 },
    "/member": { changeFrequency: "monthly", priority: 0.8 },
  };

export function getStaticSitemapConfig(path: (typeof staticRoutes)[number]) {
  return routeSitemapConfig[path] ?? defaultRouteConfig;
}
