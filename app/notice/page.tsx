import type { Metadata } from "next";
import NoticePage from "@/components/pages/Notice";

export const metadata: Metadata = {
  title: "Notice | Society of Nepal Doctors of Bangladesh",
  description: "SNDB notices and documents.",
};

export default function Page() {
  return <NoticePage />;
}
