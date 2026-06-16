"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaChevronDown,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStethoscope,
  FaHospital,
} from "react-icons/fa";

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
  type CommitteeMember,
} from "@/utils/supabase/executiveCommittee";
import { getMediaUrl } from "@/lib/mediaUrl";

const formatName = (name: string) =>
  name.replace(/^dr\.?\s*/i, "Dr. ").replace(/\s+/g, " ").trim();

const displayTitle = (title: string) =>
  title === "Members" ? "Member" : title;

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

const CommitteeCard = ({
  person,
  isExpanded,
  onToggle,
}: {
  person: CommitteeMember;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <article
    className={`self-start overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
      isExpanded
        ? "border-green-300 shadow-md ring-1 ring-green-600/10"
        : "border-gray-200 hover:border-green-200 hover:shadow-md"
    }`}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      className="flex w-full flex-col text-center focus:outline-none focus:ring-2 focus:ring-green-600/25 focus:ring-offset-2"
    >
      <div className="bg-emerald-50/60 px-4 py-3">
        <p className="line-clamp-2 text-xs font-medium uppercase tracking-wide text-green-700">
          {displayTitle(person.role_title)}
        </p>
      </div>

      <div className="flex flex-col items-center px-4 py-6">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-gray-50 shadow-md ring-2 ring-green-600/15 sm:h-28 sm:w-28">
          <img
            src={getMediaUrl(person.photo ?? "")}
            loading="lazy"
            alt={person.name}
            className="h-full w-full object-cover object-top"
          />
        </div>
        <p className="mt-4 text-sm font-semibold leading-snug text-gray-900 sm:text-base">
          {formatName(person.name)}
        </p>
        {person.specialist && (
          <p className="mt-1 text-xs text-gray-500">
            {person.specialist.trim()}
          </p>
        )}
        <FaChevronDown
          className={`mt-4 h-3.5 w-3.5 text-green-600 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>

    {isExpanded && (
      <div className="space-y-3 border-t border-gray-100 bg-gray-50/80 px-4 py-4 text-left sm:px-5">
        {person.phone != null && (
          <DetailItem
            icon={FaPhoneAlt}
            label="Phone"
            value={String(person.phone)}
            href={`tel:${person.phone}`}
          />
        )}
        {person.email && (
          <DetailItem
            icon={FaEnvelope}
            label="Email"
            value={person.email}
            href={`mailto:${person.email}`}
          />
        )}
        {person.working_place && (
          <DetailItem
            icon={FaHospital}
            label="Working Place"
            value={person.working_place}
          />
        )}
        {person.degree && (
          <DetailItem
            icon={FaGraduationCap}
            label="Degree"
            value={person.degree}
          />
        )}
        {person.specialist && (
          <DetailItem
            icon={FaStethoscope}
            label="Specialist"
            value={person.specialist.trim()}
          />
        )}
        {person.address && (
          <DetailItem
            icon={FaMapMarkerAlt}
            label="Address"
            value={person.address}
          />
        )}
      </div>
    )}
  </article>
);

const CommitteeGrid = ({
  people,
  expandedId,
  onToggle,
}: {
  people: CommitteeMember[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) => (
  <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
    {people.map((person) => (
      <CommitteeCard
        key={person.id}
        person={person}
        isExpanded={expandedId === person.id}
        onToggle={() => onToggle(person.id)}
      />
    ))}
  </div>
);

const DetailItem = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex gap-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {href ? (
        <a
          href={href}
          className="mt-0.5 block break-words text-sm font-medium text-green-700 hover:text-green-800"
        >
          {value}
        </a>
      ) : (
        <p className="mt-0.5 break-words text-sm font-medium text-gray-900">
          {value}
        </p>
      )}
    </div>
  </div>
);

const StaticTile = ({ title, name }: { title: string; name: string }) => (
  <article className="flex min-h-[7.5rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="bg-emerald-50/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-green-700">
        {title}
      </p>
    </div>
    <div className="flex flex-1 items-center justify-center px-4 py-4 text-center">
      <p className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">
        {name}
      </p>
    </div>
  </article>
);

const SectionSkeleton = () => (
  <div className="space-y-6">
    <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-white"
        />
      ))}
    </div>
  </div>
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
    if (initialCategories.length > 0) {
      return;
    }

    let cancelled = false;

    const loadCommittee = async () => {
      setLoading(true);
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

    loadCommittee();

    return () => {
      cancelled = true;
    };
  }, [initialCategories.length]);

  const toggleCard = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <>
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
                <SectionSkeleton key={index} />
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
    </>
  );
};

export default ExecutiveCommittee;
