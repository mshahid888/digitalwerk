import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "DigitalWerk Komplett",
  description:
    "Unsere Flaggschiff-Lösung: Website, SEO, Google Unternehmensprofil, Content, KI-Automatisierung und Support aus einer Hand.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="DigitalWerk Komplett"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere Komplettlösung im Detail vor."
    />
  );
}
