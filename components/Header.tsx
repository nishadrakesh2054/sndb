"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { usePathname } from "next/navigation"
import { ActiveLink } from "@/components/ActiveLink";

type ActiveLinkItem = {
  label: string;
  to: string;
};

type NavDropdown = {
  label: string;
  items: ActiveLinkItem[];
};

type NavItem = ActiveLinkItem | NavDropdown;

const isDropdown = (item: NavItem): item is NavDropdown => "items" in item;

const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "President's Message", to: "/executive-message" },
  {
    label: "Committee",
    items: [
      { label: "Executive Committee", to: "/executive-comimttee" },
      { label: "Past Executive Committee", to: "/past-committee" },
    ],
  },
  {
    label: "Members",
    items: [
      { label: "Life Members", to: "/member" },
      { label: "Membership Info", to: "/register-member" },
    ],
  },
  { label: "Blogs", to: "/blog" },
  { label: "Notice", to: "/notice" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const isDropdownActive = (items: ActiveLinkItem[], pathname: string) =>
  items.some((item) => pathname === item.to);

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "relative px-1 py-2 text-sm font-medium transition-colors",
    isActive
      ? "text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-red-400"
      : "text-green-50 hover:text-white",
  ].join(" ");

const dropdownLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
    isActive
      ? "bg-green-50 font-medium text-green-800"
      : "text-gray-700 hover:bg-green-50 hover:text-green-800",
  ].join(" ");

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );
  const pathname = usePathname();

  const openMenu = () => {
    setOpenMobileDropdown(null);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenMobileDropdown(null);
  };

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown((current) => (current === label ? null : label));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-green-800/30 bg-gradient-to-r from-green-800 via-green-600 to-green-800 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Mobile branding */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90"
          >
            <img
              src="/sndblogo1.png"
              alt="SNDB Logo"
              className="h-14 w-14 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold leading-tight">
                सोसाइटी फर नेप्लिज डॉक्टर्स फ्रॉम बंगलादेश
              </h1>
              <p className="truncate text-[11px] text-green-100">
                Society For Nepalese Doctors from Bangladesh
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => (isOpen ? closeMenu() : openMenu())}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden flex-grow items-center justify-center gap-6 lg:gap-8 md:flex">
          {navItems.map((item) =>
            isDropdown(item) ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className={[
                    "flex items-center gap-1 px-1 py-2 text-sm font-medium transition-colors",
                    isDropdownActive(item.items, pathname)
                      ? "text-white"
                      : "text-green-50 hover:text-white",
                  ].join(" ")}
                  aria-haspopup="true"
                >
                  {item.label}
                  <FaChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Hover bridge + dropdown panel */}
                <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="min-w-[240px] overflow-hidden rounded-lg border border-green-100 bg-white py-1 shadow-xl">
                    {item.items.map((subItem) => (
                      <ActiveLink
                        key={subItem.to}
                        href={subItem.to}
                        className={dropdownLinkClass}
                      >
                        {subItem.label}
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ActiveLink
                key={item.to}
                href={item.to}
                end={item.to === "/"}
                className={navLinkClass}
              >
                {item.label}
              </ActiveLink>
            )
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="border-t border-white/15 md:hidden">
          <div className="max-h-[70vh] overflow-y-auto pl-6 pr-4">
            {navItems.map((item) =>
              isDropdown(item) ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleMobileDropdown(item.label)}
                    aria-expanded={openMobileDropdown === item.label}
                    className="flex w-full items-center gap-3 border-b border-white/10 py-3.5 text-left text-sm text-white/90"
                  >
                    <FaChevronRight className="h-3 w-3 shrink-0 text-white/45" />
                    <span
                      className={[
                        "flex-1",
                        isDropdownActive(item.items, pathname)
                          ? "font-medium text-white"
                          : "",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                    <FaChevronDown
                      className={[
                        "h-3 w-3 shrink-0 text-white/50 transition-transform duration-200",
                        openMobileDropdown === item.label ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  {openMobileDropdown === item.label && (
                    <div className="border-b border-white/10 bg-black/10">
                      {item.items.map((subItem) => (
                        <ActiveLink
                          key={subItem.to}
                          href={subItem.to}
                          onClick={closeMenu}
                          className={({ isActive }) =>
                            [
                              "flex items-center gap-3 border-b border-white/5 py-2.5 pl-6 text-sm last:border-b-0",
                              isActive
                                ? "font-medium text-white"
                                : "text-white/70",
                            ].join(" ")
                          }
                        >
                          <FaChevronRight className="h-2.5 w-2.5 shrink-0 text-white/35" />
                          {subItem.label}
                        </ActiveLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <ActiveLink
                  key={item.to}
                  href={item.to}
                  end={item.to === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 border-b border-white/10 py-3.5 text-sm",
                      isActive
                        ? "font-medium text-white"
                        : "text-white/90",
                    ].join(" ")
                  }
                >
                  <FaChevronRight className="h-3 w-3 shrink-0 text-white/45" />
                  {item.label}
                </ActiveLink>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
