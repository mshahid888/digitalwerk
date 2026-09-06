import { entry } from "./helpers";
import type { KnowledgeEntry } from "../types";

const SITE = "https://www.digitalwerkk.de";

// Specific AI-automation use cases, condensed from the "Unsere KI-Lösungen"
// grid on /ki-agenten. These are capability descriptions, not promises for
// any particular customer project — actual scope depends on requirements
// and integrations.

type Solution = {
  id: string;
  de: { title: string; body: string; keywords: string[] };
  en: { title: string; body: string; keywords: string[] };
};

const solutions: Solution[] = [
  {
    id: "website-chatbot",
    de: {
      title: "AI Chatbot für die Website",
      body: "Beantwortet Fragen auf der Website in Echtzeit – auch nachts und am Wochenende. Reduziert wiederkehrende Anfragen und verpasste Kontakte.",
      keywords: ["website chatbot", "chat auf website", "fragen beantworten", "wiederkehrende fragen"],
    },
    en: {
      title: "Website AI chatbot",
      body: "Answers questions on the website in real time — including nights and weekends. Reduces repetitive inquiries and missed contacts.",
      keywords: ["website chatbot", "chat on website", "answer questions", "repetitive questions"],
    },
  },
  {
    id: "voice-agent",
    de: {
      title: "AI Voice Agent",
      body: "Führt natürliche Telefongespräche und beantwortet häufige Fragen automatisch. Entlastet das Team bei Standardanfragen am Telefon.",
      keywords: ["voice agent", "telefon ki", "anrufe automatisieren", "sprachassistent"],
    },
    en: {
      title: "AI voice agent",
      body: "Holds natural phone conversations and answers common questions automatically. Relieves the team of standard phone inquiries.",
      keywords: ["voice agent", "phone ai", "automate calls", "voice assistant"],
    },
  },
  {
    id: "phone-receptionist",
    de: {
      title: "AI Phone Receptionist",
      body: "Nimmt eingehende Anrufe entgegen, wenn niemand ans Telefon gehen kann – kein verpasster Anruf mehr.",
      keywords: ["telefonannahme", "rezeption", "anrufe entgegennehmen", "verpasste anrufe"],
    },
    en: {
      title: "AI phone receptionist",
      body: "Takes incoming calls when nobody can pick up the phone — no more missed calls.",
      keywords: ["reception", "answer calls", "missed calls"],
    },
  },
  {
    id: "whatsapp-ai",
    de: {
      title: "WhatsApp AI",
      body: "Beantwortet Kundenanfragen direkt in WhatsApp Business, wo viele Kunden ohnehin schreiben.",
      keywords: ["whatsapp", "whatsapp business", "messenger", "kundenanfragen whatsapp"],
    },
    en: {
      title: "WhatsApp AI",
      body: "Answers customer inquiries directly in WhatsApp Business, where many customers already write.",
      keywords: ["whatsapp", "whatsapp business", "messenger"],
    },
  },
  {
    id: "appointment-booking",
    de: {
      title: "Terminbuchung",
      body: "Kunden buchen Termine selbstständig – ohne Anruf oder E-Mail-Verkehr. Anbindung an bestehende Kalender-/Terminsysteme ist möglich.",
      keywords: ["termin", "terminbuchung", "kalender", "buchung", "appointment", "booking"],
    },
    en: {
      title: "Appointment booking",
      body: "Customers book appointments themselves — no call or email back-and-forth. Integration with existing calendar/booking systems is possible.",
      keywords: ["appointment", "booking", "calendar", "scheduling"],
    },
  },
  {
    id: "support-automation",
    de: {
      title: "Kundensupport-Automatisierung",
      body: "Beantwortet wiederkehrende Fragen automatisch und leitet komplexere Anliegen an das Team weiter.",
      keywords: ["support", "kundenservice", "faq automatisieren", "support automatisieren"],
    },
    en: {
      title: "Customer support automation",
      body: "Answers recurring questions automatically and routes more complex matters to the team.",
      keywords: ["support", "customer service", "automate faq"],
    },
  },
  {
    id: "lead-qualification",
    de: {
      title: "Lead-Qualifizierung",
      body: "Filtert und sortiert Anfragen automatisch, bevor sie beim Team landen – nur noch passende Anfragen.",
      keywords: ["lead qualifizierung", "anfragen filtern", "vorqualifizierung"],
    },
    en: {
      title: "Lead qualification",
      body: "Filters and sorts inquiries automatically before they reach the team — only relevant inquiries remain.",
      keywords: ["lead qualification", "filter inquiries", "pre-qualification"],
    },
  },
  {
    id: "integrations",
    de: {
      title: "Anbindung an bestehende Systeme",
      body: "KI-Agenten können an vorhandene Systeme angebunden werden – etwa Kalender/Terminsysteme, Kundendaten, E-Mail und WhatsApp. Welche Anbindungen möglich sind, hängt vom konkreten Projekt und den Anforderungen ab.",
      keywords: ["integration", "anbindung", "schnittstelle", "crm", "kalender", "systeme verbinden", "api"],
    },
    en: {
      title: "Integration with existing systems",
      body: "AI agents can be connected to existing systems — such as calendar/booking systems, customer data, email and WhatsApp. Which integrations are possible depends on the specific project and its requirements.",
      keywords: ["integration", "connect systems", "crm", "calendar", "api"],
    },
  },
];

export const aiSolutionEntries: KnowledgeEntry[] = solutions.flatMap((s) => [
  entry({
    id: `ai-solution-${s.id}-de`,
    collection: "ai_solutions",
    language: "de",
    title: s.de.title,
    body: `${s.de.body} Der genaue Funktionsumfang hängt von den Anforderungen und Integrationen ab. Mehr: ${SITE}/ki-agenten`,
    keywords: ["ki-agent", "automatisierung", ...s.de.keywords],
    source: `${SITE}/ki-agenten`,
  }),
  entry({
    id: `ai-solution-${s.id}-en`,
    collection: "ai_solutions",
    language: "en",
    title: s.en.title,
    body: `${s.en.body} The exact capabilities depend on requirements and integrations. More: ${SITE}/en/ai-agents`,
    keywords: ["ai agent", "automation", ...s.en.keywords],
    source: `${SITE}/en/ai-agents`,
  }),
]);
