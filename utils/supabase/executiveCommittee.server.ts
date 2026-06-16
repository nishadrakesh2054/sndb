import { createPublicServerClient } from "@/utils/supabase/public.server";
import type {
  CommitteeCategory,
  CommitteeGroup,
  CommitteeMember,
} from "@/utils/supabase/executiveCommittee";

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

async function getCommitteeByGroupServer(
  group: CommitteeGroup
): Promise<CommitteeCategory[]> {
  const supabase = createPublicServerClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("committee_categories")
    .select(categorySelect)
    .eq("committee_group", group)
    .order("sort_order", { ascending: true });

  if (categoriesError) throw categoriesError;

  const categoryList = (categories ?? []) as Omit<CommitteeCategory, "members">[];
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

export function getExecutiveCommitteeServer(): Promise<CommitteeCategory[]> {
  return getCommitteeByGroupServer("current");
}

export function getPastCommitteeServer(): Promise<CommitteeCategory[]> {
  return getCommitteeByGroupServer("past");
}
