export const membersNavItems = [
  {
    label: "Advisory Board Members",
    href: "/members/advisory-board",
  },
  {
    label: "Apply Membership",
    href: "/register-member",
  },
  {
    label: "General Members",
    href: "/members/general-members",
  },
  {
    label: "Life Members",
    href: "/member",
  },
] as const;

export const membersPaths = membersNavItems.map((item) => item.href);

export const isMembersPath = (pathname: string) =>
  pathname === "/member" ||
  membersPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
