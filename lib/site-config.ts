export const siteConfig = {
  name: "DigitalWerk",
  tagline: "Ihr digitaler Wachstumspartner",
  description:
    "DigitalWerk ist die digitale Wachstumspartnerschaft für deutsche Unternehmen — Webentwicklung, lokales SEO, Google Unternehmensprofil, Content, Werbeanzeigen, KI-Automatisierung und E-Commerce aus einer Hand.",
  // Reads the real domain from NEXT_PUBLIC_SITE_URL once it's set (e.g. in
  // Vercel project settings). Falls back to the canonical production
  // domain so local builds keep working without it — update the fallback
  // or set the env var before launch, not both. www is canonical; the
  // apex domain 308-redirects to www at the Vercel domain level.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.digitalwerkk.de",
  locale: "de_DE",
  contact: {
    email: "info@digitalwerkk.de",
    phone: "+49 160 5667490",
    address: "Martin-Luther-Platz 14, 91522 Ansbach",
    // The address above is the real, confirmed business address — this
    // gates the Google Maps embed and LocalBusiness structured data so
    // neither ships with placeholder NAP.
    addressConfirmed: true,
  },
  social: {
    instagram: "https://instagram.com/digitalwerk",
    linkedin: "https://linkedin.com/company/digitalwerk",
    facebook: "https://facebook.com/digitalwerk",
    whatsapp: "https://wa.me/490000000000",
  },
} as const;

export const ctaLabels = {
  primary: "Kostenlose Beratung",
  secondary: "Projekt anfragen",
} as const;

// English site copy. Shared facts (name, contact, social, url) stay in
// siteConfig above — only marketing copy that genuinely differs by
// language lives here.
export const siteConfigEn = {
  tagline: "Your Digital Growth Partner",
  description:
    "DigitalWerk is the digital growth partnership for businesses in Germany — web development, local SEO, Google Business Profile, content, advertising, AI automation, and e-commerce, all from one partner.",
  locale: "en_US",
} as const;

export const ctaLabelsEn = {
  primary: "Free Consultation",
  secondary: "Request a Project",
} as const;

// Legally required facts for Impressum & Datenschutz that we do not have
// verified values for yet. Left as `null` intentionally — do not invent
// values here. Fill in with real, confirmed data before launch; both
// pages read from this single source, so nothing else needs to change.
type LegalInfo = {
  companyName: string | null;
  legalForm: string | null;
  managingDirector: string | null;
  registerCourt: string | null;
  registerNumber: string | null;
  vatId: string | null;
};

export const legalInfo: LegalInfo = {
  companyName: "Digital Werk",
  legalForm: null,
  managingDirector: "Mesioure Ismailoglou",
  registerCourt: null,
  registerNumber: null,
  vatId: null,
};

export function legalFieldOrPlaceholder(
  value: string | null,
  placeholderLabel: string
): string {
  return value ?? `[${placeholderLabel} – bitte ergänzen]`;
}

// Same underlying values as legalFieldOrPlaceholder — only the placeholder
// wording differs. Never invents a value: still-null fields render an
// English "to be added" placeholder instead of a filled-in fact.
export function legalFieldOrPlaceholderEn(
  value: string | null,
  placeholderLabel: string
): string {
  return value ?? `[${placeholderLabel} – to be added]`;
}
