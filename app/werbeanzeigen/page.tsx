import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { PageIntro } from "@/components/shared/page-intro";
import {
  ComparisonList,
  type ComparisonItem,
} from "@/components/shared/comparison-list";

export const metadata: Metadata = buildMetadata(
  {
    title: "Werbeanzeigen",
    description:
      "Google Ads, Meta Ads und TikTok Ads für messbares Wachstum – ehrlich beraten, ohne übertriebene Versprechen.",
  },
  "/werbeanzeigen"
);

const channels: ComparisonItem[] = [
  {
    title: "Google Ads",
    description:
      "Ihre Anzeige erscheint genau dann, wenn jemand aktiv nach Ihrer Leistung sucht.",
    highlight:
      "Sie schnelle Sichtbarkeit bei bereits bestehender Nachfrage möchten.",
    href: "/werbeanzeigen/google-ads",
  },
  {
    title: "Meta Ads",
    description:
      "Kampagnen auf Facebook und Instagram, die neue Zielgruppen nach Interessen und Region erreichen.",
    highlight:
      "Sie neue Kunden erreichen möchten, die noch nicht aktiv suchen.",
    href: "/werbeanzeigen/meta-ads",
  },
  {
    title: "TikTok Ads",
    description:
      "Kurze, kreative Videoinhalte für ein großes, aktives und oft jüngeres Publikum.",
    highlight:
      "Ihr Angebot visuell ansprechend ist und eine jüngere Zielgruppe erreichen soll.",
    href: "/werbeanzeigen/tiktok-ads",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        badge="Werbeanzeigen"
        title="Werbung, die sich an Ergebnissen messen lässt"
        description="Google Ads, Meta Ads und TikTok Ads bringen Ihr Unternehmen vor die richtige Zielgruppe – mit klaren Kennzahlen statt vager Versprechen. Wir empfehlen jeden Kanal nur dann, wenn er wirklich zu Ihrem Unternehmen passt, und verzichten bewusst auf übertriebene ROI-Zusagen."
      />

      <ComparisonList
        title="Welcher Kanal passt zu Ihnen?"
        intro="Jeder Kanal erreicht Kunden auf eine andere Art. Oft ist eine Kombination sinnvoll."
        highlightLabel="Am besten, wenn"
        items={channels}
        tone="default"
      />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Nicht sicher, welcher Kanal passt?"
          title="Wir beraten Sie ehrlich und unverbindlich"
          description="Im kostenlosen Erstgespräch schauen wir gemeinsam, welche Werbeanzeigen für Ihr Unternehmen wirklich sinnvoll sind."
          secondaryHref="/kontakt"
        />
      </div>
    </>
  );
}
