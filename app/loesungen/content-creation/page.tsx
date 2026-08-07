import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "Content Creation",
  description: "Professionelle Website- und SEO-Inhalte, die überzeugen.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="Content Creation"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere Content-Leistungen vor."
    />
  );
}
