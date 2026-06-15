"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaBlog,
  FaEnvelope,
  FaFileAlt,
  FaFilePdf,
  FaQuestionCircle,
  FaHome,
  FaImages,
  FaSignOutAlt,
  FaTimes,
  FaUserFriends,
  FaUsers,
  FaWindowMaximize,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { adminNavGroups } from "@/lib/admin/config";
import { signOut } from "@/utils/supabase/auth";

const navIcons: Record<string, IconType> = {
  "/dashboard": FaHome,
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

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {adminNavGroups.map((group) => (
        <div key={group.title || "overview"}>
          {group.title ? (
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {group.title}
            </p>
          ) : null}
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = navIcons[item.href] ?? FaFileAlt;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={[
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-green-600 text-white shadow-sm shadow-green-600/20"
                        : "text-gray-600 hover:bg-[#e4f7ef] hover:text-green-800",
                    ].join(" ")}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-green-600"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const sidebarFooter = (
    <div className="shrink-0 space-y-2 border-t border-gray-200 p-4">
      <Link
        href="/"
        target="_blank"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-300 hover:bg-[#e4f7ef] hover:text-green-800"
      >
        View website
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
      >
        <FaSignOutAlt className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );

  const sidebarHeader = (
    <div className="shrink-0 border-b border-gray-200 px-4 py-5">
      <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#e4f7ef] ring-1 ring-green-200">
          <Image src="/sndblogo1.png" alt="SNDB" fill className="object-contain p-1" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900">SNDB Admin</p>
          <p className="truncate text-xs text-gray-500">Content Dashboard</p>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-md bg-[#e4f7ef]">
            <Image src="/sndblogo1.png" alt="SNDB" fill className="object-contain p-0.5" />
          </div>
          <span className="text-sm font-bold text-gray-900">SNDB Admin</span>
        </Link>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
        >
          {mobileOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebarHeader}
        <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        {sidebarFooter}
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
