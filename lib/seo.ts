import type { Metadata } from "next";
import { site } from "@/lib/site";

export function absoluteUrl(path = "/"): string {
  if (!path) return site.url;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, site.url).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [...site.defaultKeywords],
  ogImage = site.defaultOgImage,
  ogType = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(ogImage);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: ogType,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

type ArticleMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
};

export function createArticleMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  keywords,
  publishedTime,
  modifiedTime,
  authors = [site.shortName],
  canonicalUrl,
  ogTitle,
  ogDescription,
}: ArticleMetadataOptions): Metadata {
  const url = canonicalUrl || absoluteUrl(path);
  const imageUrl = absoluteUrl(image || site.defaultOgImage);

  return {
    title,
    description,
    keywords: keywords?.length ? [...keywords] : [...site.defaultKeywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "article",
      publishedTime,
      modifiedTime,
      authors,
      images: [
        {
          url: imageUrl,
          alt: imageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || title,
      description: ogDescription || description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export function createHomeMetadata(): Metadata {
  const page = createPageMetadata({
    title: site.defaultTitle,
    description: site.description,
    path: "/",
    keywords: [...site.defaultKeywords],
    ogImage: site.defaultOgImage,
  });

  return {
    ...page,
    title: {
      absolute: site.defaultTitle,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: absoluteUrl(site.defaultOgImage),
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressCountry: site.address.country,
    },
    sameAs: [site.social.facebook, site.social.instagram, site.social.whatsapp],
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    inLanguage: "en-NP",
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(site.defaultOgImage),
      },
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqJsonLd(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(options: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    image: options.image ? [absoluteUrl(options.image)] : [absoluteUrl(site.defaultOgImage)],
    datePublished: options.publishedTime,
    dateModified: options.modifiedTime || options.publishedTime,
    author: {
      "@type": "Person",
      name: options.authorName || site.shortName,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(site.defaultOgImage),
      },
    },
    mainEntityOfPage: absoluteUrl(options.path),
  };
}
