"use client";

import CommitteeGroupPage from "@/components/pages/CommitteeGroupPage";
import { getGeneralMembers } from "@/utils/supabase/executiveCommittee";
import type { CommitteeCategory } from "@/utils/supabase/executiveCommittee";

const GeneralMembersPage = ({
  initialCategories = [],
}: {
  initialCategories?: CommitteeCategory[];
}) => (
  <CommitteeGroupPage
    label="Members"
    title={
      <>
        General <span className="text-green-600">Members</span>
      </>
    }
    subtitle="SNDB general members. Click a profile to view contact and professional details."
    initialCategories={initialCategories}
    loadCategories={getGeneralMembers}
    footerLink={{
      href: "/register-member",
      label: "Apply for Membership",
    }}
  />
);

export default GeneralMembersPage;
