import { createClient } from "@/utils/supabase/client";

export type CommitteeLayout = "profile" | "simple";

export type CommitteeMember = {
  id: string;
  category_id: string;
  role_title: string;
  name: string;
  phone: number | null;
  email: string | null;
  photo: string | null;
  working_place: string | null;
  degree: string | null;
  specialist: string | null;
  address: string | null;
  sort_order: number;
};

export type CommitteeGroup = "current" | "past" | "advisory" | "general";

export type CommitteeCategory = {
  id: string;
  slug: string;
  label: string;
  heading: string;
  description: string | null;
  sort_order: number;
  layout: CommitteeLayout;
  committee_group: CommitteeGroup;
  members: CommitteeMember[];
};

const categorySelect = `
  id,
  slug,
  label,
  heading,
  description,
  sort_order,
  layout,
  committee_group
`;

const memberSelect = `
  id,
  category_id,
  role_title,
  name,
  phone,
  email,
  photo,
  working_place,
  degree,
  specialist,
  address,
  sort_order
`;

async function getCommitteeByGroup(
  group: CommitteeGroup
): Promise<CommitteeCategory[]> {
  const supabase = createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("committee_categories")
    .select(categorySelect)
    .eq("committee_group", group)
    .order("sort_order", { ascending: true });

  if (categoriesError) throw categoriesError;

  const categoryList = (categories ?? []) as Omit<
    CommitteeCategory,
    "members"
  >[];
  const categoryIds = categoryList.map((category) => category.id);

  if (categoryIds.length === 0) {
    return [];
  }

  const { data: members, error: membersError } = await supabase
    .from("committee_members")
    .select(memberSelect)
    .in("category_id", categoryIds)
    .order("sort_order", { ascending: true });

  if (membersError) throw membersError;

  const membersByCategory = new Map<string, CommitteeMember[]>();

  for (const member of (members ?? []) as CommitteeMember[]) {
    const list = membersByCategory.get(member.category_id) ?? [];
    list.push(member);
    membersByCategory.set(member.category_id, list);
  }

  return categoryList.map((category) => ({
    ...category,
    members: membersByCategory.get(category.id) ?? [],
  }));
}

export function getExecutiveCommittee(): Promise<CommitteeCategory[]> {
  return getCommitteeByGroup("current");
}

export function getPastCommittee(): Promise<CommitteeCategory[]> {
  return getCommitteeByGroup("past");
}

export function getAdvisoryBoard(): Promise<CommitteeCategory[]> {
  return getCommitteeByGroup("advisory");
}

export function getGeneralMembers(): Promise<CommitteeCategory[]> {
  return getCommitteeByGroup("general");
}

export function getCategoryDescription(category: CommitteeCategory): string | undefined {
  if (
    category.slug === "members" ||
    category.slug === "past-members" ||
    category.slug === "general-members"
  ) {
    return `${category.members.length} member${category.members.length === 1 ? "" : "s"}`;
  }

  if (category.slug === "advisory-board") {
    return `${category.members.length} advisory board member${category.members.length === 1 ? "" : "s"}`;
  }

  return category.description ?? undefined;
}
