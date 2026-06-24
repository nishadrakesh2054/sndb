"use client";

import MediaImage from "@/components/MediaImage";
import AboutPageShell from "@/components/about/AboutPageShell";
import { PageSubsection } from "@/components/PageHeader";

const aboutimg = "/about.png";

const AboutImageVisual = () => (
  <div className="relative isolate w-full max-w-full">
    <div
      className="pointer-events-none absolute right-0 top-0 z-0 h-[92%] w-[86%] rounded-2xl bg-gradient-to-br from-green-700 to-green-600 shadow-lg"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute bottom-0 left-0 z-0 h-[76%] w-[72%] rounded-2xl border-2 border-green-600/25 bg-[#e4f7ef]"
      aria-hidden="true"
    />
    <div className="relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_48px_-20px_rgba(22,101,52,0.55)]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-800 via-green-600 to-green-700" />
      <MediaImage
        src={aboutimg}
        alt="Society of Nepal Doctors from Bangladesh"
        width={1800}
        height={900}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="block h-auto w-full object-contain"
      />
    </div>
  </div>
);

const AboutHistory = () => (
  <>
    <AboutPageShell
      label="About Us"
      title={
        <>
          Our <span className="text-green-600">History</span>
        </>
      }
      subtitle="How SNDB grew from a shared idea into a registered professional society for Nepalese doctors trained in Bangladesh."
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-8 lg:col-span-7">
          <PageSubsection
            label="Origins"
            heading="A Community Built Over Years"
            description="Long before formal registration, Nepalese doctors who studied in Bangladesh were connecting and supporting one another."
          >
            <div className="space-y-4 text-justify text-sm leading-relaxed text-gray-600 md:text-base">
              <p>
                The idea of establishing a dedicated organization for Nepalese
                doctors who completed their medical education in Bangladesh was
                conceived several years before SNDB was formally registered. What
                began as informal networking gradually evolved into a stronger
                sense of community among doctors who shared similar academic
                backgrounds and professional journeys.
              </p>
              <p>
                A Facebook group and page played an important role in bringing
                Nepalese doctors together on a common platform—whether they had
                completed MBBS, BDS, MD, MS, MDS, or other postgraduate
                programmes in Bangladesh. That digital space helped members stay
                connected, exchange knowledge, and recognize the need for a
                structured professional body.
              </p>
            </div>
          </PageSubsection>

          <PageSubsection
            label="Formalization"
            heading="Becoming a Registered Society"
          >
            <div className="space-y-4 text-justify text-sm leading-relaxed text-gray-600 md:text-base">
              <p>
                Society for Nepalese Doctors from Bangladesh (SNDB) was
                registered as a non-political, non-profit organization with the
                Office of the Company Registrar, Government of Nepal. The
                registration gave the society a legal identity to represent its
                members, organize programmes, and work toward the collective
                welfare of Nepalese doctors trained in Bangladesh.
              </p>
              <p>
                On 9 April 2021, SNDB announced its first Working Central
                Executive Committee, marking an important milestone in the
                society&apos;s institutional development. Since then, SNDB has
                continued to grow as a platform for professional networking,
                collaboration, and service to the medical community in Nepal.
              </p>
            </div>
          </PageSubsection>

          <PageSubsection label="Purpose" heading="Why SNDB Exists">
            <div className="space-y-4 text-justify text-sm leading-relaxed text-gray-600 md:text-base">
              <p>
                SNDB represents Nepalese doctors who completed their medical
                education in Bangladesh and are practicing in Nepal and around
                the world. The society promotes professional growth, networking,
                and collaboration while fostering knowledge exchange, career
                development, and unity among its members.
              </p>
              <p>
                Through shared expertise and collective effort, SNDB strives to
                contribute to the advancement of healthcare services in Nepal
                and to strengthen the bond between the medical communities of
                Nepal and Bangladesh.
              </p>
            </div>
          </PageSubsection>
        </div>

        <div className="lg:col-span-5">
          <AboutImageVisual />

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-green-800">
              Key Milestones
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                <span>
                  Informal community building through social networking among
                  Bangladesh-trained Nepalese doctors
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                <span>
                  Registration as a non-profit organization with the Office of
                  the Company Registrar, Nepal
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                <span>
                  First Central Executive Committee announced on 9 April 2021
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                <span>
                  Accreditation as an affiliated society under the Nepal Medical
                  Association (NMA) on 31 July 2021
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AboutPageShell>
  </>
);

export default AboutHistory;
