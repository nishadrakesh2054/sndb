"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import {
  CommitteeGrid,
  CommitteeSectionSkeleton,
  StaticTile,
} from "@/components/CommitteeCards";
import {
  PageContainer,
  PageHeader,
  PageSection,
  PageSubsection,
} from "@/components/PageHeader";
import {
  getCategoryDescription,
  getExecutiveCommittee,
  type CommitteeCategory,
} from "@/utils/supabase/executiveCommittee";

const SectionBlock = ({
  label,
  heading,
  description,
  children,
}: {
  label: string;
  heading: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <PageSubsection label={label} heading={heading} description={description}>
    {children}
  </PageSubsection>
);

const ExecutiveCommittee: React.FC<{
  initialCategories?: CommitteeCategory[];
}> = ({ initialCategories = [] }) => {
  const [categories, setCategories] = useState<CommitteeCategory[]>(
    initialCategories
  );
  const [loading, setLoading] = useState(initialCategories.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCommittee = async () => {
      setError(null);

      try {
        const data = await getExecutiveCommittee();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load executive committee."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (initialCategories.length === 0) {
      setLoading(true);
    }

    loadCommittee();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCard = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <PageSection>
      <PageContainer>
        <PageHeader
          label="Committee"
          title={
            <>
              Executive <span className="text-green-600">Committee</span>
            </>
          }
          subtitle="Current SNDB leadership for the 2023–2025 term. Click a profile to expand details below."
        />

        {loading && (
          <div className="space-y-12">
            {[...Array(3)].map((_, index) => (
              <CommitteeSectionSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="text-center text-sm text-gray-600">
            No committee data available yet.
          </p>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="space-y-2">
            {categories.map((category) => (
              <SectionBlock
                key={category.id}
                label={category.label}
                heading={category.heading}
                description={getCategoryDescription(category)}
              >
                {category.layout === "simple" ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:mx-auto lg:max-w-3xl">
                    {category.members.map((member) => (
                      <StaticTile
                        key={member.id}
                        title={member.role_title}
                        name={member.name}
                      />
                    ))}
                  </div>
                ) : (
                  <CommitteeGrid
                    people={category.members}
                    expandedId={expandedId}
                    onToggle={toggleCard}
                  />
                )}
              </SectionBlock>
            ))}
          </div>
        )}

        <div className="mt-14 border-t border-gray-200 pt-10 text-center">
          <Link
            href="/past-committee"
            className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            Past Executive Committee
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </PageContainer>
    </PageSection>
  );
};

export default ExecutiveCommittee;
