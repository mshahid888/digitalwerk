import type { Metadata } from "next";
import type { ReactNode } from "react";
import { geistSans, geistMono } from "@/lib/fonts";
import { SiteShell } from "@/components/layout/site-shell";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

// This route group has no shared ancestor layout with app/en/ (see
// app/en/layout.tsx) — each is its own independent root, so each owns its
// own <html lang> statically, without middleware or headers(). Route
// groups are invisible in the URL, so every page below still resolves at
// its existing, unprefixed path (e.g. /loesungen/seo, not /de/loesungen/seo).
export const metadata: Metadata = buildMetadata();

export default function GermanLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
