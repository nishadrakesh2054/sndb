export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type AdminNavItem = {
  href: string;
  label: string;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: "",
    items: [{ href: "/dashboard", label: "Overview" }],
  },
  {
    title: "Homepage",
    items: [
      { href: "/dashboard/hero-slides", label: "Hero Slides" },
      { href: "/dashboard/notice-popup", label: "Notice Popup" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/dashboard/blogs", label: "Blogs" },
      { href: "/dashboard/notices", label: "Notices" },
      { href: "/dashboard/gallery", label: "Gallery" },
      { href: "/dashboard/documents", label: "Documents" },
    ],
  },
  {
    title: "People",
    items: [
      { href: "/dashboard/members", label: "Life Members" },
      { href: "/dashboard/committee", label: "Executive Committee" },
    ],
  },
  {
    title: "Submissions",
    items: [
      { href: "/dashboard/contact", label: "Contact Messages" },
      { href: "/dashboard/applications", label: "Membership Applications" },
    ],
  },
];

export const adminNav = adminNavGroups.flatMap((group) => group.items);

export const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20";

export const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export const btnPrimaryClass =
  "inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60";

export const btnSecondaryClass =
  "inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50";

export const btnDangerClass =
  "inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-100";

export const btnIconClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700";

export const btnIconDangerClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50";
