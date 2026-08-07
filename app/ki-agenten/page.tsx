import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "KI-Agenten",
  description:
    "KI-gestützte Automatisierung für Kundenservice, Terminbuchung und Lead-Qualifizierung.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="KI-Agenten"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere KI-Automatisierungslösungen vor."
    />
  );
}
