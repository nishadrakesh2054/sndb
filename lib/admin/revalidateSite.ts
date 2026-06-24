/** Ask Next.js to refresh cached public pages after dashboard edits. */
export async function revalidateSitePaths(paths: string[]) {
  const uniquePaths = [...new Set(paths.filter((path) => path.startsWith("/")))];
  if (uniquePaths.length === 0) return;

  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths: uniquePaths, layout: true }),
    });
  } catch {
    // Public pages still refresh via client-side Supabase fetches.
  }
}

export const publicPaths = {
  home: "/",
  about: "/about/history",
  aboutHistory: "/about/history",
  aboutRegistrations: "/about/registrations",
  aboutAffiliations: "/about/affiliations",
  aboutFoundersMessage: "/about/founders-message",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  notice: "/notice",
  noticePost: (slug: string) => `/notice/${slug}`,
  member: "/member",
  gallery: "/gallery",
  executiveCommittee: "/executive-committee",
  pastCommittee: "/past-committee",
  advisoryBoard: "/members/advisory-board",
  generalMembers: "/members/general-members",
} as const;

export async function revalidateHeroContent() {
  await revalidateSitePaths([publicPaths.home]);
}

export async function revalidateBlogContent(slug?: string) {
  await revalidateSitePaths([
    publicPaths.home,
    publicPaths.blog,
    ...(slug ? [publicPaths.blogPost(slug)] : []),
  ]);
}

export async function revalidateNoticeContent(slug?: string) {
  await revalidateSitePaths([
    publicPaths.home,
    publicPaths.notice,
    ...(slug ? [publicPaths.noticePost(slug)] : []),
  ]);
}

export async function revalidateMemberContent() {
  await revalidateSitePaths([publicPaths.home, publicPaths.member, publicPaths.about]);
}

export async function revalidateGalleryContent() {
  await revalidateSitePaths([publicPaths.gallery]);
}

export async function revalidateCommitteeContent() {
  await revalidateSitePaths([
    publicPaths.executiveCommittee,
    publicPaths.pastCommittee,
    publicPaths.advisoryBoard,
    publicPaths.generalMembers,
  ]);
}

export async function revalidateAboutContent() {
  await revalidateSitePaths([
    publicPaths.home,
    publicPaths.about,
    publicPaths.aboutHistory,
    publicPaths.aboutRegistrations,
    publicPaths.aboutAffiliations,
    publicPaths.aboutFoundersMessage,
    "/about",
  ]);
}
