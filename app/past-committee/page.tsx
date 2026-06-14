import type { Metadata } from "next";
import PastEXCommPage from "@/components/pages/PastEXComm";

export const metadata: Metadata = {
  title: "Past Executive Committee | Society of Nepal Doctors of Bangladesh",
  description: "Past SNDB executive committee members.",
};

export default function Page() {
  return <PastEXCommPage />;
}
