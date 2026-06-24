"use client";

import CommitteeGroupPage from "@/components/pages/CommitteeGroupPage";
import { getAdvisoryBoard } from "@/utils/supabase/executiveCommittee";
import type { CommitteeCategory } from "@/utils/supabase/executiveCommittee";

const AdvisoryBoardPage = ({
  initialCategories = [],
}: {
  initialCategories?: CommitteeCategory[];
}) => (
  <CommitteeGroupPage
    label="Members"
    title={
      <>
        Advisory Board <span className="text-green-600">Members</span>
      </>
    }
    subtitle="SNDB advisory board members. Click a profile to view contact and professional details."
    initialCategories={initialCategories}
    loadCategories={getAdvisoryBoard}
    footerLink={{
      href: "/register-member",
      label: "Apply for Membership",
    }}
  />
);

export default AdvisoryBoardPage;
