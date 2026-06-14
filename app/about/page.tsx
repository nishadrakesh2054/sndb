import type { Metadata } from "next";
import AboutPage from "@/components/pages/About";

export const metadata: Metadata = {
  title: "About Us | Society of Nepal Doctors of Bangladesh",
  description:
    "Society for Nepalese Doctors from Bangladesh (SNDB) is a non-political, non-profitable organization for Nepalese doctors who have studied in Bangladesh.",
};

export default function Page() {
  return <AboutPage showStats />;
}
