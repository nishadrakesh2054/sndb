"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getActiveNoticePopup } from "@/utils/supabase/noticePopup";
import { getMediaUrl } from "@/lib/mediaUrl";

export default function NoticePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPopup = async () => {
      try {
        const data = await getActiveNoticePopup();
        if (!cancelled && data) {
          setImageUrl(data.image);
          setShowPopup(true);
        }
      } catch {
        // Popup is optional; fail silently.
      }
    };

    loadPopup();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!showPopup || !imageUrl) return null;

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
        onClick={(e) => e.stopPropagation()}
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
          src={getMediaUrl(imageUrl)}
          alt="Organization notice"
          className="max-h-[85vh] w-full rounded-lg bg-white object-contain shadow-lg"
        />
      </div>
    </div>
  );
}
