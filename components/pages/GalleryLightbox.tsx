"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";

type GalleryLightboxProps = {
  open: boolean;
  close: () => void;
  slides: Array<{ src: string; alt?: string }>;
  index: number;
};

export default function GalleryLightbox({
  open,
  close,
  slides,
  index,
}: GalleryLightboxProps) {
  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides}
      index={index}
      plugins={[Download]}
    />
  );
}
