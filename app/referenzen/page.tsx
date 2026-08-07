import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Referenzen",
  description:
    "Einblicke in Projekte und Ergebnisse, die wir für unsere Kunden erzielt haben.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Referenzen"
      description="Diese Seite befindet sich in Entwicklung — hier zeigen wir bald unsere Kundenprojekte und Ergebnisse."
    />
  );
}
