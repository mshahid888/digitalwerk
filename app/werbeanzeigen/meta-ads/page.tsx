import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Meta Ads",
  description: "Wirkungsvolle Kampagnen auf Facebook und Instagram.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Meta Ads"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere Meta-Ads-Leistungen vor."
    />
  );
}
