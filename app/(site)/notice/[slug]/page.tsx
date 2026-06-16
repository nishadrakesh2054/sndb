import type { Metadata } from "next";
import NoticeDetails from "@/components/pages/NoticeDetails";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  createArticleMetadata,
} from "@/lib/seo";
import {
  getNoticeOgImage,
  getNoticeSeoDescription,
  getNoticeSeoTitle,
} from "@/utils/supabase/notices";
import {
  getNoticeBySlugServer,
  getPublishedNoticeSlugs,
} from "@/utils/supabase/notices.server";

export const revalidate = 300;
export const dynamicParams = true;
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedNoticeSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const notice = await getNoticeBySlugServer(slug);

  if (!notice) {
    return createArticleMetadata({
      title: "Notice",
      description: "Official notice from SNDB.",
      path: `/notice/${slug}`,
    });
  }

  return createArticleMetadata({
    title: getNoticeSeoTitle(notice),
    description: getNoticeSeoDescription(notice),
    path: `/notice/${notice.slug}`,
    image: getNoticeOgImage(notice),
    imageAlt: notice.image_alt ?? notice.title,
    keywords: notice.meta_keywords?.length ? notice.meta_keywords : undefined,
    publishedTime: notice.published_at ?? notice.created_at,
    modifiedTime: notice.updated_at,
    ogTitle: notice.og_title,
    ogDescription: notice.og_description,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  let notice = null;

  try {
    notice = await getNoticeBySlugServer(slug);
  } catch {
    notice = null;
  }

  return (
    <>
      {notice ? (
        <JsonLd
          data={[
            buildBreadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Notices", path: "/notice" },
              { name: notice.title, path: `/notice/${notice.slug}` },
            ]),
            buildArticleJsonLd({
              title: getNoticeSeoTitle(notice),
              description: getNoticeSeoDescription(notice),
              path: `/notice/${notice.slug}`,
              image: getNoticeOgImage(notice),
              publishedTime: notice.published_at ?? notice.created_at,
              modifiedTime: notice.updated_at,
            }),
          ]}
        />
      ) : null}
      <NoticeDetails slug={slug} initialNotice={notice} />
    </>
  );
}
