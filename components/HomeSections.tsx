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

type MembershipBenefitCardProps = {
  icon: typeof FaBullseye;
  title: string;
  description: string;
};

const MembershipBenefitCard = ({
  icon: Icon,
  title,
  description,
}: MembershipBenefitCardProps) => (
  <article className="group relative flex h-full flex-col items-center rounded-3xl border border-gray-200/80 bg-white px-6 py-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-green-300 hover:shadow-xl hover:shadow-green-900/5 sm:px-8">
    <span className="pointer-events-none absolute inset-x-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-green-400 via-green-600 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <span className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#e4f7ef] to-emerald-100 text-green-700 shadow-inner ring-8 ring-[#f0faf5] transition-all duration-300 group-hover:scale-105 group-hover:bg-green-600 group-hover:text-white group-hover:ring-green-100 group-hover:shadow-lg group-hover:shadow-green-600/20">
      <Icon className="h-10 w-10" />
    </span>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
      {description}
    </p>
    <span className="mt-6 block h-1 w-10 rounded-full bg-green-200 transition-all duration-300 group-hover:w-16 group-hover:bg-green-600" />
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

const valuePillLabels = [
  "Integrity",
  "Service",
  "Unity",
  "Lifelong Learning",
] as const;

const sectionWatermarkClass =
  "pointer-events-none absolute right-6 top-5 select-none text-6xl font-bold leading-none sm:right-8 sm:top-6 sm:text-7xl";

export function MissionVisionValues() {
  const [mission, vision, values] = missionVisionValues;
  const MissionIcon = mission.icon;
  const VisionIcon = vision.icon;
  const ValuesIcon = values.icon;

  return (
    <section className="relative overflow-hidden border-t border-green-200/60 bg-[#e4f7ef] py-12 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(134, 239, 172, 0.35) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(110, 231, 183, 0.3) 0%, transparent 40%)",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-green-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl" />

      <PageContainer className="relative">
        <PageHeader
          as="h2"
          label="Who We Are"
          title={
            <>
              Mission, Vision & <span className="text-green-700">Values</span>
            </>
          }
          subtitle="The principles that guide SNDB and our commitment to the medical community."
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <article className="group relative rounded-3xl border border-green-200/70 bg-white/90 p-8 shadow-sm backdrop-blur-sm transition hover:shadow-md lg:col-span-7 lg:p-10">
            <span
              className={`${sectionWatermarkClass} text-green-100`}
              aria-hidden
            >
              01
            </span>
            <div className="relative z-10 flex h-full flex-col pr-14 sm:pr-16">
              <div className="mb-6 flex items-center gap-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-md shadow-green-600/25">
                  <MissionIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                    Our Mission
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Unite. Collaborate. Serve.
                  </h3>
                </div>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-gray-700">
                {mission.description}
              </p>
              <div className="mt-8 h-1 w-16 rounded-full bg-green-600 transition-all group-hover:w-24" />
            </div>
          </article>

          <article className="group relative rounded-3xl border border-green-300/60 bg-gradient-to-br from-green-700 to-green-800 p-8 text-white shadow-lg lg:col-span-5 lg:p-10">
            <span
              className={`${sectionWatermarkClass} text-white/10`}
              aria-hidden
            >
              02
            </span>
            <div className="relative z-10 flex h-full flex-col pr-14 sm:pr-16">
              <div className="mb-6 flex items-center gap-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                  <VisionIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-100">
                    Our Vision
                  </p>
                  <h3 className="text-2xl font-bold sm:text-3xl">
                    Bridge Two Nations
                  </h3>
                </div>
              </div>
              <p className="flex-1 text-base leading-relaxed text-green-50">
                {vision.description}
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-medium text-green-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Nepal ↔ Bangladesh
              </div>
            </div>
          </article>
        </div>

        <article className="relative mt-6 rounded-3xl border border-green-200/70 bg-white/85 p-8 shadow-sm backdrop-blur-sm md:mt-8 md:flex md:items-center md:gap-8 md:p-10">
          <span
            className={`${sectionWatermarkClass} text-green-100`}
            aria-hidden
          >
            03
          </span>
          <div className="relative z-10 mb-6 flex shrink-0 items-center gap-4 md:mb-0">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e4f7ef] text-green-700 ring-1 ring-green-200">
              <ValuesIcon className="h-6 w-6" />
            </span>
            <div className="md:hidden">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                Our Values
              </p>
              <h3 className="text-xl font-bold text-gray-900">What We Stand For</h3>
            </div>
          </div>
          <div className="relative z-10 flex-1 pr-14 sm:pr-16">
            <div className="mb-3 hidden md:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
                Our Values
              </p>
              <h3 className="text-xl font-bold text-gray-900">What We Stand For</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 md:text-base">
              {values.description}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {valuePillLabels.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-green-200 bg-[#e4f7ef] px-3.5 py-1.5 text-xs font-semibold text-green-800"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </PageContainer>
    </section>
  );
}

export function WhyJoinSNDB() {
  return (
    <PageSection className="bg-white">
      <PageContainer>
        <PageHeader
          as="h2"
          label="Membership"
          title={
            <>
              Why Join <span className="text-green-700">SNDB?</span>
            </>
          }
          subtitle="Membership opens doors to growth, connection, and meaningful contribution to healthcare in Nepal."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {membershipBenefits.map((item) => (
            <MembershipBenefitCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-green-100 bg-gradient-to-r from-[#f4fbf7] via-white to-[#f4fbf7] px-6 py-8 text-center sm:flex-row sm:justify-center sm:gap-5">
          <Link
            href="/register-member"
            className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-lg"
          >
            Apply for Membership
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/member"
            className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-7 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:bg-[#e4f7ef] hover:text-green-800"
          >
            View Life Members
          </Link>
        </div>
      </PageContainer>
    </PageSection>
  );
}
