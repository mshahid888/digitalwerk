import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { LegalPlaceholderEn } from "@/components/en/legal-placeholder";

export const metadata: Metadata = buildMetadata(
  {
    title: "Imprint",
    description: "Legal disclosure information for this website.",
    robots: { index: false, follow: true },
  },
  "/en/imprint",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <LegalPlaceholderEn
      title="Imprint"
      germanHref="/impressum"
      germanLabel="German Impressum"
    />
  );
}
