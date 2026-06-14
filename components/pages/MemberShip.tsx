"use client";

import { FaCheckCircle, FaEnvelope, FaUniversity } from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  PageSection,
  SectionHeader,
} from "@/components/PageHeader";
import MembershipForm from "@/components/MembershipForm";

const MemberShip: React.FC = () => {
  return (
    <>
      <PageSection>
        <PageContainer>
          <PageHeader
            label="Join SNDB"
            title={
              <>
                Membership <span className="text-green-600">Information</span>
              </>
            }
            subtitle="Requirements, fees, and how to apply for SNDB membership."
          />

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeader
                label="Details"
                heading="Membership Requirements"
              />

              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pre-requisite of Life Membership
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Surgeons who are registered to Nepal Medical Council and
                    fulfilling any one of the following criteria can apply for
                    life membership of SNDB:
                  </p>
                  <ul className="mt-5 space-y-3">
                    {[
                      "MCh or equivalent from a recognized institute and recognized by Nepal Medical Council as Gastrointestinal surgeon.",
                      "MS or equivalent from a recognized institute with 5 years of experience in the field of surgical gastroenterology.",
                      "Three years of experience in the field of surgical gastroenterology following MS or equivalent from a recognized institute with one year clinical fellowship in surgical gastroenterology.",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-gray-600"
                      >
                        <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm font-semibold text-green-700">
                    Life Membership Fee — NRS 5,000.00
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Associate Membership
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Doctors related to other fraternities of medical sciences
                    except surgical gastroenterology, as well as non-medical
                    personnel who are interested in becoming a member, can
                    apply.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-green-700">
                    Associate Membership Fee — NRS 2,000.00
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Honorary Members
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Doctors and non-medical personnel, both national and
                    international citizens, who have made significant
                    contributions to the field of surgical gastroenterology or
                    to the organization as decided by the executive committee
                    meeting.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900">
                    How to Apply
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Prospective members are requested to download the membership
                    form from the link below. The form can be filled and
                    submitted with the required documents to the secretary, or the
                    filled form can be scanned along with a scanned copy of the
                    necessary documents and proof of payment of the membership
                    fee, and sent to{" "}
                    <a
                      href="mailto:info@sndb.org.np"
                      className="inline-flex items-center gap-1 font-medium text-green-700 hover:text-green-800"
                    >
                      <FaEnvelope className="h-3.5 w-3.5" />
                      info@sndb.org.np
                    </a>
                    .
                  </p>
                </section>

                <section className="border-t border-gray-200 pt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <FaUniversity className="h-4 w-4 text-green-700" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Account Details for Payment
                    </h2>
                  </div>
                  <dl className="space-y-3 text-sm text-gray-600">
                    <div>
                      <dt className="font-medium text-gray-800">Bank</dt>
                      <dd>Prabhu Bank, Kalanki Branch</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-800">
                        Account Name
                      </dt>
                      <dd>
                        Society For Nepalese Doctors from Bangladesh (SNDB)
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-800">
                        Account Type
                      </dt>
                      <dd>Current Account NPR</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-800">
                        Account Number
                      </dt>
                      <dd className="font-mono text-gray-900">
                        198263977281648
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <MembershipForm />
            </div>
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
};

export default MemberShip;
