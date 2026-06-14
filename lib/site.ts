export const site = {
  name: "Society of Nepal Doctors of Bangladesh",
  shortName: "SNDB",
  legalName: "Society For Nepalese Doctors from Bangladesh (SNDB)",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://sndb.org.np",
  locale: "en_US",
  description:
    "Society for Nepalese Doctors from Bangladesh (SNDB) connects Nepalese doctors who trained in Bangladesh through professional networking, healthcare collaboration, and community service in Nepal.",
  defaultTitle:
    "SNDB | Society of Nepal Doctors of Bangladesh",
  defaultKeywords: [
    "SNDB",
    "Nepalese doctors",
    "Bangladesh medical graduates",
    "doctors in Nepal",
    "medical society Nepal",
    "healthcare Nepal",
    "Nepali doctors Bangladesh",
  ],
  defaultOgImage: "/sndblogo1.png",
  email: "sndbdoctors@gmail.com",
  phone: "+9779817073670",
  address: {
    locality: "Kathmandu",
    country: "Nepal",
  },
  social: {
    facebook:
      "https://www.facebook.com/share/PxQiCqxYdNR851RL/?mibextid=LQQJ4d",
    whatsapp: "https://wa.me/9779817073670",
    instagram: "https://www.instagram.com",
  },
} as const;

export const staticRoutes = [
  "/",
  "/about",
  "/executive-message",
  "/executive-comimttee",
  "/past-committee",
  "/member",
  "/register-member",
  "/blog",
  "/notice",
  "/gallery",
  "/contact",
] as const;
