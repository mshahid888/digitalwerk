import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Über uns",
  description:
    "Erfahren Sie, wer hinter DigitalWerk steht und wie wir deutsche Unternehmen beim digitalen Wachstum unterstützen.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Über uns"
      description="Diese Seite befindet sich in Entwicklung — hier erfahren Sie bald mehr über unsere Mission, unser Team und unseren Prozess."
    />
  );
}
