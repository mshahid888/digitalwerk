"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { AnchorHTMLAttributes, ReactNode } from "react";

// Thin wrapper around next/link that sets aria-current="page" when the
// link's href matches the current route. Kept as its own small client
// component so the server-rendered nav shells (DesktopNav, Footer) don't
// have to become client components themselves — only this leaf does.
type ActiveLinkProps = {
  href: Route;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

export function ActiveLink({ href, className, children, ...rest }: ActiveLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}
