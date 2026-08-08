import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { SkipLink } from "./skip-link";
import { Analytics } from "@/components/analytics/analytics";
import { buildLocalBusinessJsonLd } from "@/lib/schema";

// Shared <body> content for both locale root layouts (app/(de)/layout.tsx,
// app/en/layout.tsx) — keeps the JSON-LD/skip-link/header/main/footer
// composition defined once instead of duplicated per locale.
export function SiteShell({ children }: { children: ReactNode }) {
  const localBusinessJsonLd = buildLocalBusinessJsonLd();

  return (
    <>
      {localBusinessJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
      ) : null}
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1 scroll-mt-20">
        {children}
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
