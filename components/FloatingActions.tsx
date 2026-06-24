"use client";

import Link from "next/link";
import { FaCommentDots, FaWhatsapp } from "react-icons/fa";
import { site } from "@/lib/site";

const actions = [
  {
    icon: FaWhatsapp,
    label: "Call us",
    href: site.social.whatsapp,
    external: true,
    className: "bg-[#25D366] hover:bg-[#1ebe57]",
  },
  {
    icon: FaCommentDots,
    label: "Feedback",
    href: "/contact",
    external: false,
    className: "bg-green-600 hover:bg-green-700",
  },
] as const;

const FloatingActions = () => (
  <div
    className="fixed bottom-4 right-3 z-40 flex flex-col-reverse items-end gap-1.5 sm:bottom-5 sm:right-4"
    aria-label="Quick contact actions"
  >
    {actions.map(({ icon: Icon, label, href, external, className }) => {
      const content = (
        <>
          <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
            {label}
          </span>
          <Icon className="h-[22px] w-[22px] text-white" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </>
      );

      const sharedClass = [
        "group relative flex h-[45px] w-[45px] items-center justify-center rounded-full text-white shadow-md transition-transform duration-200 hover:scale-105",
        className,
      ].join(" ");

      if (external) {
        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={sharedClass}
          >
            {content}
          </a>
        );
      }

      return (
        <Link key={label} href={href} className={sharedClass}>
          {content}
        </Link>
      );
    })}
  </div>
);

export default FloatingActions;
