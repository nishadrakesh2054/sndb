import Link from "next/link";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import AboutPageShell from "@/components/about/AboutPageShell";

const founderImage = "/doctor3.jpeg";

const AboutFoundersMessage = () => (
  <AboutPageShell
    label="About Us"
    title={
      <>
        Founder&apos;s <span className="text-green-600">Message</span>
      </>
    }
    subtitle="A message from Dr. Rakesh Shah, Founder and President of SNDB, on building a united professional community."
  >
    <article className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-5">
        <div className="border-b border-gray-100 bg-emerald-50/60 p-8 lg:col-span-2 lg:border-b-0 lg:border-r lg:p-10">
          <div className="mx-auto max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <img
              src={founderImage}
              loading="lazy"
              alt="Dr. Rakesh Shah"
              className="aspect-[3/4] w-full object-cover object-top"
            />
          </div>
          <div className="mt-6 text-center lg:text-left">
            <h2 className="text-xl font-bold text-gray-900">Dr. Rakesh Shah</h2>
            <p className="mt-1 text-sm font-medium text-green-700">
              Founder & President, SNDB
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Colorectal Surgeon · Everest Hospital, Kathmandu
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10 lg:col-span-3">
          <div className="mb-6 flex items-start gap-3">
            <FaQuoteLeft className="mt-1 h-5 w-5 shrink-0 text-green-600/80" />
            <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Message From the Founder
            </h3>
          </div>

          <div className="space-y-5 text-justify leading-relaxed text-gray-600">
            <p>
              When we first envisioned a society for Nepalese doctors who
              completed their medical education in Bangladesh, our goal was
              simple: to bring together professionals who shared a common
              academic journey and to give that community a stronger voice in
              Nepal&apos;s medical landscape.
            </p>
            <p>
              What began as informal connection through social platforms grew
              into a movement. Doctors from different specialties, institutions,
              and regions came forward with the same desire—to support one
              another, share knowledge, and contribute meaningfully to
              healthcare in Nepal. That collective spirit became the foundation
              of the Society for Nepalese Doctors from Bangladesh.
            </p>
            <p>
              Registering SNDB as a non-profit organization and securing
              affiliation with the Nepal Medical Association were important steps
              in giving our community formal recognition and institutional
              strength. These milestones were achieved because members believed
              in unity, professionalism, and service.
            </p>
            <p>
              As Founder and President, I urge every member to remain actively
              engaged in the society&apos;s programmes, uphold ethical medical
              practice, and work together to strengthen the bond between the
              medical communities of Nepal and Bangladesh. With dedication and
              shared purpose, SNDB can continue to grow as a respected platform
              for learning, collaboration, and healthcare advancement.
            </p>
          </div>

          <div className="mt-10 border-t border-gray-100 pt-6">
            <p className="text-base font-semibold text-gray-900">
              Dr. Rakesh Shah
            </p>
            <p className="text-sm text-gray-500">Founder & President, SNDB</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/executive-message"
              className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              President&apos;s Message
              <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about/history"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
            >
              Our History
            </Link>
          </div>
        </div>
      </div>
    </article>
  </AboutPageShell>
);

export default AboutFoundersMessage;
