"use client";

import Image from "next/image";
import { canOptimizeImage, getOptimizedImageSrc } from "@/lib/image";

type MediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
};

export default function MediaImage({
  src,
  alt,
  className = "",
  priority = false,
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: MediaImageProps) {
  const url = getOptimizedImageSrc(src);

  if (!url) return null;

  if (!canOptimizeImage(src)) {
    return (
      <img
        src={url}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
