import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Datenschutzerklärung",
  description:
    "Informationen zum Umgang mit personenbezogenen Daten auf dieser Website.",
  robots: { index: false, follow: true },
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Datenschutzerklärung"
      description="Diese Seite befindet sich in Entwicklung — die vollständige Datenschutzerklärung folgt in Kürze."
    />
  );
}
