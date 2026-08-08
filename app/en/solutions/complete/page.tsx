import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "DigitalWerk Complete",
    description:
      "Your complete digital department, from one partner — website, SEO, Google Business Profile, content, and AI automation.",
    robots: { index: false, follow: true },
  },
  "/en/solutions/complete",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="DigitalWerk Complete"
      title="Your complete digital department — from one partner"
      description="Website, SEO, Google Business Profile, content, and AI automation, delivered as one ongoing partnership instead of five separate vendors."
      germanHref="/loesungen/digitalwerk-komplett"
    />
  );
}
