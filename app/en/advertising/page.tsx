import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "Advertising",
    description:
      "Google Ads, Meta Ads, and TikTok Ads for measurable growth — honest advice, no overblown promises.",
    robots: { index: false, follow: true },
  },
  "/en/advertising",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Advertising"
      title="Advertising measured by results, not promises"
      description="Google Ads, Meta Ads, and TikTok Ads, recommended only when they genuinely fit your business, with clear reporting instead of vague claims."
      germanHref="/werbeanzeigen"
    />
  );
}
