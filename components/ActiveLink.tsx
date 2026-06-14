"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ActiveLinkProps = {
  href: string;
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children: ReactNode;
  onClick?: () => void;
};

export function ActiveLink({
  href,
  end = false,
  className,
  children,
  onClick,
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = end
    ? pathname === href
    : pathname === href ||
      (href !== "/" && (pathname.startsWith(`${href}/`) || pathname === href));

  const resolvedClass =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link href={href} className={resolvedClass} onClick={onClick}>
      {children}
    </Link>
  );
}
