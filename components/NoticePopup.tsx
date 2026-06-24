"use client";

import Link from "next/link";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { NoticePopup as NoticePopupData } from "@/utils/supabase/noticePopup";
import { getMediaUrl } from "@/lib/mediaUrl";

type NoticePopupProps = {
  popup: NoticePopupData | null;
};

const normalizeLink = (link: string) => {
  const trimmed = link.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const isExternalLink = (href: string) =>
  href.startsWith("http://") || href.startsWith("https://");

export default function NoticePopup({ popup }: NoticePopupProps) {
  const [showPopup, setShowPopup] = useState(Boolean(popup));

  if (!showPopup || !popup?.image) return null;

  const href = popup.link ? normalizeLink(popup.link) : "";
  const image = (
    <img
      src={getMediaUrl(popup.image)}
      alt="Organization notice"
      className={[
        "max-h-[85vh] w-full rounded-lg bg-white object-contain shadow-lg",
        href ? "cursor-pointer transition hover:opacity-95" : "",
      ].join(" ")}
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setShowPopup(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Notice"
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowPopup(false)}
          aria-label="Close notice"
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-100"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        {href ? (
          isExternalLink(href) ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowPopup(false)}
            >
              {image}
            </a>
          ) : (
            <Link href={href} onClick={() => setShowPopup(false)}>
              {image}
            </Link>
          )
        ) : (
          image
        )}
      </div>
    </div>
  );
}
