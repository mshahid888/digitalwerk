import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "SEO",
  description:
    "Lokales SEO, das Ihr Unternehmen bei Google und Google Maps sichtbarer macht.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="SEO"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere Local-SEO-Leistungen vor."
    />
  );
}
