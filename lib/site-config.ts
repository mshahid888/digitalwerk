export const siteConfig = {
  name: "DigitalWerk",
  tagline: "Ihr digitaler Wachstumspartner",
  description:
    "DigitalWerk ist die digitale Wachstumspartnerschaft für deutsche Unternehmen — Webentwicklung, lokales SEO, Google Unternehmensprofil, Content, Werbeanzeigen, KI-Automatisierung und E-Commerce aus einer Hand.",
  // Reads the real domain from NEXT_PUBLIC_SITE_URL once it's set (e.g. in
  // Vercel project settings). Falls back to a placeholder so local builds
  // keep working without it — update the fallback or set the env var
  // before launch, not both.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digitalwerk.de",
  locale: "de_DE",
  contact: {
    email: "info@digitalwerk.de",
    phone: "+49 000 0000000",
    address: "Musterstraße 1, 00000 Musterstadt, Deutschland",
    // Flip to true only once the address above is the real, confirmed
    // business address — this gates the Google Maps embed and
    // LocalBusiness structured data so neither ships with placeholder NAP.
    addressConfirmed: false,
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
  companyName: "Digital Werk",
  legalForm: null,
  managingDirector: "Ismailoglou",
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
