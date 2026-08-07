import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Impressum",
  description: "Rechtliche Angaben gemäß § 5 TMG.",
  robots: { index: false, follow: true },
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Impressum"
      description="Diese Seite befindet sich in Entwicklung — die rechtlich vorgeschriebenen Angaben folgen in Kürze."
    />
  );
}
