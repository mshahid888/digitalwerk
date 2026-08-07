import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Webentwicklung",
  description:
    "Moderne, schnelle und conversion-starke Websites für Ihr Unternehmen.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Webentwicklung"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere Webentwicklungs-Leistungen vor."
    />
  );
}
