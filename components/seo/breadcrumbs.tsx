"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { absoluteUrl } from "@/lib/schema";
import { getBreadcrumbs } from "@/lib/site-structure";

export function Breadcrumbs() {
  const pathname = usePathname();
  const items = getBreadcrumbs(pathname);

  if (!items || items.length < 2) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="border-b border-primary-100 bg-white">
        <Container>
          <nav aria-label="Breadcrumb" className="py-2">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              {items.map((item, index) => {
                const isCurrent = index === items.length - 1;

                return (
                  <li key={item.href} className="flex items-center gap-2">
                    {index > 0 ? <span aria-hidden="true">/</span> : null}
                    {isCurrent ? (
                      <span aria-current="page" className="font-medium text-primary-800">
                        {item.label}
                      </span>
                    ) : (
                      <Link href={item.href} className="hover:text-primary-700">
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </Container>
      </div>
    </>
  );
}
