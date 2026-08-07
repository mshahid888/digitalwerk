import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Kontakt",
  description: "Vereinbaren Sie Ihre kostenlose Beratung mit DigitalWerk.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Kontakt"
      description="Diese Seite befindet sich in Entwicklung — hier finden Sie bald Kontaktformular, WhatsApp, E-Mail, Telefon und Anfahrt."
    />
  );
}
