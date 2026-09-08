import { entry } from "./helpers";
import type { KnowledgeEntry } from "../types";

const SITE = "https://www.digitalwerkk.de";

// One entry per DigitalWerk service, DE + EN. Descriptions are condensed
// from the live service pages in this repo (app/(de)/loesungen/*, /ki-agenten,
// /werbeanzeigen, /e-commerce). Pricing is NOT repeated here — it lives in
// pricing.ts so it can change independently.

type ServiceDef = {
  slug: string;
  routeDe: string;
  routeEn: string;
  de: { name: string; body: string; keywords: string[] };
  en: { name: string; body: string; keywords: string[] };
};

const services: ServiceDef[] = [
  {
    slug: "digitalwerk-komplett",
    routeDe: "/loesungen/digitalwerk-komplett",
    routeEn: "/en/solutions/complete",
    de: {
      name: "DigitalWerk Komplett",
      body: "DigitalWerk Komplett ist die komplette digitale Abteilung aus einer Hand: Webentwicklung, lokales SEO, Google Unternehmensprofil, Content, KI-Automatisierung, Analytics/Reporting, monatliche Optimierung, technische Wartung und laufender Support – mit einem festen Ansprechpartner und planbaren monatlichen Kosten. Das Werbebudget ist nicht enthalten.",
      keywords: ["komplett", "alles aus einer hand", "rundum", "digitale abteilung", "paket"],
    },
    en: {
      name: "DigitalWerk Complete",
      body: "DigitalWerk Complete is a full digital department from one partner: web development, local SEO, Google Business Profile, content, AI automation, analytics/reporting, monthly optimization, technical maintenance and ongoing support — one dedicated contact, predictable monthly cost. Advertising budget not included.",
      keywords: ["complete", "everything from one partner", "package", "all-in-one"],
    },
  },
  {
    slug: "webentwicklung",
    routeDe: "/loesungen/webentwicklung",
    routeEn: "/en/solutions/web-development",
    de: {
      name: "Webentwicklung & Webdesign",
      body: "Professionelle Unternehmenswebsites – modern, schnell und suchmaschinenfreundlich. Konzeption, Design, Entwicklung und Launch. Bestehende Websites werden ebenfalls übernommen. Eine solide technische Grundlage für SEO ist enthalten.",
      keywords: ["website", "webseite", "webdesign", "webentwicklung", "homepage", "neue seite", "relaunch"],
    },
    en: {
      name: "Web Development & Design",
      body: "Professional business websites — modern, fast and search-engine friendly. Concept, design, development and launch. Existing websites can be taken over. A solid technical SEO foundation is included.",
      keywords: ["website", "web design", "web development", "homepage", "relaunch", "new site"],
    },
  },
  {
    slug: "seo",
    routeDe: "/loesungen/seo",
    routeEn: "/en/solutions/seo",
    de: {
      name: "Local SEO",
      body: "Lokales SEO sorgt dafür, dass Ihr Unternehmen bei Google und Google Maps gefunden wird, wenn Kunden in Ihrer Region suchen. Enthalten: Sichtbarkeitsanalyse, regionale Keyword-Recherche, On-Page-Optimierung, Betreuung des Google Unternehmensprofils, technisches SEO-Grundgerüst und monatliches Reporting. SEO ist eine langfristige Investition – spürbare Effekte meist nach 3–6 Monaten. Ranking-Platzierungen werden nicht garantiert.",
      keywords: ["seo", "google", "sichtbarkeit", "gefunden werden", "ranking", "suchmaschine", "google maps", "lokal"],
    },
    en: {
      name: "Local SEO",
      body: "Local SEO makes your business findable on Google and Google Maps when customers search in your region. Includes: visibility analysis, regional keyword research, on-page optimization, Google Business Profile management, technical SEO foundation and monthly reporting. SEO is a long-term investment — noticeable effects usually after 3–6 months. Specific rankings are never guaranteed.",
      keywords: ["seo", "google", "visibility", "get found", "ranking", "search", "google maps", "local"],
    },
  },
  {
    slug: "google-unternehmensprofil",
    routeDe: "/loesungen/google-unternehmensprofil",
    routeEn: "/en/solutions/google-business-profile",
    de: {
      name: "Google Unternehmensprofil",
      body: "Optimierung des Google Unternehmensprofils (Google Business Profile) für mehr lokale Sichtbarkeit: vollständige und korrekte Angaben, Kategorien, Fotos, eine Bewertungsstrategie mit ausschließlich echten Bewertungen und laufende Pflege. Erste Verbesserungen sind oft innerhalb weniger Wochen sichtbar. Erstellung eines neuen Profils ist möglich.",
      keywords: ["google unternehmensprofil", "google business profile", "google maps eintrag", "bewertungen", "gbp"],
    },
    en: {
      name: "Google Business Profile",
      body: "Optimization of the Google Business Profile for more local visibility: complete and accurate information, categories, photos, a review strategy using only genuine reviews, and ongoing upkeep. First improvements are often visible within a few weeks. Setting up a new profile is possible.",
      keywords: ["google business profile", "google maps listing", "reviews", "gbp"],
    },
  },
  {
    slug: "content-creation",
    routeDe: "/loesungen/content-creation",
    routeEn: "/en/solutions/content-creation",
    de: {
      name: "Content-Erstellung",
      body: "Professionelle Texte für Website und digitale Präsenz, die überzeugen und bei Google gefunden werden: branchenspezifisch, verständlich statt generisch, SEO und Sprache aus einer Hand. Eigene Texte können eingebracht oder überarbeitet werden.",
      keywords: ["content", "texte", "texten", "inhalte", "copywriting", "blog", "website texte"],
    },
    en: {
      name: "Content Creation",
      body: "Professional copy for your website and digital presence that persuades and gets found on Google: industry-specific, clear rather than generic, SEO and language handled together. Your own drafts can be included or revised.",
      keywords: ["content", "copy", "copywriting", "text", "blog", "website copy"],
    },
  },
  {
    slug: "digital-marketing",
    routeDe: "/loesungen/digital-marketing",
    routeEn: "/en/solutions/digital-marketing",
    de: {
      name: "Digital Marketing",
      body: "Digital Marketing als abgestimmte Strategie über mehrere Kanäle – SEO, Werbeanzeigen, Content und KI-Automatisierung – statt einzelner, unverbundener Maßnahmen. Ein Ansprechpartner, klare Erfolgsmessung, weniger Streuverluste.",
      keywords: ["digital marketing", "online marketing", "strategie", "kanäle", "marketing"],
    },
    en: {
      name: "Digital Marketing",
      body: "Digital marketing as one coordinated strategy across channels — SEO, advertising, content and AI automation — instead of disconnected individual measures. One contact, clear measurement, less wasted budget.",
      keywords: ["digital marketing", "online marketing", "strategy", "channels"],
    },
  },
  {
    slug: "leadgenerierung",
    routeDe: "/loesungen/leadgenerierung",
    routeEn: "/en/solutions/lead-generation",
    de: {
      name: "Leadgenerierung",
      body: "KI-gestützte Leadgenerierung für einen planbaren Anfragenfluss: Anfragen werden automatisch vorqualifiziert, sofort beantwortet (auch nachts und am Wochenende) und mit weniger manuellem Aufwand an das Team übergeben. Individuell buchbar, auch für B2B.",
      keywords: ["leads", "leadgenerierung", "mehr anfragen", "neukunden", "anfragen generieren", "lead generation"],
    },
    en: {
      name: "Lead Generation",
      body: "AI-supported lead generation for a predictable flow of inquiries: leads are automatically pre-qualified, answered immediately (including nights and weekends) and handed to the team with less manual effort. Individually bookable, B2B included.",
      keywords: ["leads", "lead generation", "more inquiries", "new customers"],
    },
  },
  {
    slug: "ki-agenten",
    routeDe: "/ki-agenten",
    routeEn: "/en/ai-agents",
    de: {
      name: "KI-Agenten",
      body: "KI-Agenten übernehmen wiederkehrende Kommunikation: Anfragen beantworten, Anrufe entgegennehmen, Termine buchen und Anfragen qualifizieren – rund um die Uhr. DigitalWerk übernimmt Analyse, Einrichtung, Testphase und laufende Betreuung. KI-Agenten ersetzen kein Team, sondern entlasten es; komplexe Anliegen werden an Menschen weitergeleitet. Auch Teil von DigitalWerk Komplett und zusätzlich einzeln buchbar.",
      keywords: ["ki-agent", "ki agenten", "chatbot", "automatisierung", "ai agent", "voice agent", "telefon ki", "assistent"],
    },
    en: {
      name: "AI Agents",
      body: "AI agents take over repetitive communication: answering inquiries, taking calls, booking appointments and qualifying leads — around the clock. DigitalWerk handles analysis, setup, a test phase and ongoing support. AI agents do not replace a team; they relieve it, and complex matters are routed to humans. Also part of DigitalWerk Complete and available separately.",
      keywords: ["ai agent", "ai agents", "chatbot", "automation", "voice agent", "phone ai", "assistant"],
    },
  },
  {
    slug: "ki-agenten-erstellen",
    routeDe: "/ki-agenten/erstellen",
    routeEn: "/en/ai-agents",
    de: {
      name: "KI-Agenten erstellen lassen",
      body: "Ablauf beim Erstellen eines KI-Agenten: klares Ziel definieren, Zugang zu den richtigen Informationen und Systemen (z. B. Kalender, Kundendaten) herstellen, Testphase vor dem Livegang, danach laufende Betreuung. DigitalWerk übernimmt den gesamten Prozess von der Analyse bis zum Betrieb.",
      keywords: ["ki-agent erstellen", "ki agent bauen", "wie baut man einen ki-agenten", "entwicklung", "build ai agent"],
    },
    en: {
      name: "Having an AI agent built",
      body: "How an AI agent is built: define a clear goal, connect the right information and systems (e.g. calendar, customer data), run a test phase before go-live, then ongoing support. DigitalWerk handles the whole process from analysis to operation.",
      keywords: ["build ai agent", "create ai agent", "how to build an ai agent", "development"],
    },
  },
  {
    slug: "ki-agenten-e-commerce",
    routeDe: "/ki-agenten/e-commerce",
    routeEn: "/en/ai-agents",
    de: {
      name: "KI-Agenten für E-Commerce",
      body: "KI-Agenten für Online-Shops beantworten Produktfragen, geben Auskunft zum Bestellstatus und übernehmen wiederkehrenden Support automatisch – für Shopify- und WooCommerce-Shops. Sie entlasten das Support-Team und leiten komplexere Fälle weiter.",
      keywords: ["ki-agent shop", "e-commerce chatbot", "shopify", "woocommerce", "bestellstatus", "produktfragen"],
    },
    en: {
      name: "AI Agents for E-Commerce",
      body: "AI agents for online shops answer product questions, provide order-status information and handle recurring support automatically — for Shopify and WooCommerce stores. They relieve the support team and route more complex cases onward.",
      keywords: ["shop ai agent", "e-commerce chatbot", "shopify", "woocommerce", "order status", "product questions"],
    },
  },
  {
    slug: "werbeanzeigen",
    routeDe: "/werbeanzeigen",
    routeEn: "/en/advertising",
    de: {
      name: "Werbeanzeigen (Google, Meta, TikTok Ads)",
      body: "Professionelles Anzeigenmanagement für Google Ads (aktive Suchnachfrage), Meta Ads (Facebook/Instagram, Zielgruppen- und Creative-getrieben) und TikTok Ads (Kurzvideo, jüngere Zielgruppen). Die Managementgebühr ist getrennt vom Werbebudget, das der Kunde separat zahlt.",
      keywords: ["werbung", "ads", "google ads", "meta ads", "facebook ads", "instagram ads", "tiktok ads", "anzeigen", "kampagne"],
    },
    en: {
      name: "Advertising (Google, Meta, TikTok Ads)",
      body: "Professional ad management for Google Ads (active search demand), Meta Ads (Facebook/Instagram, audience- and creative-driven) and TikTok Ads (short video, younger audiences). The management fee is separate from the advertising budget, which the client pays directly.",
      keywords: ["advertising", "ads", "google ads", "meta ads", "facebook ads", "instagram ads", "tiktok ads", "campaign", "ppc"],
    },
  },
  {
    slug: "e-commerce",
    routeDe: "/e-commerce",
    routeEn: "/en/e-commerce",
    de: {
      name: "E-Commerce",
      body: "Aufbau professioneller Online-Shops, die mit dem Unternehmen wachsen, inklusive Anbindung an Marktplätze. Der genaue Umfang wird im Erstgespräch besprochen.",
      keywords: ["online shop", "e-commerce", "shop erstellen", "verkaufen", "onlineshop", "marktplatz"],
    },
    en: {
      name: "E-Commerce",
      body: "Building professional online shops that scale with the business, including marketplace connections. The exact scope is discussed in the initial consultation.",
      keywords: ["online shop", "e-commerce", "build a shop", "sell online", "marketplace"],
    },
  },
];

export const serviceEntries: KnowledgeEntry[] = services.flatMap((s) => [
  entry({
    id: `service-${s.slug}-de`,
    collection: "services",
    language: "de",
    title: s.de.name,
    body: `${s.de.body} Seite: ${SITE}${s.routeDe}`,
    keywords: [s.de.name, ...s.de.keywords, "leistung", "service", "angebot"],
    source: `${SITE}${s.routeDe}`,
  }),
  entry({
    id: `service-${s.slug}-en`,
    collection: "services",
    language: "en",
    title: s.en.name,
    body: `${s.en.body} Page: ${SITE}${s.routeEn}`,
    keywords: [s.en.name, ...s.en.keywords, "service", "offering"],
    source: `${SITE}${s.routeEn}`,
  }),
]);

export const serviceCatalog = services.map((s) => ({
  slug: s.slug,
  nameDe: s.de.name,
  nameEn: s.en.name,
  routeDe: s.routeDe,
  routeEn: s.routeEn,
}));
