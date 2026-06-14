import type { Metadata } from "next";
import NoticeDetails from "@/components/pages/NoticeDetails";
import { getNoticeById } from "@/data/staticApi";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const notice = getNoticeById(id);
  return {
    title: notice?.title
      ? `${notice.title} | SNDB Notice`
      : "Notice Details | Society of Nepal Doctors of Bangladesh",
    description: "SNDB notice details.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <NoticeDetails noticeId={id} />;
}
