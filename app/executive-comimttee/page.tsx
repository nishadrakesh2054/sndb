import type { Metadata } from "next";
import ExecutiveCommiteePage from "@/components/pages/ExecutiveCommitee";

export const metadata: Metadata = {
  title: "Executive Committee | Society of Nepal Doctors of Bangladesh",
  description: "Current SNDB executive committee members.",
};

export default function Page() {
  return <ExecutiveCommiteePage />;
}
