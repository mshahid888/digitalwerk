import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "Google Ads",
    description:
      "Google Ads campaigns for customers who are already actively searching for your service.",
    robots: { index: false, follow: true },
  },
  "/en/advertising/google-ads",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Google Ads"
      title="Reach customers at the exact moment they search"
      description="Google Ads puts your business in front of people actively searching for what you offer — one of the most direct paths to new inquiries."
      germanHref="/werbeanzeigen/google-ads"
    />
  );
}
