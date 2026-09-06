import { entry } from "./helpers";
import type { KnowledgeEntry } from "../types";

const SITE = "https://www.digitalwerkk.de";

// FAQ entries transcribed from the FAQ sections of the live service pages
// in this repo. Question + approved answer + source + language.

type Faq = {
  id: string;
  lang: "de" | "en";
  route: string;
  q: string;
  a: string;
  keywords: string[];
};

const faqs: Faq[] = [
  {
    id: "faq-seo-duration",
    lang: "de",
    route: "/loesungen/seo",
    q: "Wie lange dauert es, bis SEO wirkt?",
    a: "Erste Verbesserungen am Google-Profil zeigen sich oft innerhalb weniger Wochen. Spürbare Verbesserungen im organischen Ranking brauchen in der Regel drei bis sechs Monate, nachhaltige Ergebnisse eher sechs bis zwölf Monate. SEO ist eine langfristige Investition, kein schneller Trick.",
    keywords: ["seo dauer", "wie lange seo", "wann wirkt seo"],
  },
  {
    id: "faq-seo-guarantee",
    lang: "de",
    route: "/loesungen/seo",
    q: "Können Sie mir Platz 1 bei Google garantieren?",
    a: "Nein. Seriöse SEO-Agenturen können und sollten keine bestimmte Platzierung garantieren, da Google die Rankingfaktoren nicht offenlegt und regelmäßig ändert. DigitalWerk arbeitet mit bewährten, nachhaltigen Methoden, die die Sichtbarkeit nachweislich verbessern.",
    keywords: ["garantie google", "platz 1 garantieren", "ranking garantie"],
  },
  {
    id: "faq-seo-vs-ads",
    lang: "de",
    route: "/loesungen/seo",
    q: "Was ist der Unterschied zwischen SEO und Google Ads?",
    a: "Google Ads bringt sofortige, aber kostenpflichtige Sichtbarkeit. SEO baut organische Sichtbarkeit auf, die auch ohne laufendes Werbebudget bestehen bleibt – dafür braucht sie mehr Zeit.",
    keywords: ["seo oder ads", "unterschied seo google ads"],
  },
  {
    id: "faq-agent-replace-team",
    lang: "de",
    route: "/ki-agenten",
    q: "Ersetzt KI-Automatisierung mein Team?",
    a: "Nein. KI-Agenten übernehmen Routineaufgaben und entlasten das Team – für den persönlichen Kontakt mit Kunden bleiben die Mitarbeiter unersetzlich.",
    keywords: ["ki ersetzt mitarbeiter", "ersetzt ki mein team", "arbeitsplätze"],
  },
  {
    id: "faq-agent-complex",
    lang: "de",
    route: "/ki-agenten",
    q: "Ist ein KI-Agent kompliziert einzurichten?",
    a: "Nein. DigitalWerk übernimmt die vollständige Einrichtung und Betreuung – um nichts Technisches muss man sich selbst kümmern.",
    keywords: ["ki-agent einrichten kompliziert", "aufwand einrichtung"],
  },
  {
    id: "faq-agent-vs-chatbot",
    lang: "de",
    route: "/ki-agenten",
    q: "Was ist der Unterschied zwischen einem KI-Agenten und einem Chatbot?",
    a: "Ein klassischer Chatbot folgt vordefinierten Dialogpfaden und liefert Antworten aus einem festen Skript. Ein KI-Agent versteht natürliche Sprache, zieht bei Bedarf Kontext heran und kann eigenständig handeln – etwa einen Termin buchen oder eine Anfrage qualifizieren. Kurz: ein Chatbot antwortet, ein KI-Agent erledigt.",
    keywords: ["ki-agent vs chatbot", "unterschied chatbot ki-agent"],
  },
  {
    id: "faq-agent-what-is",
    lang: "de",
    route: "/ki-agenten",
    q: "Was ist ein KI-Agent?",
    a: "Ein KI-Agent ist ein Software-System, das mithilfe künstlicher Intelligenz eigenständig Aufgaben übernimmt – zum Beispiel Kundenanfragen beantworten, Informationen nachschlagen oder einen Termin buchen. Er versteht natürliche Sprache und kann innerhalb klar definierter Regeln selbstständig handeln.",
    keywords: ["was ist ein ki-agent", "definition ki-agent"],
  },
  {
    id: "faq-komplett-fit",
    lang: "de",
    route: "/loesungen/digitalwerk-komplett",
    q: "Für wen eignet sich DigitalWerk Komplett?",
    a: "Für Unternehmen, die mehrere digitale Themen gleichzeitig angehen wollen – Website, SEO, Content, Automatisierung – und dafür einen festen Partner mit planbaren Kosten statt mehrerer Dienstleister suchen.",
    keywords: ["für wen komplett", "eignet sich komplett"],
  },
  {
    id: "faq-komplett-switch",
    lang: "de",
    route: "/loesungen/digitalwerk-komplett",
    q: "Kann ich später zu einzelnen Leistungen wechseln?",
    a: "Ja. Einzelne Leistungen sind auch separat buchbar; ein Wechsel ist möglich.",
    keywords: ["wechsel einzelleistung", "komplett kündigen"],
  },
  {
    id: "faq-contact-free",
    lang: "de",
    route: "/kontakt",
    q: "Ist das Erstgespräch wirklich kostenlos und unverbindlich?",
    a: "Ja, das Erstgespräch ist komplett kostenlos und unverbindlich. Eine Vorbereitung ist nicht nötig – es reicht, kurz zu schildern, worum es geht.",
    keywords: ["erstgespräch kostenlos", "unverbindlich", "beratung kosten"],
  },
  {
    id: "faq-contact-speed",
    lang: "de",
    route: "/kontakt",
    q: "Wie schnell erhalte ich eine Antwort?",
    a: "In der Regel innerhalb eines Werktages.",
    keywords: ["wie schnell antwort", "reaktionszeit"],
  },
  {
    id: "faq-gbp-fake-reviews",
    lang: "de",
    route: "/loesungen/google-unternehmensprofil",
    q: "Können Sie mir gefälschte Bewertungen besorgen?",
    a: "Nein. DigitalWerk arbeitet ausschließlich mit echten Bewertungen und einer legitimen Bewertungsstrategie.",
    keywords: ["gefälschte bewertungen", "fake reviews kaufen"],
  },
  {
    id: "faq-webdev-duration",
    lang: "de",
    route: "/loesungen/webentwicklung",
    q: "Übernehmen Sie auch bestehende Websites?",
    a: "Ja. Bestehende Websites können übernommen und weiterentwickelt werden.",
    keywords: ["bestehende website übernehmen", "relaunch"],
  },
  // English equivalents for the most common questions
  {
    id: "faq-seo-duration-en",
    lang: "en",
    route: "/en/solutions/seo",
    q: "How long until SEO works?",
    a: "First improvements to the Google profile often show within a few weeks. Noticeable organic ranking improvements usually take three to six months, sustainable results six to twelve months. SEO is a long-term investment, not a quick trick.",
    keywords: ["how long seo", "seo timeline", "when does seo work"],
  },
  {
    id: "faq-seo-guarantee-en",
    lang: "en",
    route: "/en/solutions/seo",
    q: "Can you guarantee me the number one spot on Google?",
    a: "No. Reputable SEO agencies cannot and should not guarantee a specific ranking, because Google does not disclose its ranking factors and changes them regularly. DigitalWerk uses proven, sustainable methods that demonstrably improve visibility.",
    keywords: ["guarantee google ranking", "number one on google", "ranking guarantee"],
  },
  {
    id: "faq-agent-replace-team-en",
    lang: "en",
    route: "/en/ai-agents",
    q: "Will AI automation replace my team?",
    a: "No. AI agents take over routine tasks and relieve your team — for personal customer contact your staff remain irreplaceable.",
    keywords: ["ai replace team", "will ai replace employees", "jobs"],
  },
  {
    id: "faq-agent-vs-chatbot-en",
    lang: "en",
    route: "/en/ai-agents",
    q: "What is the difference between an AI agent and a chatbot?",
    a: "A classic chatbot follows predefined dialogue paths and answers from a fixed script. An AI agent understands natural language, draws on context when needed and can act independently — for example booking an appointment or qualifying an inquiry. In short: a chatbot answers, an AI agent gets things done.",
    keywords: ["ai agent vs chatbot", "difference chatbot ai agent"],
  },
  {
    id: "faq-contact-free-en",
    lang: "en",
    route: "/en/contact",
    q: "Is the initial consultation really free and non-binding?",
    a: "Yes, the initial consultation is completely free and non-binding. No preparation is needed — a brief description of your situation is enough.",
    keywords: ["free consultation", "non-binding", "consultation cost"],
  },
];

export const faqEntries: KnowledgeEntry[] = faqs.map((f) =>
  entry({
    id: f.id,
    collection: "faq",
    language: f.lang,
    title: f.q,
    body: `${f.q}\n${f.a}`,
    keywords: [...f.keywords, "faq", "frage", "question"],
    source: `${SITE}${f.route}`,
    approvalStatus: "provisional",
  }),
);
