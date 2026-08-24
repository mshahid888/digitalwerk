import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "SEO Agentur",
    description:
      "SEO Agentur für lokales SEO und mehr Sichtbarkeit bei Google und Google Maps – ehrlich beraten, langfristig gedacht. Kostenlose Einschätzung für Ihr Unternehmen.",
  },
  "/loesungen/seo",
  { hreflang: { de: "/loesungen/seo", en: "/en/solutions/seo" } }
);

const content: ServicePageContent = {
  hero: {
    badge: "Local SEO",
    title: "Mehr Sichtbarkeit bei Google – dort, wo Ihre Kunden suchen",
    description:
      "Lokales SEO sorgt dafür, dass Unternehmen wie Ihres bei Google und Google Maps gefunden werden, wenn potenzielle Kunden in Ihrer Region suchen. Kein schneller Trick, sondern eine langfristige Investition in Sichtbarkeit, die bleibt.",
    pricing: {
      price: "299 €",
      period: "/ Monat",
      note: "Transparentes SEO für mehr Sichtbarkeit und relevante Besucher.",
    },
  },
  problem: {
    title: "Gute Arbeit reicht nicht, wenn man Sie nicht findet",
    intro:
      "Viele gute Unternehmen verlieren Kunden nicht wegen ihrer Leistung, sondern weil sie bei Google unsichtbar sind.",
    points: [
      {
        title: "Sie stehen nicht auf Seite 1",
        description:
          "Kunden, die nach Ihrer Leistung suchen, finden zuerst die Konkurrenz.",
      },
      {
        title: "Ihr Google-Profil bleibt unbeachtet",
        description:
          "Ohne Optimierung wird Ihr Eintrag bei Google Maps kaum angezeigt.",
      },
      {
        title: "Unklar, was überhaupt wirkt",
        description:
          "Ohne Strategie bleibt SEO ein Rätsel – Zeit und Budget verpuffen wirkungslos.",
      },
    ],
  },
  solution: {
    title: "Lokales SEO, verständlich erklärt",
    description:
      "Lokales SEO sorgt dafür, dass Google Ihr Unternehmen als relevante Antwort auf lokale Suchanfragen erkennt – etwa „Zahnarzt in Ihrer Stadt“ oder „Restaurant in der Nähe“. Wir optimieren Ihre Website, Ihr Google Unternehmensprofil und die Signale, auf die Google bei lokalen Rankings achtet.",
    points: [
      "Optimierung Ihrer Website für relevante lokale Suchbegriffe",
      "Vollständige Betreuung Ihres Google Unternehmensprofils",
      "Aufbau lokaler Relevanz durch Bewertungen und Einträge",
      "Technische Grundlagen, die Google zuverlässig lesen kann",
    ],
  },
  benefits: {
    title: "Was lokales SEO für Ihr Unternehmen bewirkt",
    items: [
      {
        title: "Mehr Anfragen",
        description:
          "Mehr qualifizierte Besucher, die aktiv nach Ihrer Leistung suchen.",
      },
      {
        title: "Sichtbarkeit bei Google Maps",
        description:
          "Präsenz genau dann, wenn Kunden in Ihrer Nähe suchen.",
      },
      {
        title: "Nachhaltige Ergebnisse",
        description:
          "Anders als Werbeanzeigen wirkt SEO auch nach der Umsetzung weiter.",
      },
      {
        title: "Vertrauen durch Sichtbarkeit",
        description:
          "Eine gute Platzierung wird von Nutzern automatisch mit Vertrauen verbunden.",
      },
    ],
  },
  included: {
    title: "Das ist enthalten",
    intro: "Unsere Local-SEO-Betreuung im Überblick.",
    items: [
      "Analyse der aktuellen Sichtbarkeit",
      "Keyword-Recherche für Ihre Region",
      "On-Page-Optimierung Ihrer Website",
      "Google Unternehmensprofil-Optimierung",
      "Technisches SEO-Grundgerüst",
      "Monatliches Reporting",
      "Laufende Anpassung der Strategie",
    ],
  },
  process: {
    title: "So gehen wir vor",
    steps: [
      {
        title: "Analyse",
        description:
          "Wir prüfen Ihre aktuelle Sichtbarkeit und identifizieren die größten Potenziale.",
      },
      {
        title: "Strategie",
        description:
          "Sie erhalten einen klaren Plan mit realistischen Zielen und Zeithorizont.",
      },
      {
        title: "Umsetzung",
        description:
          "Wir setzen die Optimierungen strukturiert auf Website und Google-Profil um.",
      },
      {
        title: "Monitoring & Optimierung",
        description:
          "Wir beobachten die Entwicklung und passen die Strategie laufend an.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Warum DigitalWerk",
    points: [
      {
        title: "Ehrlich statt versprechend",
        description:
          "Wir machen keine Versprechen, die wir nicht halten können – auch nicht bei Google-Rankings.",
      },
      {
        title: "Verständlich erklärt",
        description:
          "Sie verstehen, was wir tun und warum – ohne Fachchinesisch.",
      },
      {
        title: "Langfristig gedacht",
        description:
          "SEO ist für uns eine Partnerschaft, keine einmalige Maßnahme.",
      },
      {
        title: "Regional verwurzelt",
        description:
          "Mit Sitz in Ansbach betreuen wir Unternehmen in ganz Mittelfranken – von Nürnberg über Fürth bis Rothenburg ob der Tauber.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zu SEO",
    items: [
      {
        question: "Wie lange dauert es, bis SEO wirkt?",
        answer:
          "Erste Verbesserungen am Google-Profil zeigen sich oft innerhalb weniger Wochen. Spürbare Verbesserungen im organischen Suchranking brauchen in der Regel drei bis sechs Monate, nachhaltige Ergebnisse eher sechs bis zwölf Monate. SEO ist eine langfristige Investition, kein schneller Trick.",
      },
      {
        question: "Können Sie mir Platz 1 bei Google garantieren?",
        answer:
          "Nein – seriöse SEO-Agenturen können und sollten keine bestimmte Platzierung garantieren, da Google die Rankingfaktoren nicht offenlegt und regelmäßig ändert. Wir arbeiten mit bewährten, nachhaltigen Methoden, die Ihre Sichtbarkeit nachweislich verbessern.",
      },
      {
        question: "Was ist der Unterschied zwischen SEO und Google Ads?",
        answer:
          "Google Ads bringt sofortige, aber kostenpflichtige Sichtbarkeit. SEO baut organische Sichtbarkeit auf, die auch ohne laufendes Werbebudget bestehen bleibt – dafür braucht sie mehr Zeit.",
      },
      {
        question: "Für welche Unternehmen eignet sich lokales SEO?",
        answer:
          "Für alle Unternehmen mit einem lokalen oder regionalen Kundenstamm – etwa Restaurants, Praxen, Anwälte, Handwerker oder Beauty-Salons.",
      },
      {
        question:
          "Ist SEO auch einzeln buchbar, oder nur mit DigitalWerk Komplett?",
        answer:
          "SEO ist eigenständig buchbar. Für Unternehmen, die zusätzlich Website, Content und Automatisierung benötigen, ist DigitalWerk Komplett oft die wirtschaftlichere Wahl.",
      },
    ],
  },
  cta: {
    eyebrow: "Bereit, gefunden zu werden?",
    title: "Starten Sie mit einer kostenlosen SEO-Einschätzung",
    description:
      "Im unverbindlichen Erstgespräch zeigen wir Ihnen, wo Ihr Unternehmen aktuell steht und welches Potenzial lokales SEO für Sie hat.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} />;
}
