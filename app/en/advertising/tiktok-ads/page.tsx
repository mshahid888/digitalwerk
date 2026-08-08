import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "TikTok Ads",
    description:
      "Creative short-video campaigns for a large, active audience — honest advice on whether TikTok is right for your business.",
    robots: { index: false, follow: true },
  },
  "/en/advertising/tiktok-ads",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="TikTok Ads"
      title="Reach an audience that classic advertising rarely reaches"
      description="Short, creative video campaigns for a large, active audience — especially effective for visually engaging products or services."
      germanHref="/werbeanzeigen/tiktok-ads"
    />
  );
}
