import Link from "next/link";
import {
  FaArrowRight,
  FaBullseye,
  FaChalkboardTeacher,
  FaEye,
  FaHandsHelping,
  FaHeart,
  FaStethoscope,
  FaUserFriends,
} from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "./PageHeader";

type IconCardProps = {
  icon: typeof FaBullseye;
  title: string;
  description: string;
};

const IconCard = ({ icon: Icon, title, description }: IconCardProps) => (
  <article className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-green-300 hover:shadow-md sm:p-8">
    <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
      <Icon className="h-5 w-5" />
    </span>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
      {description}
    </p>
  </article>
);

const missionVisionValues = [
  {
    icon: FaBullseye,
    title: "Our Mission",
    description:
      "To unite Nepalese doctors who trained in Bangladesh, fostering collaboration, knowledge sharing, and collective contribution to healthcare in Nepal.",
  },
  {
    icon: FaEye,
    title: "Our Vision",
    description:
      "A strong, respected medical community that bridges Nepal and Bangladesh—advancing professional excellence and better patient care across both nations.",
  },
  {
    icon: FaHeart,
    title: "Our Values",
    description:
      "Integrity in practice, service to society, unity among members, and a lifelong commitment to learning and ethical medical leadership.",
  },
] as const;

const membershipBenefits = [
  {
    icon: FaUserFriends,
    title: "Professional Networking",
    description:
      "Connect with fellow doctors who share your academic roots in Bangladesh and build lasting professional relationships across Nepal.",
  },
  {
    icon: FaChalkboardTeacher,
    title: "CME & Learning",
    description:
      "Access seminars, workshops, and knowledge exchange opportunities that support continuous medical education and skill development.",
  },
  {
    icon: FaHandsHelping,
    title: "Strong Community",
    description:
      "Be part of a supportive fraternity that celebrates shared heritage, mutual respect, and collaboration among medical professionals.",
  },
  {
    icon: FaStethoscope,
    title: "Professional Support",
    description:
      "Gain guidance, mentorship, and collective advocacy that helps members grow in their careers and serve patients with confidence.",
  },
] as const;

export function MissionVisionValues() {
  return (
    <section className="border-t border-gray-200 bg-white py-10 md:py-14">
      <PageContainer>
        <PageHeader
          as="h2"
          label="Who We Are"
          title={
            <>
              Mission, Vision & <span className="text-green-600">Values</span>
            </>
          }
          subtitle="The principles that guide SNDB and our commitment to the medical community."
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {missionVisionValues.map((item) => (
            <IconCard key={item.title} {...item} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

export function WhyJoinSNDB() {
  return (
    <PageSection>
      <PageContainer>
        <PageHeader
          as="h2"
          label="Membership"
          title={
            <>
              Why Join <span className="text-green-600">SNDB?</span>
            </>
          }
          subtitle="Membership opens doors to growth, connection, and meaningful contribution to healthcare in Nepal."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {membershipBenefits.map((item) => (
            <IconCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Link
            href="/register-member"
            className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
          >
            Apply for Membership
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/member"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
          >
            View Life Members
          </Link>
        </div>
      </PageContainer>
    </PageSection>
  );
}
