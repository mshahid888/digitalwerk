import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "About",
    description:
      "DigitalWerk is your long-term digital partner — learn about our mission, our values, and how we work with businesses.",
    robots: { index: false, follow: true },
  },
  "/en/about",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="About us"
      title="Your long-term partner for digital growth"
      description="DigitalWerk isn't an agency that ticks off projects. We're a partner that supports businesses in Germany for the long run, honestly and transparently."
      germanHref="/ueber-uns"
    />
  );
}
