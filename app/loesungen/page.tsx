import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Lösungen",
  description:
    "Ein Überblick über unsere Lösungen — von DigitalWerk Komplett bis zu einzelnen Leistungen wie SEO, Webentwicklung und Content Creation.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Lösungen"
      description="Diese Seite befindet sich in Entwicklung — hier finden Sie bald alle Lösungen von DigitalWerk im Überblick."
    />
  );
}
