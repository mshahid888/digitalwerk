import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "TikTok Ads",
  description: "Kreative Kampagnen, die Ihre Zielgruppe auf TikTok erreichen.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="TikTok Ads"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere TikTok-Ads-Leistungen vor."
    />
  );
}
