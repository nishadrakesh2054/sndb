"use client";

import { useEffect, useState } from "react";
import { getAllMembers, type Member } from "@/utils/supabase/members";
import { getMediaUrl } from "@/lib/mediaUrl";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";

const formatName = (name: string) =>
  name.replace(/^dr\.?\s*/i, "Dr. ").replace(/\s+/g, " ").trim();

const MemberCard: React.FC<{ member: Member; index: number }> = ({
  member,
  index,
}) => {
  const shapeOnRight = index % 2 === 0;
  const shapeVariant = index % 3;

  return (
    <article className="group relative flex min-h-[280px] flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white text-center shadow-sm transition hover:border-green-300 hover:shadow-lg sm:min-h-[300px]">
      <div
        className={`pointer-events-none absolute h-20 w-20 rounded-full bg-green-600/15 ${
          shapeOnRight ? "-right-3 top-8" : "-left-3 top-7"
        }`}
      />
      <div
        className={`pointer-events-none absolute h-6 w-6 rotate-45 rounded-sm border-2 border-green-600/35 bg-emerald-100 ${
          shapeOnRight ? "left-5 top-4" : "right-5 top-5"
        }`}
      />
      <div
        className={`pointer-events-none absolute h-4 w-4 rounded-full bg-green-600/25 ${
          shapeVariant === 0
            ? "bottom-8 left-6"
            : shapeVariant === 1
              ? "bottom-7 right-6"
              : "bottom-10 left-1/2 -translate-x-1/2"
        }`}
      />

      <div className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-100/90 to-emerald-50/50 px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
        <div
          className={`pointer-events-none absolute h-24 w-24 rounded-full border-2 border-green-600/30 bg-green-600/5 ${
            shapeOnRight ? "-left-12 bottom-2" : "-right-12 bottom-3"
          }`}
        />
        <div
          className={`pointer-events-none absolute h-8 w-8 rotate-12 rounded-sm border border-green-600/25 bg-white/70 ${
            shapeOnRight ? "right-6 top-6" : "left-6 top-7"
          }`}
        />

        <div className="relative z-10 mx-auto h-28 w-28 overflow-hidden rounded-full border-[3px] border-white bg-gray-50 shadow-md ring-2 ring-green-600/20 transition group-hover:ring-green-600/40 sm:h-32 sm:w-32">
          <img
            src={getMediaUrl(member.image)}
            loading="lazy"
            alt={member.title}
            className="h-full w-full object-cover object-top"
          />
        </div>

        <svg
          className="absolute bottom-0 left-0 z-0 w-full text-white"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,32 C360,48 720,16 1080,32 C1260,40 1380,36 1440,32 L1440,48 L0,48 Z"
          />
        </svg>
      </div>

      <div className="relative flex flex-1 flex-col items-center px-5 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5">
        <div
          className={`pointer-events-none absolute h-5 w-5 rotate-45 border-2 border-green-600/25 bg-green-600/10 ${
            shapeOnRight ? "bottom-6 left-7" : "bottom-7 right-7"
          }`}
        />

        <h3 className="text-base font-bold leading-snug text-gray-900 sm:text-lg">
          {formatName(member.title)}
        </h3>

        {member.position && (
          <p className="mt-1 text-sm font-medium uppercase leading-relaxed text-red-700 sm:text-base">
            {member.position}
          </p>
        )}
      </div>
    </article>
  );
};

const GridDecorations = () => (
  <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
    <div className="absolute left-[26%] top-[10%] h-5 w-5 rotate-45 rounded-sm bg-green-600/25" />
    <div className="absolute left-[51%] top-[11%] h-9 w-9 rounded-full border-[3px] border-green-600/30 bg-emerald-50/80" />
    <div className="absolute left-[77%] top-[8%] h-4 w-4 rounded-full bg-green-600/30" />
    <div className="absolute left-[39%] top-[47%] h-6 w-6 rotate-45 border-2 border-green-600/30 bg-emerald-100" />
    <div className="absolute left-[64%] top-[43%] h-5 w-5 rounded-full bg-green-600/25" />
    <div className="absolute left-[91%] top-[49%] h-6 w-6 rotate-45 rounded-sm bg-green-600/20" />
    <div className="absolute left-[27%] top-[80%] h-8 w-8 rounded-full border-[3px] border-green-600/30" />
    <div className="absolute left-[52%] top-[78%] h-5 w-5 rotate-45 bg-green-600/25" />
    <div className="absolute left-[78%] top-[84%] h-9 w-9 rounded-full border-2 border-green-600/30 bg-emerald-50/70" />
  </div>
);

const CardSkeleton = () => (
  <div className="relative flex min-h-[280px] flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:min-h-[300px]">
    <div className="pointer-events-none absolute -right-3 top-8 h-20 w-20 rounded-full bg-green-600/15" />
    <div className="w-full bg-emerald-50/50 px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
      <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-gray-200 sm:h-32 sm:w-32" />
    </div>
    <div className="mt-5 h-5 w-32 animate-pulse rounded bg-gray-200" />
    <div className="mt-4 h-4 w-24 animate-pulse rounded bg-gray-100" />
  </div>
);

const Member: React.FC<{ initialMembers?: Member[] }> = ({
  initialMembers = [],
}) => {
  const [profiles, setProfiles] = useState<Member[]>(initialMembers);
  const [loading, setLoading] = useState(initialMembers.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMembers.length > 0) {
      return;
    }

    let cancelled = false;

    const loadMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllMembers();
        if (!cancelled) {
          setProfiles(data);
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

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [initialMembers.length]);

  return (
    <>
      <PageSection>
        <PageContainer>
          <PageHeader
            label="Our Community"
            title={
              <>
                Life <span className="text-green-600">Members</span>
              </>
            }
            subtitle="Nepalese doctors who graduated from Bangladesh and are part of the SNDB professional network."
          />

          {loading && (
            <div className="relative">
              <GridDecorations />
              <div className="relative grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-4 md:gap-8">
                {[...Array(8)].map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && profiles.length === 0 && (
            <p className="text-center text-sm text-gray-600">
              No members listed yet.
            </p>
          )}

          {!loading && !error && profiles.length > 0 && (
            <div className="relative">
              <GridDecorations />
              <div className="relative grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-4 md:gap-8">
                {profiles.map((member, index) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </PageContainer>
      </PageSection>
    </>
  );
};

export default Member;
