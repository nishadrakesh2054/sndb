import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaHandshake } from "react-icons/fa";
import AboutPageShell from "@/components/about/AboutPageShell";
import AboutRegisterImage from "@/components/about/AboutRegisterImage";
import { PageSubsection } from "@/components/PageHeader";

const affiliationBenefits = [
  "Recognition as an affiliated professional society under the national umbrella of the Nepal Medical Association.",
  "Alignment with the ethical standards, professional values, and advocacy framework supported by NMA.",
  "Opportunity to participate in the wider medical fraternity of Nepal through conferences, programmes, and collaborative initiatives.",
  "Stronger representation of Bangladesh-trained Nepalese doctors within Nepal's organized medical community.",
];

const AboutAffiliations = () => (
  <AboutPageShell
    label="About Us"
    title={
      <>
        Affiliations with{" "}
        <span className="text-green-600">Nepal Medical Association</span>
      </>
    }
    subtitle="SNDB's relationship with the Nepal Medical Association and what it means for our members."
  >
    <div className="mx-auto max-w-4xl space-y-10">
      <PageSubsection
        label="Accreditation"
        heading="Affiliated Society under NMA"
        description="SNDB is recognized within Nepal's premier national medical professional body."
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaHandshake className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Nepal Medical Association (NMA)
              </h3>
              <p className="text-sm text-gray-500">
                National professional organization of medical and dental doctors
                in Nepal
              </p>
            </div>
          </div>

          <div className="space-y-4 text-justify text-sm leading-relaxed text-gray-600 md:text-base">
            <p>
              Society for Nepalese Doctors from Bangladesh (SNDB) was accredited
              as an affiliated society under the Nepal Medical Association (NMA)
              on 31 July 2021. This affiliation placed SNDB among the
              professional societies recognized within NMA&apos;s national
              framework.
            </p>
            <p>
              The Nepal Medical Association is the first professional
              organization of its kind in Nepal and serves as an umbrella body
              for numerous specialty and fraternity societies. Through this
              affiliation, SNDB strengthens its connection to the broader
              medical community while continuing to focus on the unique needs of
              Nepalese doctors who trained in Bangladesh.
            </p>
          </div>
        </div>
      </PageSubsection>

      <PageSubsection label="For Members" heading="What Affiliation Means">
        <ul className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 md:p-8">
          {affiliationBenefits.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed text-gray-700"
            >
              <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm leading-relaxed text-gray-600">
          NMA membership and Nepal Medical Council registration remain important
          professional requirements for practicing doctors in Nepal. SNDB
          affiliation complements these credentials by providing a dedicated
          platform for doctors united by their academic connection to Bangladesh.
        </p>

        <a
          href="https://www.nma.org.np/"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
        >
          Visit NMA Website
          <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </PageSubsection>

      <PageSubsection label="Related" heading="Learn More About SNDB">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/about/history"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            Our History
          </Link>
          <Link
            href="/executive-committee"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
          >
            Executive Committee
          </Link>
        </div>
      </PageSubsection>

      <AboutRegisterImage />
    </div>
  </AboutPageShell>
);

export default AboutAffiliations;
