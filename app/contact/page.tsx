import type { Metadata } from "next";
import ContactPage from "@/components/pages/Contact";

export const metadata: Metadata = {
  title: "Contact | Society of Nepal Doctors of Bangladesh",
  description:
    "Get in touch with the Society for Nepalese Doctors from Bangladesh (SNDB).",
};

export default function Page() {
  return <ContactPage />;
}
