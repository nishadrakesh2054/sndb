import type { ReactNode } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  PageSection,
  PageSubsection,
} from "@/components/PageHeader";

type CommitteeEntry = {
  title?: string;
  name: string;
};

const formatName = (name: string) =>
  name.replace(/^dr\.?\s*/i, "Dr. ").replace(/\s+/g, " ").trim();

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

const PersonTile = ({ title, name }: CommitteeEntry) => (
  <article className="flex min-h-[7.5rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-green-200 hover:shadow-md">
    <div
      className={`px-4 py-3 ${
        title ? "bg-emerald-50/60" : "border-b border-emerald-50/80 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-green-700">
        {title ?? "Member"}
      </p>
    </div>
    <div className="flex flex-1 items-center justify-center px-4 py-4 text-center">
      <p className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">
        {formatName(name)}
      </p>
    </div>
  </article>
);

const PastEXComm: React.FC = () => {
  const officeBearers: CommitteeEntry[] = [
    { title: "President", name: "Dr. Dinesh Prasad Koirala" },
    { title: "General Secretary", name: "Dr Mukesh Prashad Shah" },
    { title: "Joint Secretary", name: "Dr. Santosh  Raj Manandhar" },
    { title: "Treasurer", name: "Dr. Pinky Shah" },
    { title: "Joint Treasurer", name: "Dr. Mithlesh Yadav" },
  ];

  const vicePresidents = [
    "Dr. Bishwo Pokhrel",
    "Dr. Lalit Kumar Das",
    "Dr. Rita Kumari mahaseth",
  ];

  const members = [
    "Dr. bashanta Baral",
    "Dr. Siba Thakali",
    "Dr. Mukesh Shah",
    "Dr. Archana Shrestha Yadav",
    "Dr. Niranjan Shah",
    "Dr. Nehal Asharaf",
    "Dr. Ritesh Ghimire",
    "Dr. Amrita Shrestha",
    "Dr. Upasana Sharma",
  ];

  const additionalPositions: CommitteeEntry[] = [
    {
      title: "Founder & Ext. Affairs Coordinator",
      name: "Dr. Rakesh  Shah",
    },
    { title: "Editor-in-Chief", name: "Dr. Amresh Karn " },
  ];

  const tileGrid =
    "grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6";

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

          <div className="space-y-2">
            <SectionBlock label="Leadership" heading="Office Bearers">
              <div className={tileGrid}>
                {officeBearers.map((person) => (
                  <PersonTile
                    key={person.title}
                    title={person.title}
                    name={person.name}
                  />
                ))}
              </div>
            </SectionBlock>

            <SectionBlock
              label="Provincial"
              heading="Vice-Presidents & Coordinators"
            >
              <div className={tileGrid}>
                {vicePresidents.map((name) => (
                  <PersonTile
                    key={name}
                    title="Vice-President"
                    name={name}
                  />
                ))}
              </div>
            </SectionBlock>

            <SectionBlock
              label="Committee"
              heading="Members"
              description={`${members.length} executive committee members`}
            >
              <div className={tileGrid}>
                {members.map((name) => (
                  <PersonTile key={name} name={name} />
                ))}
              </div>
            </SectionBlock>

            <SectionBlock
              label="Special Roles"
              heading="Additional Executive Positions"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:mx-auto lg:max-w-3xl">
                {additionalPositions.map((person) => (
                  <PersonTile
                    key={person.title}
                    title={person.title}
                    name={person.name}
                  />
                ))}
              </div>
            </SectionBlock>
          </div>

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
