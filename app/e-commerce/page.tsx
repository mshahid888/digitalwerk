import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export const metadata: Metadata = buildMetadata({
  title: "E-Commerce",
  description:
    "Shopify, WooCommerce, Marketplace-Integration und KI-Automatisierung für Online-Shops.",
});

export default function Page() {
  return (
    <RoutePlaceholder
      title="E-Commerce"
      description="Diese Seite befindet sich in Entwicklung — hier stellen wir bald unsere E-Commerce-Leistungen vor."
    />
  );
}
