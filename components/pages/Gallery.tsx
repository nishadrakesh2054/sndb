"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSearchPlus } from "react-icons/fa";
import {
  getGalleryImageAlt,
  getPublishedGalleryImages,
  type GalleryImage,
} from "@/utils/supabase/gallery";
import MediaImage from "@/components/MediaImage";
import { getMediaUrl } from "@/lib/mediaUrl";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";

const GalleryLightbox = dynamic(() => import("./GalleryLightbox"), {
  ssr: false,
});

const IMAGES_PER_PAGE = 6;

type DisplayImage = {
  id: string;
  storagePath: string;
  alt: string;
};

const Gallery = ({ initialImages = [] }: { initialImages?: GalleryImage[] }) => {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [loading, setLoading] = useState(initialImages.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadGallery = async () => {
      setError(null);

      try {
        const data = await getPublishedGalleryImages();
        if (!cancelled) {
          setImages(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load gallery photos."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (initialImages.length === 0) {
      setLoading(true);
    }

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, []);

  const allImages: DisplayImage[] = useMemo(
    () =>
      images.map((image, index) => ({
        id: image.id,
        storagePath: image.image_url,
        alt: getGalleryImageAlt(image, index),
      })),
    [images]
  );

  const pageCount = Math.ceil(allImages.length / IMAGES_PER_PAGE);
  const startIndex = currentPage * IMAGES_PER_PAGE;
  const displayedImages = allImages.slice(
    startIndex,
    startIndex + IMAGES_PER_PAGE
  );

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const lightboxSlides = allImages.map((img) => ({
    src: getMediaUrl(img.storagePath),
    alt: img.alt,
  }));

  return (
    <>
      <PageSection>
        <PageContainer>
          <PageHeader
            label="Gallery"
            title={
              <>
                Photo <span className="text-green-600">Gallery</span>
              </>
            }
            subtitle="Events, activities, and memorable moments from the SNDB community."
          />

          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-white px-6 py-8 text-center">
              <p className="font-medium text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && allImages.length === 0 && (
            <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-800">
                No photos yet
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Gallery images will appear here once uploaded.
              </p>
            </div>
          )}

          {!loading && !error && allImages.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {displayedImages.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openLightbox(startIndex + index)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                    aria-label={`View ${item.alt}`}
                  >
                    <MediaImage
                      src={item.storagePath}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-green-700 opacity-0 shadow-md transition duration-300 group-hover:opacity-100">
                        <FaSearchPlus className="h-5 w-5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center gap-6">
                <p className="text-sm text-gray-500">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + IMAGES_PER_PAGE, allImages.length)} of{" "}
                  {allImages.length} photos
                </p>

                {pageCount > 1 && (
                  <nav
                    className="flex flex-wrap items-center justify-center gap-2"
                    aria-label="Gallery pagination"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(0, page - 1))
                      }
                      disabled={currentPage === 0}
                      className="inline-flex items-center gap-2 rounded-full border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                      <FaChevronLeft className="h-3.5 w-3.5" />
                      Previous
                    </button>

                    {Array.from({ length: pageCount }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentPage(index)}
                        aria-current={
                          currentPage === index ? "page" : undefined
                        }
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition",
                          currentPage === index
                            ? "bg-green-600 text-white shadow-sm"
                            : "border border-gray-200 bg-white text-gray-600 hover:border-green-600 hover:text-green-700",
                        ].join(" ")}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(pageCount - 1, page + 1)
                        )
                      }
                      disabled={currentPage >= pageCount - 1}
                      className="inline-flex items-center gap-2 rounded-full border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                      Next
                      <FaChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </nav>
                )}
              </div>
            </>
          )}
        </PageContainer>
      </PageSection>

      {isOpen ? (
        <GalleryLightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={lightboxSlides}
          index={currentImageIndex}
        />
      ) : null}
    </>
  );
};

export default Gallery;
