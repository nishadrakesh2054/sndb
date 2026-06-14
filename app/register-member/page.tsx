import type { Metadata } from "next";
import MemberShipPage from "@/components/pages/MemberShip";

export const metadata: Metadata = {
  title: "Membership | Society of Nepal Doctors of Bangladesh",
  description: "SNDB membership information and application.",
};

export default function Page() {
  return <MemberShipPage />;
}
