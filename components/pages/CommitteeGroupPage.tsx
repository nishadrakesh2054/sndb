"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import {
  CommitteeGrid,
  CommitteeSectionSkeleton,
} from "@/components/CommitteeCards";
import {
  PageContainer,
  PageHeader,
  PageSection,
  PageSubsection,
} from "@/components/PageHeader";
import {
  getCategoryDescription,
  type CommitteeCategory,
} from "@/utils/supabase/executiveCommittee";

type CommitteeGroupPageProps = {
  label: string;
  title: ReactNode;
  subtitle: string;
  initialCategories?: CommitteeCategory[];
  loadCategories: () => Promise<CommitteeCategory[]>;
  footerLink?: {
    href: string;
    label: string;
  };
};

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

const CommitteeGroupPage = ({
  label,
  title,
  subtitle,
  initialCategories = [],
  loadCategories,
  footerLink,
}: CommitteeGroupPageProps) => {
  const [categories, setCategories] = useState<CommitteeCategory[]>(
    initialCategories
  );
  const [loading, setLoading] = useState(initialCategories.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError(null);

      try {
        const data = await loadCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load members."
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

    load();

    return () => {
      cancelled = true;
    };
  }, [initialCategories.length]);

  const toggleCard = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <PageSection>
      <PageContainer>
        <PageHeader label={label} title={title} subtitle={subtitle} />

        {loading && (
          <div className="space-y-12">
            {[...Array(2)].map((_, index) => (
              <CommitteeSectionSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="text-center text-sm text-gray-600">
            No members listed yet.
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
                <CommitteeGrid
                  people={category.members}
                  expandedId={expandedId}
                  onToggle={toggleCard}
                />
              </SectionBlock>
            ))}
          </div>
        )}

        {footerLink ? (
          <div className="mt-14 border-t border-gray-200 pt-10 text-center">
            <Link
              href={footerLink.href}
              className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              {footerLink.label}
              <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ) : null}
      </PageContainer>
    </PageSection>
  );
};

export default CommitteeGroupPage;
