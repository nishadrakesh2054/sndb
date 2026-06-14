import type { Metadata } from "next";
import BlogPage from "@/components/pages/Blog";

export const metadata: Metadata = {
  title: "Blogs | Society of Nepal Doctors of Bangladesh",
  description: "Latest blogs and updates from SNDB.",
};

export default function Page() {
  return <BlogPage />;
}
