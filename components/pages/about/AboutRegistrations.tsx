import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaFileAlt, FaUniversity } from "react-icons/fa";
import AboutPageShell from "@/components/about/AboutPageShell";
import AboutRegisterImage from "@/components/about/AboutRegisterImage";
import { PageSubsection } from "@/components/PageHeader";

const registrationPoints = [
  "Registered as a non-political, non-profit organization with the Office of the Company Registrar, Government of Nepal.",
  "Operates under its own constitution and elected executive committee to serve Nepalese doctors trained in Bangladesh.",
  "Maintains transparent governance and works for the professional welfare of its members.",
  "Membership is open to qualified doctors and associate members as defined in the SNDB membership policy.",
];

const membershipNotes = [
  "Life membership is available to eligible medical professionals who meet SNDB criteria.",
  "Associate membership is available to interested doctors from other medical fraternities and non-medical personnel who support the society's objectives.",
  "Applicants should submit complete documents and membership fees as outlined in the membership information page.",
];

const AboutRegistrations = () => (
  <AboutPageShell
    label="About Us"
    title={
      <>
        Society <span className="text-green-600">Registrations</span>
      </>
    }
    subtitle="Legal registration, organizational status, and how doctors can become members of SNDB."
  >
    <div className="mx-auto max-w-4xl space-y-10">
      <PageSubsection
        label="Legal Status"
        heading="Registered with the Government of Nepal"
        description="SNDB is formally established as a non-profit professional society."
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaUniversity className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Office of the Company Registrar
              </h3>
              <p className="text-sm text-gray-500">
                Government of Nepal · Non-profit registration
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {registrationPoints.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-gray-600"
              >
                <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </PageSubsection>

      <PageSubsection
        label="Membership"
        heading="Doctor & Associate Registration"
        description="Membership registration is separate from the society's legal incorporation and is managed by SNDB."
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-green-700">
              <FaFileAlt className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                SNDB Membership Registration
              </h3>
              <p className="text-sm text-gray-500">
                For doctors and associate members
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {membershipNotes.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-gray-600"
              >
                <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-gray-600">
            All practicing doctors in Nepal must also be registered with the
            Nepal Medical Council (NMC) in accordance with national law. SNDB
            membership complements professional registration and supports
            networking, advocacy, and collective development among Bangladesh-trained
            Nepalese doctors.
          </p>

          <Link
            href="/register-member"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            View Membership Information
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </PageSubsection>

      <AboutRegisterImage />
    </div>
  </AboutPageShell>
);

export default AboutRegistrations;
