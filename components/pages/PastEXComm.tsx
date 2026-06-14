"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  PageSection,
  PageSubsection,
} from "@/components/PageHeader";
import {
  getCategoryDescription,
  getPastCommittee,
  type CommitteeCategory,
  type CommitteeMember,
} from "@/utils/supabase/executiveCommittee";

const formatName = (name: string) =>
  name.replace(/^dr\.?\s*/i, "Dr. ").replace(/\s+/g, " ").trim();

const displayRoleTitle = (title: string) =>
  title === "Member" ? "Member" : title;

const SectionBlock = ({
  label,
  heading,
  description,
  children,
}: {
  label: string;
  heading: string;
  description?: string;
  children: ReactNode;
}) => (
  <PageSubsection label={label} heading={heading} description={description}>
    {children}
  </PageSubsection>
);

const PersonTile = ({ roleTitle, name }: { roleTitle: string; name: string }) => (
  <article className="flex min-h-[7.5rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-green-200 hover:shadow-md">
    <div className="bg-emerald-50/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-green-700">
        {displayRoleTitle(roleTitle)}
      </p>
    </div>
    <div className="flex flex-1 items-center justify-center px-4 py-4 text-center">
      <p className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">
        {formatName(name)}
      </p>
    </div>
  </article>
);

const tileGrid =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6";

const SectionSkeleton = () => (
  <div className="space-y-6">
    <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
    <div className={tileGrid}>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-white"
        />
      ))}
    </div>
  </div>
);

const PastEXComm: React.FC = () => {
  const [categories, setCategories] = useState<CommitteeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCommittee = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPastCommittee();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load past executive committee."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCommittee();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderMembers = (members: CommitteeMember[], compact = false) => {
    const gridClass = compact
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:mx-auto lg:max-w-3xl"
      : tileGrid;

    return (
      <div className={gridClass}>
        {members.map((member) => (
          <PersonTile
            key={member.id}
            roleTitle={member.role_title}
            name={member.name}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <PageSection>
        <PageContainer>
          <PageHeader
            label="Committee"
            title={
              <>
                Past Executive <span className="text-green-600">Committee</span>
              </>
            }
            subtitle="SNDB executive committee for the 2021–2022 term."
          />

          {loading && (
            <div className="space-y-12">
              {[...Array(4)].map((_, index) => (
                <SectionSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && categories.length === 0 && (
            <p className="text-center text-sm text-gray-600">
              No past committee data available yet.
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
                  {renderMembers(
                    category.members,
                    category.slug === "past-special-roles"
                  )}
                </SectionBlock>
              ))}
            </div>
          )}

          <div className="mt-14 border-t border-gray-200 pt-10 text-center">
            <Link
              href="/executive-comimttee"
              className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              Current Executive Committee
              <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
};

export default PastEXComm;
