import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";

const Error = () => {
  return (
    <>
      <PageSection>
        <PageContainer className="max-w-lg text-center">
          <p className="mb-4 text-7xl font-bold leading-none text-green-600/15 sm:text-8xl">
            404
          </p>

          <PageHeader
            label="Error"
            title={
              <>
                Page <span className="text-green-600">Not Found</span>
              </>
            }
            subtitle="The page you're looking for doesn't exist or may have been moved."
            className="mb-8"
          />

          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
          >
            Go Back Home
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </PageContainer>
      </PageSection>
    </>
  );
};

export default Error;
