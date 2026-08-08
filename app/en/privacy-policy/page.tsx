import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { LegalPlaceholderEn } from "@/components/en/legal-placeholder";

export const metadata: Metadata = buildMetadata(
  {
    title: "Privacy Policy",
    description: "Information on how personal data is handled on this website.",
    robots: { index: false, follow: true },
  },
  "/en/privacy-policy",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <LegalPlaceholderEn
      title="Privacy Policy"
      germanHref="/datenschutz"
      germanLabel="German Datenschutzerklärung"
    />
  );
}
