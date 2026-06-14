import type { Metadata } from "next";
import GalleryPage from "@/components/pages/Gallery";

export const metadata: Metadata = {
  title: "Gallery | Society of Nepal Doctors of Bangladesh",
  description: "Explore the SNDB photo gallery.",
};

export default function Page() {
  return <GalleryPage />;
}
