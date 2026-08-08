import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "SEO",
    description:
      "Local SEO for better visibility on Google and Google Maps — honest advice, built for the long term.",
    robots: { index: false, follow: true },
  },
  "/en/solutions/seo",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Local SEO"
      title="Get found on Google, where your customers are searching"
      description="Local SEO helps businesses like yours show up on Google Search and Google Maps when nearby customers are looking for what you offer."
      germanHref="/loesungen/seo"
    />
  );
}
