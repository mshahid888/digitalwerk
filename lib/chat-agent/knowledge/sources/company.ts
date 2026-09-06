import { entry } from "./helpers";
import type { KnowledgeEntry } from "../types";

const SITE = "https://www.digitalwerkk.de";

// Company facts. Contact details are `approved` (confirmed real address in
// lib/site-config.ts, addressConfirmed: true). Positioning / mission / values
// are `provisional` — transcribed from /ueber-uns.

export const companyEntries: KnowledgeEntry[] = [
  entry({
    id: "company-overview-de",
    collection: "company",
    language: "de",
    title: "Über DigitalWerk",
    body: "DigitalWerk ist ein digitaler Wachstumspartner für Unternehmen in Deutschland. Angeboten werden Webentwicklung, lokales SEO, Google Unternehmensprofil, Content, Werbeanzeigen, KI-Automatisierung und E-Commerce – aus einer Hand. DigitalWerk versteht sich nicht als Agentur für Einzelprojekte, sondern als langfristiger Partner mit einem festen Ansprechpartner pro Kunde.",
    keywords: ["digitalwerk", "über uns", "wer seid ihr", "was macht ihr", "agentur", "wachstumspartner"],
    source: `${SITE}/ueber-uns`,
  }),
  entry({
    id: "company-overview-en",
    collection: "company",
    language: "en",
    title: "About DigitalWerk",
    body: "DigitalWerk is a digital growth partner for businesses in Germany, offering web development, local SEO, Google Business Profile, content, advertising, AI automation and e-commerce from a single partner. DigitalWerk positions itself as a long-term partner with one dedicated contact per client rather than a project-by-project agency.",
    keywords: ["digitalwerk", "about", "who are you", "what do you do", "agency", "growth partner"],
    source: `${SITE}/en/about`,
  }),
  entry({
    id: "company-mission-de",
    collection: "company",
    language: "de",
    title: "Mission und Vision",
    body: "Mission: deutschen Unternehmen helfen, online sichtbar zu werden, mehr Kunden zu gewinnen und Zeit durch smarte Automatisierung zurückzugewinnen – mit Lösungen, die zusammenpassen. Vision: der digitale Partner sein, auf den kleine und mittelständische Unternehmen langfristig zählen können.",
    keywords: ["mission", "vision", "ziel", "philosophie"],
    source: `${SITE}/ueber-uns`,
  }),
  entry({
    id: "company-values-de",
    collection: "company",
    language: "de",
    title: "Werte von DigitalWerk",
    body: "Werte: professionell, premium, modern, schnell, verlässlich, transparent, ergebnisorientiert und auf langfristige Partnerschaft ausgerichtet. DigitalWerk gibt keine Versprechen, die es nicht halten kann, und empfiehlt nur, was dem Unternehmen wirklich nutzt.",
    keywords: ["werte", "values", "prinzipien", "wie arbeitet ihr"],
    source: `${SITE}/ueber-uns`,
  }),
  entry({
    id: "company-values-en",
    collection: "company",
    language: "en",
    title: "DigitalWerk values",
    body: "Values: professional, premium, modern, fast, reliable, transparent, result-oriented and focused on long-term partnership. DigitalWerk avoids promises it cannot keep and recommends only what genuinely helps the business.",
    keywords: ["values", "principles", "how do you work"],
    source: `${SITE}/en/about`,
  }),
  entry({
    id: "company-model-de",
    collection: "company",
    language: "de",
    title: "Arbeitsweise",
    body: "Ablauf: Kennenlernen im kostenlosen Erstgespräch, dann eine auf das Unternehmen zugeschnittene Strategie, strukturierte Umsetzung und laufende Betreuung mit festem Ansprechpartner. Das Erstgespräch ist kostenlos und unverbindlich; Rückmeldungen erfolgen in der Regel innerhalb eines Werktages.",
    keywords: ["ablauf", "prozess", "wie läuft das ab", "erstgespräch", "beratung", "kostenlos"],
    source: `${SITE}/ueber-uns`,
    approvalStatus: "approved",
  }),
  entry({
    id: "company-model-en",
    collection: "company",
    language: "en",
    title: "How DigitalWerk works",
    body: "Process: a free initial consultation to get to know the business, then a tailored strategy, structured implementation and ongoing support with a dedicated contact. The initial consultation is free and non-binding; replies are typically within one business day.",
    keywords: ["process", "how does it work", "consultation", "free", "onboarding"],
    source: `${SITE}/en/about`,
    approvalStatus: "approved",
  }),
  entry({
    id: "company-geography-de",
    collection: "company",
    language: "de",
    title: "Standort und Einzugsgebiet",
    body: "DigitalWerk hat seinen Sitz in Ansbach (Martin-Luther-Platz 14, 91522 Ansbach) und betreut Unternehmen in ganz Mittelfranken und Bayern – unter anderem Nürnberg, Fürth und Rothenburg ob der Tauber – sowie deutschlandweit.",
    keywords: ["standort", "adresse", "ansbach", "wo seid ihr", "region", "einzugsgebiet", "mittelfranken"],
    source: `${SITE}/ueber-uns`,
    approvalStatus: "approved",
    sensitivity: "low",
  }),
  entry({
    id: "company-contact-de",
    collection: "company",
    language: "both",
    title: "Kontaktdaten / Contact details",
    body: "Telefon / Phone: +49 160 5667490. E-Mail: info@digitalwerkk.de. Adresse / Address: Martin-Luther-Platz 14, 91522 Ansbach. WhatsApp-Kontakt wird angeboten. Kontaktseite / contact page: https://www.digitalwerkk.de/kontakt (DE) · https://www.digitalwerkk.de/en/contact (EN). Das Erstgespräch ist kostenlos und unverbindlich.",
    keywords: ["kontakt", "contact", "telefon", "phone", "email", "adresse", "address", "whatsapp", "anrufen", "call"],
    source: `${SITE}/kontakt`,
    approvalStatus: "approved",
  }),
  entry({
    id: "company-response-time-de",
    collection: "company",
    language: "both",
    title: "Reaktionszeit / Response time",
    body: "DigitalWerk antwortet in der Regel innerhalb eines Werktages. / DigitalWerk usually replies within one business day.",
    keywords: ["wie schnell", "antwort", "reaktionszeit", "response time", "how fast", "reply"],
    source: `${SITE}/kontakt`,
    approvalStatus: "approved",
  }),
];
