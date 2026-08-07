import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Google Ads",
  description:
    "Zielgerichtete Google Ads-Kampagnen für mehr qualifizierte Anfragen.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Google Ads"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere Google-Ads-Leistungen vor."
    />
  );
}
