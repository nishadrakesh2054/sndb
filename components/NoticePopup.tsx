"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { NoticePopup as NoticePopupData } from "@/utils/supabase/noticePopup";
import { getMediaUrl } from "@/lib/mediaUrl";

type NoticePopupProps = {
  popup: NoticePopupData | null;
};

export default function NoticePopup({ popup }: NoticePopupProps) {
  const [showPopup, setShowPopup] = useState(Boolean(popup));

  if (!showPopup || !popup?.image) return null;

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

        <img
          src={getMediaUrl(popup.image)}
          alt="Organization notice"
          className="max-h-[85vh] w-full rounded-lg bg-white object-contain shadow-lg"
        />
      </div>
    </div>
  );
}
