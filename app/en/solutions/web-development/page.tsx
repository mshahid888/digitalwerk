import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "Web Development",
    description:
      "Modern, fast, conversion-focused websites, built to turn visitors into customers.",
    robots: { index: false, follow: true },
  },
  "/en/solutions/web-development",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="Web Development"
      title="A website that works for your business"
      description="Fast, modern, conversion-focused websites, built to turn visitors into customers rather than just look good."
      germanHref="/loesungen/webentwicklung"
    />
  );
}
