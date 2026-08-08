import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "Content Creation",
    description:
      "Professional website and SEO content that convinces and ranks on Google.",
    robots: { index: false, follow: true },
  },
  "/en/solutions/content-creation",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Content Creation"
      title="Words that convince, and get found"
      description="We write website and SEO content that explains your services clearly, builds trust, and ranks on Google."
      germanHref="/loesungen/content-creation"
    />
  );
}
