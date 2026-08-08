import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "Google Business Profile",
    description:
      "Professional optimization of your Google Business Profile for better rankings, more reviews, and more inquiries.",
    robots: { index: false, follow: true },
  },
  "/en/solutions/google-business-profile",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Google Business Profile"
      title="The fastest way to more local visibility"
      description="We optimize your Google Business Profile so it's complete, accurate, and convincing — often the first thing potential customers see."
      germanHref="/loesungen/google-unternehmensprofil"
    />
  );
}
