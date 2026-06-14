"use client";

import Image from "next/image";

type SiteInitialLoaderProps = {
  fading?: boolean;
};

export default function SiteInitialLoader({ fading = false }: SiteInitialLoaderProps) {
  return (
    <div
      className={[
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#e4f7ef] via-white to-[#ecfdf5] transition-opacity duration-500 ease-out",
        fading ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
      aria-live="polite"
      aria-busy={!fading}
      role="status"
    >
      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative mb-8 h-24 w-24 sm:h-28 sm:w-28">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" />
          <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
          <div className="absolute inset-2 overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-green-100">
            <Image
              src="/sndblogo1.png"
              alt="SNDB"
              fill
              priority
              className="object-contain p-2"
            />
          </div>
        </div>

        <p className="text-lg font-bold text-green-700 sm:text-xl">SNDB</p>
        <p className="mt-1 max-w-xs text-sm text-gray-600">
          Society of Nepal Doctors of Bangladesh
        </p>

        <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-green-100 sm:w-56">
          <div className="h-full w-1/3 animate-[loader-bar_1.2s_ease-in-out_infinite] rounded-full bg-green-600" />
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-widest text-green-700/80">
          Loading website
        </p>
      </div>
    </div>
  );
}
