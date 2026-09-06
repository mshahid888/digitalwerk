import type { KnowledgeEntry } from "../types";

// Pricing is mutable business data. It is NOT in the system prompt — the
// agent retrieves it from here, and each entry carries its own source and
// verification metadata.
//
// STATUS: every price below is `provisional` — transcribed from the public
// website snapshot (14_WEBSITE_SOURCE_SNAPSHOT.md, reviewed 2026-09-06) and
// from the current repo page content. Before production these must be
// confirmed against an approved DigitalWerk source and flipped to
// `approved` (see docs/CHAT-AGENT/PRICING-UPDATES.md).

export type PriceRecord = {
  id: string;
  service: string;
  amount: string; // display string, e.g. "699 €"
  billing: "one_time" | "monthly" | "from_monthly" | "from_one_time" | "project";
  /** Does the price include advertising / media spend? */
  advertisingBudgetIncluded: boolean | null;
  effectiveDate: string;
  source: string;
  approvalStatus: "approved" | "provisional" | "draft";
  note?: string;
};

export const priceRecords: PriceRecord[] = [
  {
    id: "price-komplett",
    service: "DigitalWerk Komplett",
    amount: "699 € / Monat",
    billing: "monthly",
    advertisingBudgetIncluded: false,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/loesungen/digitalwerk-komplett",
    approvalStatus: "provisional",
    note: "Advertising / media budget is billed separately.",
  },
  {
    id: "price-seo",
    service: "Local SEO",
    amount: "299 € / Monat",
    billing: "monthly",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/loesungen/seo",
    approvalStatus: "provisional",
  },
  {
    id: "price-gbp",
    service: "Google Unternehmensprofil",
    amount: "199 € einmalig",
    billing: "one_time",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/loesungen/google-unternehmensprofil",
    approvalStatus: "provisional",
  },
  {
    id: "price-content",
    service: "Content-Erstellung",
    amount: "349 € / Monat",
    billing: "monthly",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/loesungen/content-creation",
    approvalStatus: "provisional",
  },
  {
    id: "price-webentwicklung",
    service: "Webentwicklung",
    amount: "ab 1.299 € einmalig",
    billing: "from_one_time",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/loesungen/webentwicklung",
    approvalStatus: "provisional",
    note: "Final price depends on scope and requirements.",
  },
  {
    id: "price-ecommerce",
    service: "E-Commerce",
    amount: "ab 1.499 € einmalig",
    billing: "from_one_time",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/e-commerce",
    approvalStatus: "provisional",
    note: "Final price depends on scope and requirements.",
  },
  {
    id: "price-ki-agenten",
    service: "KI-Agenten",
    amount: "699 € Einrichtung + 99 € / Monat",
    billing: "one_time",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/ki-agenten",
    approvalStatus: "provisional",
    note: "One-time setup plus ongoing support/optimization. Final scope affects price.",
  },
  {
    id: "price-ads",
    service: "Werbeanzeigen (Google / Meta / TikTok Ads)",
    amount: "ab 249 € / Monat je Kanal",
    billing: "from_monthly",
    advertisingBudgetIncluded: false,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/werbeanzeigen",
    approvalStatus: "provisional",
    note: "Management fee only — the advertising / media budget is paid separately by the client.",
  },
  {
    id: "price-leadgen",
    service: "Leadgenerierung",
    amount: "individuell",
    billing: "project",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/loesungen/leadgenerierung",
    approvalStatus: "provisional",
    note: "Individually scoped; no fixed public price. Discussed in the free consultation.",
  },
  {
    id: "price-digital-marketing",
    service: "Digital Marketing",
    amount: "individuell",
    billing: "project",
    advertisingBudgetIncluded: null,
    effectiveDate: "2026-09-06",
    source: "https://www.digitalwerkk.de/loesungen/digital-marketing",
    approvalStatus: "provisional",
    note: "Integrated strategy across channels; scoped individually.",
  },
];

function billingLabel(record: PriceRecord, lang: "de" | "en"): string {
  const de: Record<PriceRecord["billing"], string> = {
    one_time: "einmalig",
    monthly: "monatlich",
    from_monthly: "ab, monatlich",
    from_one_time: "ab, einmalig",
    project: "projektabhängig",
  };
  const en: Record<PriceRecord["billing"], string> = {
    one_time: "one-time",
    monthly: "monthly",
    from_monthly: "from, monthly",
    from_one_time: "from, one-time",
    project: "project-based",
  };
  return (lang === "de" ? de : en)[record.billing];
}

function toEntry(record: PriceRecord, lang: "de" | "en"): KnowledgeEntry {
  const budget =
    record.advertisingBudgetIncluded === false
      ? lang === "de"
        ? " Das Werbebudget ist nicht enthalten und wird separat bezahlt."
        : " The advertising budget is not included and is paid separately."
      : "";
  const note = record.note ? ` ${record.note}` : "";
  const body =
    lang === "de"
      ? `${record.service}: ${record.amount} (${billingLabel(record, "de")}). Stand: ${record.effectiveDate}.${budget}${note} Der endgültige Preis kann vom Umfang abhängen; im kostenlosen Erstgespräch erhalten Sie ein transparentes Angebot.`
      : `${record.service}: ${record.amount} (${billingLabel(record, "en")}). As of ${record.effectiveDate}.${budget}${note} The final price can depend on scope; the free initial consultation includes a transparent quote.`;

  return {
    id: `${record.id}-${lang}`,
    collection: "pricing",
    language: lang,
    title:
      lang === "de"
        ? `Preis: ${record.service}`
        : `Pricing: ${record.service}`,
    body,
    keywords: [
      record.service.toLowerCase(),
      "preis",
      "price",
      "kosten",
      "cost",
      "pricing",
      lang === "de" ? "was kostet" : "how much",
    ],
    metadata: {
      source: record.source,
      lastVerified: record.effectiveDate,
      approvalStatus: record.approvalStatus,
      version: 1,
      sensitivity: "low",
    },
  };
}

export const pricingEntries: KnowledgeEntry[] = priceRecords.flatMap((record) => [
  toEntry(record, "de"),
  toEntry(record, "en"),
]);
