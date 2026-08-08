import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { LegalPlaceholderEn } from "@/components/en/legal-placeholder";

export const metadata: Metadata = buildMetadata(
  {
    title: "Cookie Policy",
    description:
      "Information on which cookies and similar technologies this website currently uses.",
    robots: { index: false, follow: true },
  },
  "/en/cookie-policy",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <LegalPlaceholderEn
      title="Cookie Policy"
      germanHref="/cookie-richtlinie"
      germanLabel="German Cookie-Richtlinie"
    />
  );
}
