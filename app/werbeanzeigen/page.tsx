import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Werbeanzeigen",
  description:
    "Messbare Leads und Umsatz durch Google Ads, Meta Ads und TikTok Ads.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Werbeanzeigen"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere Werbeanzeigen-Kanäle vor."
    />
  );
}
