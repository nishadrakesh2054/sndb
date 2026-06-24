"use client";

import { useState } from "react";
import {
  FaChevronDown,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStethoscope,
  FaHospital,
  FaUser,
} from "react-icons/fa";
import { getMediaUrl } from "@/lib/mediaUrl";
import type { CommitteeMember } from "@/utils/supabase/executiveCommittee";

export const EMPTY_VALUE = "----";

export const formatName = (name: string) =>
  name.replace(/^dr\.?\s*/i, "Dr. ").replace(/\s+/g, " ").trim();

export const displayTitle = (title: string) =>
  title === "Members" ? "Member" : title;

export const formatDisplayValue = (
  value: string | number | null | undefined
) => {
  if (value == null || String(value).trim() === "") {
    return EMPTY_VALUE;
  }

  return String(value).trim();
};

const CommitteeMemberPhoto = ({
  photo,
  name,
}: {
  photo: string | null;
  name: string;
}) => {
  const [failed, setFailed] = useState(false);
  const url = getMediaUrl(photo ?? "");
  const showFallback = !photo?.trim() || !url || failed;

  if (showFallback) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
        <FaUser className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />
        <span className="sr-only">No photo available</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      loading="lazy"
      alt={name || "Committee member"}
      className="h-full w-full object-cover object-top"
      onError={() => setFailed(true)}
    />
  );
};

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
}) => {
  const displayValue = formatDisplayValue(value);
  const hasLink = Boolean(href) && displayValue !== EMPTY_VALUE;

  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {hasLink ? (
          <a
            href={href}
            className="mt-0.5 block break-words text-sm font-medium text-green-700 hover:text-green-800"
          >
            {displayValue}
          </a>
        ) : (
          <p
            className={[
              "mt-0.5 break-words text-sm font-medium",
              displayValue === EMPTY_VALUE ? "text-gray-400" : "text-gray-900",
            ].join(" ")}
          >
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
};

export const CommitteeCard = ({
  person,
  isExpanded,
  onToggle,
}: {
  person: CommitteeMember;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const displayName = person.name?.trim()
    ? formatName(person.name)
    : EMPTY_VALUE;

  return (
    <article
      className={[
        "self-start overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        isExpanded
          ? "border-green-300 shadow-md ring-1 ring-green-600/10"
          : "border-gray-200 hover:border-green-200 hover:shadow-md",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full flex-col text-center focus:outline-none focus:ring-2 focus:ring-green-600/25 focus:ring-offset-2"
      >
        <div className="bg-emerald-50/60 px-4 py-3">
          <p className="line-clamp-2 text-xs font-medium uppercase tracking-wide text-green-700">
            {formatDisplayValue(displayTitle(person.role_title))}
          </p>
        </div>

        <div className="flex flex-col items-center px-4 py-6">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-gray-50 shadow-md ring-2 ring-green-600/15 sm:h-28 sm:w-28">
            <CommitteeMemberPhoto photo={person.photo} name={person.name} />
          </div>
          <p
            className={[
              "mt-4 text-sm font-semibold leading-snug sm:text-base",
              displayName === EMPTY_VALUE ? "text-gray-400" : "text-gray-900",
            ].join(" ")}
          >
            {displayName}
          </p>
          <p
            className={[
              "mt-1 text-xs",
              formatDisplayValue(person.specialist) === EMPTY_VALUE
                ? "text-gray-400"
                : "text-gray-500",
            ].join(" ")}
          >
            {formatDisplayValue(person.specialist)}
          </p>
          <FaChevronDown
            className={[
              "mt-4 h-3.5 w-3.5 text-green-600 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isExpanded ? "rotate-180" : "",
            ].join(" ")}
          />
        </div>
      </button>

      {isExpanded ? (
        <div className="space-y-3 border-t border-gray-100 bg-gray-50/80 px-4 py-4 text-left sm:px-5">
          <DetailItem
            icon={FaPhoneAlt}
            label="Phone"
            value={formatDisplayValue(person.phone)}
            href={
              person.phone != null && String(person.phone).trim()
                ? `tel:${person.phone}`
                : undefined
            }
          />
          <DetailItem
            icon={FaEnvelope}
            label="Email"
            value={formatDisplayValue(person.email)}
            href={
              person.email?.trim() ? `mailto:${person.email}` : undefined
            }
          />
          <DetailItem
            icon={FaHospital}
            label="Working Place"
            value={formatDisplayValue(person.working_place)}
          />
          <DetailItem
            icon={FaGraduationCap}
            label="Degree"
            value={formatDisplayValue(person.degree)}
          />
          <DetailItem
            icon={FaStethoscope}
            label="Specialist"
            value={formatDisplayValue(person.specialist)}
          />
          <DetailItem
            icon={FaMapMarkerAlt}
            label="Address"
            value={formatDisplayValue(person.address)}
          />
        </div>
      ) : null}
    </article>
  );
};

export const CommitteeGrid = ({
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

export const StaticTile = ({ title, name }: { title: string; name: string }) => {
  const displayName = name?.trim() ? formatName(name) : EMPTY_VALUE;

  return (
    <article className="flex min-h-[7.5rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-emerald-50/60 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-green-700">
          {formatDisplayValue(displayTitle(title))}
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-4 text-center">
        <p
          className={[
            "text-sm font-semibold leading-snug sm:text-base",
            displayName === EMPTY_VALUE ? "text-gray-400" : "text-gray-900",
          ].join(" ")}
        >
          {displayName}
        </p>
      </div>
    </article>
  );
};

export const CommitteeSectionSkeleton = () => (
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
