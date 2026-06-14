import type { Metadata } from "next";
import ErrorPage from "@/components/pages/Error";

export const metadata: Metadata = {
  title: "Page Not Found | Society of Nepal Doctors of Bangladesh",
};

export default function NotFound() {
  return <ErrorPage />;
}
