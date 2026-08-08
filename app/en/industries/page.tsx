import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "Industries",
    description:
      "Digital solutions for restaurants, clinics, hotels, trades, law firms, and more — tailored, not off the shelf.",
    robots: { index: false, follow: true },
  },
  "/en/industries",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Industries"
      title="Digital solutions built around your industry"
      description="From restaurants to law firms, we tailor website, SEO, and advertising strategy to the customers and search behavior specific to your industry."
      germanHref="/branchen"
    />
  );
}
