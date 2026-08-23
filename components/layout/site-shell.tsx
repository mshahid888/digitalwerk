import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { SkipLink } from "./skip-link";
import { Analytics } from "@/components/analytics/analytics";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationJsonLd } from "@/lib/schema";
import type { Locale } from "@/lib/i18n-routes";

// Shared <body> content for both locale root layouts (app/(de)/layout.tsx,
// app/en/layout.tsx) — keeps the JSON-LD/skip-link/header/main/footer
// composition defined once instead of duplicated per locale.
export function SiteShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const organizationJsonLd = buildOrganizationJsonLd(locale);

  return (
    <>
      {organizationJsonLd ? <JsonLd data={organizationJsonLd} /> : null}
      <SkipLink />
      <Header />
      <Breadcrumbs />
      <main id="main-content" className="flex-1 scroll-mt-20">
        {children}
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
