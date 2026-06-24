"use client";

import { useState } from "react";
import { FaChevronDown, FaMobileAlt, FaQrcode } from "react-icons/fa";
import { site } from "@/lib/site";

const displayPhone = site.phone.replace(/^(\+977)(\d+)/, "$1 $2");

const wallets = [
  {
    id: "esewa",
    name: "eSewa",
    className: "bg-[#60bb46]",
  },
  {
    id: "khalti",
    name: "Khalti",
    className: "bg-[#5C3386]",
  },
] as const;

const PaymentQrSection = () => {
  const [showQr, setShowQr] = useState(false);

  return (
    <section className="space-y-4 border-t border-gray-200 pt-8">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          eSewa / Khalti
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {wallets.map((wallet) => (
            <a
              key={wallet.id}
              href={`tel:${site.phone}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-green-300 hover:shadow-md"
            >
              <span
                className={[
                  "flex h-10 min-w-[2.75rem] shrink-0 items-center justify-center rounded-lg px-1.5 text-[9px] font-bold leading-tight text-white shadow-sm sm:text-[10px]",
                  wallet.className,
                ].join(" ")}
              >
                {wallet.name}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                  <FaMobileAlt className="h-3 w-3 text-green-600" aria-hidden="true" />
                  {wallet.name}
                </span>
                <span className="mt-0.5 block font-mono text-sm font-medium text-gray-900">
                  {displayPhone}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowQr((open) => !open)}
        aria-expanded={showQr}
        className={[
          "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
          showQr
            ? "border-green-400 bg-emerald-50 shadow-sm"
            : "border-green-200/80 bg-emerald-50/40 hover:border-green-300 hover:bg-emerald-50/70",
        ].join(" ")}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white shadow-sm">
            <FaQrcode className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-green-800">
              Click to scan QR
            </span>
            <span className="mt-0.5 block text-xs text-gray-500">
              View payment QR code for membership fee
            </span>
          </span>
        </span>
        <FaChevronDown
          className={[
            "h-4 w-4 shrink-0 text-green-700 transition-transform duration-200",
            showQr ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      {showQr ? (
        <div className="overflow-hidden rounded-xl border border-green-200/80 bg-white p-3 shadow-sm">
          <img
            src="/qr.jpg"
            alt="Payment QR code"
            className="w-full rounded-lg object-contain"
          />
        </div>
      ) : null}
    </section>
  );
};

export default PaymentQrSection;
