import type { Metadata } from "next";
import MessagePage from "@/components/pages/Message";

export const metadata: Metadata = {
  title: "President's Message | Society of Nepal Doctors of Bangladesh",
  description: "Message from the SNDB President.",
};

export default function Page() {
  return <MessagePage />;
}
