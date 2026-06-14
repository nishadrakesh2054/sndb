"use client";

import { useEffect, useState } from "react";
import SiteInitialLoader from "@/components/SiteInitialLoader";

const MIN_DISPLAY_MS = 700;
const FADE_MS = 500;

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    let cancelled = false;

    const revealSite = () => {
      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

      window.setTimeout(() => {
        if (cancelled) return;
        setFading(true);
        window.setTimeout(() => {
          if (cancelled) return;
          setShowLoader(false);
          setVisible(true);
        }, FADE_MS);
      }, delay);
    };

    if (document.readyState === "complete") {
      revealSite();
    } else {
      window.addEventListener("load", revealSite, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", revealSite);
    };
  }, []);

  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  return (
    <>
      {showLoader ? <SiteInitialLoader fading={fading} /> : null}
      <div
        className={[
          "transition-opacity duration-500 ease-out",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {children}
      </div>
    </>
  );
}
