import type { Metadata } from "next";
import MemberPage from "@/components/pages/Member";

export const metadata: Metadata = {
  title: "Life Members | Society of Nepal Doctors of Bangladesh",
  description: "Discover SNDB life members.",
};

export default function Page() {
  return <MemberPage />;
}
