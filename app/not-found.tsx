import type { Metadata } from "next";
import ErrorPage from "@/components/pages/Error";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description:
    "The page you are looking for could not be found on the Society of Nepal Doctors of Bangladesh website.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return <ErrorPage />;
}
