import Link from "next/link";
import {
  FaArrowRight,
  FaBlog,
  FaEnvelope,
  FaFileAlt,
  FaFilePdf,
  FaQuestionCircle,
  FaImages,
  FaUserFriends,
  FaUsers,
  FaWindowMaximize,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { adminNavGroups } from "@/lib/admin/config";

const overviewIcons: Record<string, IconType> = {
  "/dashboard/hero-slides": FaImages,
  "/dashboard/notice-popup": FaWindowMaximize,
  "/dashboard/blogs": FaBlog,
  "/dashboard/notices": FaFileAlt,
  "/dashboard/faqs": FaQuestionCircle,
  "/dashboard/gallery": FaImages,
  "/dashboard/documents": FaFilePdf,
  "/dashboard/members": FaUserFriends,
  "/dashboard/committee": FaUsers,
  "/dashboard/contact": FaEnvelope,
  "/dashboard/applications": FaEnvelope,
};

export default function DashboardHomePage() {
  const sections = adminNavGroups.filter((group) => group.title);

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-green-200/70 bg-gradient-to-r from-[#e4f7ef] to-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
          Manage all SNDB website content from here. Updates appear on the public site
          right away after you save.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((group) => (
          <section key={group.title}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {group.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => {
                const Icon = overviewIcons[item.href] ?? FaFileAlt;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e4f7ef] text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">{item.label}</h3>
                      <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green-700">
                        Manage
                        <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
