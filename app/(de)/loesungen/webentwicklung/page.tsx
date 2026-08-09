import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Webentwicklung",
    description:
      "Moderne, schnelle und conversion-starke Websites, die Besucher in Kunden verwandeln. Handwerklich sauber entwickelt statt nur hübsch gestaltet.",
  },
  "/loesungen/webentwicklung",
  { hreflang: { de: "/loesungen/webentwicklung", en: "/en/solutions/web-development" } }
);

const content: ServicePageContent = {
  hero: {
    badge: "Webentwicklung",
    title: "Eine Website, die für Ihr Unternehmen arbeitet",
    description:
      "Nicht nur ein digitales Schaufenster, sondern das Fundament für alles, was danach kommt: Sichtbarkeit, Vertrauen und neue Kunden. Wir entwickeln Websites, die schnell laden, gut aussehen und Besucher zum Handeln bewegen.",
  },
  problem: {
    title: "Ihre Website kostet Sie mehr Kunden, als Sie denken",
    intro:
      "Eine Website, die nicht überzeugt, kostet nicht nur Design-Punkte – sie kostet echte Anfragen.",
    points: [
      {
        title: "Veraltetes Design",
        description:
          "Besucher verlassen Websites, die unprofessionell wirken, innerhalb weniger Sekunden.",
      },
      {
        title: "Langsame Ladezeiten",
        description:
          "Jede Sekunde Wartezeit kostet Besucher – und wird auch von Google negativ bewertet.",
      },
      {
        title: "Schlechte mobile Darstellung",
        description:
          "Die meisten Besucher kommen vom Smartphone. Funktioniert Ihre Website dort nicht, sind sie sofort wieder weg.",
      },
    ],
  },
  solution: {
    title: "Entwicklung mit klarem Ziel: Ergebnisse",
    description:
      "Wir bauen keine Websites, die nur gut aussehen sollen. Jede Seite wird so gestaltet, dass sie Besucher gezielt zu einer Handlung führt – einer Anfrage, einem Anruf, einem Termin.",
    points: [
      "Modernes, professionelles Design",
      "Schnelle Ladezeiten durch technisch sauberen Aufbau",
      "Mobile-optimiert für Smartphone und Tablet",
      "Klare Handlungsaufforderungen auf jeder Seite",
    ],
  },
  benefits: {
    title: "Was eine gute Website für Sie bewirkt",
    items: [
      {
        title: "Mehr Anfragen",
        description:
          "Eine überzeugende Website verwandelt mehr Besucher in Kunden.",
      },
      {
        title: "Professionelles Auftreten",
        description:
          "Ihre Website ist oft der erste Eindruck – er sollte überzeugen.",
      },
      {
        title: "Bessere Grundlage für SEO",
        description:
          "Eine technisch saubere Website ist Voraussetzung für gute Google-Rankings.",
      },
      {
        title: "Weniger Wartungsaufwand",
        description:
          "Sauber entwickelte Websites bereiten langfristig weniger Probleme.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Von der ersten Idee bis zur fertigen Website.",
    items: [
      "Individuelles Design nach Ihrer Marke",
      "Responsive Umsetzung für alle Geräte",
      "Technische Optimierung der Ladezeit",
      "Grundlegende SEO-Struktur",
      "Kontaktformulare & Handlungsaufforderungen",
      "Einweisung in die Pflege der Inhalte",
      "Laufender technischer Support",
    ],
  },
  process: {
    title: "So entsteht Ihre neue Website",
    steps: [
      {
        title: "Konzeption",
        description:
          "Wir klären Ziele, Zielgruppe und Struktur Ihrer neuen Website.",
      },
      {
        title: "Design",
        description:
          "Sie erhalten ein Design, das zu Ihrer Marke passt – vor der technischen Umsetzung.",
      },
      {
        title: "Entwicklung",
        description:
          "Wir setzen die Website technisch sauber und performant um.",
      },
      {
        title: "Launch & Übergabe",
        description:
          "Nach ausführlichem Test gehen wir live – inklusive Einweisung für Sie.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Handwerkliche Sorgfalt",
        description:
          "Wir bauen Websites, die technisch sauber sind – nicht nur hübsch.",
      },
      {
        title: "Ergebnisorientiert",
        description:
          "Jede Designentscheidung dient einem Ziel: mehr Anfragen für Sie.",
      },
      {
        title: "Kein Verschwinden nach dem Launch",
        description:
          "Wir betreuen Ihre Website auch nach dem Start weiter.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zur Webentwicklung",
    items: [
      {
        question: "Wie lange dauert die Entwicklung einer neuen Website?",
        answer:
          "Je nach Umfang meist vier bis acht Wochen – von der Konzeption bis zum Launch.",
      },
      {
        question: "Kann ich die Inhalte später selbst bearbeiten?",
        answer:
          "Ja. Wir richten Ihre Website so ein, dass Sie Texte und Bilder eigenständig aktualisieren können, und erklären Ihnen die Bedienung.",
      },
      {
        question: "Was kostet eine neue Website?",
        answer:
          "Das hängt vom Umfang und den gewünschten Funktionen ab. Im kostenlosen Erstgespräch erhalten Sie ein transparentes Angebot.",
      },
      {
        question: "Übernehmen Sie auch bestehende Websites?",
        answer:
          "Ja, wir überarbeiten auch bestehende Websites, wenn eine Neuentwicklung nicht nötig ist.",
      },
      {
        question: "Ist SEO in der Webentwicklung enthalten?",
        answer:
          "Wir legen bei jeder Website die technische SEO-Grundlage. Für eine umfassende SEO-Betreuung empfehlen wir unsere Local-SEO-Leistung oder DigitalWerk Komplett.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit für eine Website, die überzeugt?",
    title: "Lassen Sie uns über Ihre neue Website sprechen",
    description:
      "Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie, wie eine überzeugende Website Ihrem Unternehmen mehr Anfragen bringt.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
