import type { Metadata } from "next";
import type { ReactNode } from "react";
import { geistSans, geistMono } from "@/lib/fonts";
import { SiteShell } from "@/components/layout/site-shell";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

// Independent root layout for the /en/* tree — see app/(de)/layout.tsx for
// why there are two root layouts instead of one shared app/layout.tsx.
export const metadata: Metadata = buildMetadata({}, "/en", {
  locale: "en_US",
});

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
