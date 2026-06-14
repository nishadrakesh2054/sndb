"use client";

import { useState, type ComponentType, type ReactNode } from "react";
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

const Rakesh = "/doctor3.jpeg";
const Dinesh = "/doctor1.jpeg";
const Ritesh = "/doctor14.jpeg";
const Nehal = "/doctor19.jpeg";
const Pinky = "/doctor10.jpeg";
const Amrita = "/doctor19.jpeg";
const AbhisekRaj = "/doctor18.jpeg";
const Rajendra = "/doctor20.jpeg";
const Amresh = "/doctor19.jpeg";
const Narendra = "/doctor9.jpeg";
const Kathit = "/doctor19.jpeg";
const Narayan = "/doctor5.jpeg";
const Khim = "/doctor19.jpeg";
const Pawan = "/doctor8.jpeg";
const Shrish = "/doctor16.jpeg";
const Mayank = "/doctor12.jpeg";
const Mukesh = "/doctor19.jpeg";
const AbhisekTiwari = "/doctor15.jpeg";
const Manu = "/doctor17.jpeg";
const Ankita = "/doctor7.jpeg";
const Manish = "/doctor6.jpeg";
const Prajwol = "/doctor4.jpeg";
const Saruta = "/doctor2.jpeg";
const Milan = "/doctor11.jpeg";

type CommitteePerson = {
  title: string;
  name: string;
  phone: number;
  email: string;
  photo: string;
  workingPlace: string;
  Degree: string;
  specialist: string;
  Address: string;
};

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
  children: ReactNode;
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
  person: CommitteePerson;
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
        <p className="text-xs font-medium uppercase tracking-wide text-green-700 line-clamp-2">
          {displayTitle(person.title)}
        </p>
      </div>

      <div className="flex flex-col items-center px-4 py-6">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-gray-50 shadow-md ring-2 ring-green-600/15 sm:h-28 sm:w-28">
          <img
            src={person.photo}
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
        <DetailItem
          icon={FaPhoneAlt}
          label="Phone"
          value={String(person.phone)}
          href={`tel:${person.phone}`}
        />
        <DetailItem
          icon={FaEnvelope}
          label="Email"
          value={person.email}
          href={`mailto:${person.email}`}
        />
        <DetailItem
          icon={FaHospital}
          label="Working Place"
          value={person.workingPlace}
        />
        <DetailItem
          icon={FaGraduationCap}
          label="Degree"
          value={person.Degree}
        />
        <DetailItem
          icon={FaStethoscope}
          label="Specialist"
          value={person.specialist.trim()}
        />
        <DetailItem
          icon={FaMapMarkerAlt}
          label="Address"
          value={person.Address}
        />
      </div>
    )}
  </article>
);

const CommitteeGrid = ({
  people,
  expandedId,
  onToggle,
}: {
  people: CommitteePerson[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) => (
  <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
    {people.map((person) => (
      <CommitteeCard
        key={person.name}
        person={person}
        isExpanded={expandedId === person.name}
        onToggle={() => onToggle(person.name)}
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
  icon: ComponentType<{ className?: string }>;
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

const ExecutiveCommittee: React.FC = () => {
  const committeeData = [
    { 
      title: "President & Founder",
      name: "Dr. Rakesh Shah",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Rakesh, // Use imported image
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: " Colorectal Surgeon",
      Address: "Kalanki",
    },
    {
      title: "Immediate Past President",
      name: "Dr. Dinesh Prasad Koirala",
      phone: 9804864344,
      email: "sndbdoctors@gmail.com",
      photo: Dinesh, // Use imported image
      workingPlace: "TUTH",
      Degree: "MBBs",
      specialist: "Pediatric Surgeon",
      Address: "Kalanki",
    },
    {
      title: "General Secretary",
      name: "Dr Ritesh Ghimire",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Ritesh, // Use imported image
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Internal Medicine",
      Address: "Kalanki",
    },
    {
      title: "Secretary",
      name: "Dr. Nehal Asharaf",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Nehal, // Use imported image
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
    {
      title: "Joint Secretary",
      name: "Dr. Pinky Shah",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Pinky, // Use imported image
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: " Dental Surgeon",
      Address: "Kalanki",
    },
    {
      title: "Treasurer",
      name: "Dr. Amrita Shrestha",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Amrita, // Use imported image
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: " Dental Surgeon",
      Address: "Kalanki",
    },
    {
      title: "Joint Treasurer",
      name: "Dr. Abhisek Raj",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: AbhisekRaj, // Use imported image
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
  ];

  const VicePresident = [
    {
      name: "Dr. Rajendra Chaudhary (Koshi)",
      title: "Vice President / Province Coordinator",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Rajendra,
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Radiologist",
      Address: "Kalanki",
    },
    {
      name: "Dr. Amresh Karn (Madhesh)",
      title: "Vice President / Province Coordinator",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Amresh,
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Urologist",
      Address: "Kalanki",
    },
    {
      name: "Dr. Narendra Salikhe (Bagmati)",
      title: "Vice President / Province Coordinator",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Narendra,
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Neuro Surgeon",
      Address: "Kalanki",
    },
    {
      name: "Dr. Kathit Raj Ghimire (Gandaki)",
      title: "Vice President / Province Coordinator",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Kathit,
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Orthopedic Surgeon",
      Address: "Kalanki",
    },
    {
      name: "Dr. Narayan Dulal (Lumbini)",
      title: "Vice President / Province Coordinator",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Narayan,
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Urologist",
      Address: "Kalanki",
    },
    {
      name: "Dr. Khim KC (Karnali)",
      title: "Vice President / Province Coordinator",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Khim,
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
    {
      name: "Dr. Pawan K. Shah (Sudurpaschim)",
      title: "Vice President / Province Coordinator",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Pawan,
      workingPlace: "Everest Hospital",
      Degree: "MBBs",
      specialist: "MDGP",
      Address: "Kalanki",
    },
  ];

  const members = [
    {
      name: "Dr. Shrish Silwal",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Shrish,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: " Pediatric Surgeon",
      Address: "Kalanki",
    },
    {
      name: "Dr. Mayank Acharya",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Mayank,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "CTVs Surgeon",
      Address: "Kalanki",
    },
    {
      name: "Dr. Mukesh Shah",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Mukesh,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Orthodontist",
      Address: "Kalanki",
    },
    {
      name: "Dr. Abhisek Tiwari",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: AbhisekTiwari,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "DM Cardiology (R)",
      Address: "Kalanki",
    },
    {
      name: "Dr. Manu Bhattarai",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Manu,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Surgeon",
      Address: "Kalanki",
    },
    {
      name: "Dr. Ankita Palikhe",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Ankita,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
    {
      name: "Dr. Manish Gurmaita",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Manish,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
    {
      name: "Dr. Prajwol Gauchan",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Prajwol,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
    {
      name: "Dr.Mamta Bhatta",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Prajwol,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
    {
      name: "Dr. Saruta Gurung",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Saruta,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Surgeon",
      Address: "Kalanki",
    },
    {
      name: "Dr. Milan Subedi",
      title: "Members",
      phone: 9817073670,
      email: "sndbdoctors@gmail.com",
      photo: Milan,
      workingPlace: "Everest  Hospital",
      Degree: "MBBs",
      specialist: "Prime Care Physician",
      Address: "Kalanki",
    },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

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

          <div className="space-y-2">
            <SectionBlock label="Leadership" heading="Office Bearers">
              <CommitteeGrid
                people={committeeData}
                expandedId={expandedId}
                onToggle={toggleCard}
              />
            </SectionBlock>

            <SectionBlock
              label="Provincial"
              heading="Vice-Presidents & Coordinators"
            >
              <CommitteeGrid
                people={VicePresident}
                expandedId={expandedId}
                onToggle={toggleCard}
              />
            </SectionBlock>

            <SectionBlock
              label="Committee"
              heading="Members"
              description={`${members.length} executive committee members`}
            >
              <CommitteeGrid
                people={members}
                expandedId={expandedId}
                onToggle={toggleCard}
              />
            </SectionBlock>

            <SectionBlock
              label="Special Roles"
              heading="Additional Executive Positions"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:mx-auto lg:max-w-3xl">
                <StaticTile
                  title="Ext. Affairs Coordinator"
                  name="Dr. Rajesh Shah (Oral & Maxillio-Facial Surgeon)"
                />
                <StaticTile
                  title="Editor-in-Chief"
                  name="Dr. Deepak Kumar Yadav (Anesthesiologist)"
                />
              </div>
            </SectionBlock>
          </div>

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
