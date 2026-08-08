import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "E-Commerce",
    description:
      "Online store on Shopify or WooCommerce, connected to Amazon, eBay, and TikTok Shop — sell more, manage less.",
    robots: { index: false, follow: true },
  },
  "/en/e-commerce",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="E-Commerce"
      title="Sell more, online and on every marketplace"
      description="Shopify and WooCommerce stores connected to Amazon, eBay, and TikTok Shop, so you sell more with less manual admin work."
      germanHref="/e-commerce"
    />
  );
}
