import blogsData from "./blogs.json";
import galleriesData from "./galleries.json";
import herosData from "./heros.json";
import noticesData from "./notices.json";
import pdfsData from "./pdfs.json";
import profilesData from "./profiles.json";

export type HeroSlide = {
  _id: string;
  images: string;
  title: string;
  createdAt: string;
};

export type Profile = {
  _id: string;
  title: string;
  image: string;
  position: string;
  phone?: number;
  email?: string;
  createdAt?: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  category?: string;
};

export type NoticeItem = {
  _id: string;
  title: string;
  images: string;
  createdAt: string;
};

export type PdfItem = {
  _id: string;
  title: string;
  filePath: string;
  createdAt?: string;
};

export type GalleryRecord = {
  _id: string;
  images: string[];
  createdAt?: string;
};

const sortByNewest = <T extends { createdAt?: string }>(items: T[]) =>
  [...items].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

export const getAllHeros = (): HeroSlide[] =>
  sortByNewest(herosData as HeroSlide[]);

export const getAllProfiles = (): Profile[] => {
  const list = [...(profilesData as Profile[])];
  list.sort((a, b) =>
    a.title.replace(/^dr\.?\s*/i, "").localeCompare(
      b.title.replace(/^dr\.?\s*/i, ""),
      undefined,
      { sensitivity: "base" }
    )
  );
  return list;
};

export const getAllBlogs = (): BlogPost[] =>
  sortByNewest(blogsData as BlogPost[]);

export const getBlogById = (id: string): BlogPost | undefined =>
  (blogsData as BlogPost[]).find((blog) => blog._id === id);

export const getAllNotices = (): NoticeItem[] =>
  sortByNewest(noticesData as NoticeItem[]);

export const getNoticeById = (id: string): NoticeItem | undefined =>
  (noticesData as NoticeItem[]).find((notice) => notice._id === id);

export const getAllPdfs = (): PdfItem[] => pdfsData as PdfItem[];

export const getAllGalleries = (): GalleryRecord[] =>
  galleriesData as GalleryRecord[];

export const getStatsCounts = () => ({
  members: profilesData.length,
  notices: noticesData.length,
  blogs: blogsData.length,
});
