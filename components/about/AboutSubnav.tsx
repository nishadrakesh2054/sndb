"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { aboutNavItems } from "@/lib/aboutNav";

const AboutSubnav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="About section"
      className="mb-8 overflow-x-auto rounded-xl border border-green-200/70 bg-white p-1.5 shadow-sm md:mb-10"
    >
      <ul className="flex min-w-max gap-1 sm:min-w-0 sm:flex-wrap">
        {aboutNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href} className="flex-1 sm:min-w-[calc(50%-0.25rem)] lg:min-w-0">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "block rounded-lg px-3 py-2.5 text-center text-xs font-semibold transition sm:px-4 sm:text-sm",
                  isActive
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#e4f7ef] hover:text-green-800",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AboutSubnav;
