export const aboutNavItems = [
  { label: "History", href: "/about/history" },
  { label: "Registrations", href: "/about/registrations" },
  {
    label: "Affiliations with NMA",
    href: "/about/affiliations",
  },
  { label: "Founder's Message", href: "/about/founders-message" },
] as const;

export const aboutPaths = aboutNavItems.map((item) => item.href);

export const isAboutPath = (pathname: string) =>
  aboutPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
