import type { Metadata } from "next";
import BlogDetails from "@/components/pages/BlogDetails";
import { getBlogById } from "@/data/staticApi";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = getBlogById(id);
  return {
    title: blog?.title
      ? `${blog.title} | SNDB Blog`
      : "Blog | Society of Nepal Doctors of Bangladesh",
    description: "Read articles and updates from SNDB.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <BlogDetails blogId={id} />;
}
