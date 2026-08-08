import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "Meta Ads",
    description:
      "Facebook and Instagram campaigns that reach new audiences, not just people already searching for you.",
    robots: { index: false, follow: true },
  },
  "/en/advertising/meta-ads",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Meta Ads"
      title="Reach customers before they start searching"
      description="Facebook and Instagram campaigns that reach new audiences by interest and location, not just people already looking for you."
      germanHref="/werbeanzeigen/meta-ads"
    />
  );
}
