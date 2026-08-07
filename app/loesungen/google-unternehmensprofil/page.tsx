import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Google Unternehmensprofil",
  description:
    "Professionelle Optimierung Ihres Google Unternehmensprofils für mehr lokale Sichtbarkeit.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Google Unternehmensprofil"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere GBP-Optimierung vor."
    />
  );
}
