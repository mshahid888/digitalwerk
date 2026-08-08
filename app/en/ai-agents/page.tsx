import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ComingSoonEn } from "@/components/en/coming-soon";

export const metadata: Metadata = buildMetadata(
  {
    title: "AI Agents",
    description:
      "AI agents for restaurants, clinics, law firms, and more: handle calls, appointment booking, and customer inquiries automatically.",
    robots: { index: false, follow: true },
  },
  "/en/ai-agents",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <ComingSoonEn
      badge="AI Agents"
      title="Less manual work, more customers, handled automatically"
      description="AI agents answer questions, take calls, and book appointments around the clock, so your team spends less time on routine requests."
      germanHref="/ki-agenten"
    />
  );
}
