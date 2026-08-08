import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "References",
    description:
      "A look at the kinds of projects DigitalWerk works on. Real client references are on their way.",
    robots: { index: false, follow: true },
  },
  "/en/references",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="References"
      title="Our work"
      description="DigitalWerk is a young, growing company. Real client projects and results will be published here as they're completed."
      germanHref="/referenzen"
    />
  );
}
