export const siteConfig = {
  name: "DigitalWerk",
  tagline: "Ihr digitaler Wachstumspartner",
  description:
    "DigitalWerk ist die digitale Wachstumspartnerschaft für deutsche Unternehmen — Webentwicklung, lokales SEO, Google Unternehmensprofil, Content, Werbeanzeigen, KI-Automatisierung und E-Commerce aus einer Hand.",
  // Placeholder until a production domain is assigned — update before launch.
  url: "https://digitalwerk.de",
  locale: "de_DE",
  contact: {
    email: "info@digitalwerk.de",
    phone: "+49 000 0000000",
    address: "Musterstraße 1, 00000 Musterstadt, Deutschland",
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
  companyName: null,
  legalForm: null,
  managingDirector: null,
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
