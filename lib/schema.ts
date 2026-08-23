import type { Locale } from "./i18n-routes";
import { siteConfig, siteConfigEn } from "./site-config";

const organizationId = `${siteConfig.url}#organization`;
const germany = { "@type": "Country", name: "Germany" };
// DigitalWerk's confirmed local market (Ansbach/Mittelfranken/Bayern),
// layered alongside the existing Germany-wide areaServed on the
// Organization entity — DigitalWerk serves clients nationwide, but has a
// real local presence worth signaling separately from that national claim.
const localArea = [
  { "@type": "City", name: "Ansbach" },
  { "@type": "AdministrativeArea", name: "Mittelfranken" },
  { "@type": "AdministrativeArea", name: "Bayern" },
];

export function absoluteUrl(path: string = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

// DigitalWerk is a professional service business with a confirmed physical
// address. One stable @id lets every page reference the same entity instead
// of emitting separate, potentially conflicting Organization/LocalBusiness
// records.
export function buildOrganizationJsonLd(
  locale: Locale = "de"
): Record<string, unknown> | null {
  if (!siteConfig.contact.addressConfirmed) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": organizationId,
    name: siteConfig.name,
    url: siteConfig.url,
    description:
      locale === "en" ? siteConfigEn.description : siteConfig.description,
    email: siteConfig.contact.email,
    areaServed: [germany, ...localArea],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: "Ansbach",
      addressRegion: "Bayern",
      postalCode: "91522",
      addressCountry: "DE",
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
      siteConfig.social.facebook,
    ],
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: ["de-DE", "en"],
    publisher: { "@id": organizationId },
  };
}

export function buildContactPageJsonLd(
  path: string,
  locale: Locale
): Record<string, unknown> {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#webpage`,
    url,
    name: `${locale === "en" ? "Contact" : "Kontakt"} | ${siteConfig.name}`,
    inLanguage: locale === "en" ? "en" : "de-DE",
    mainEntity: { "@id": organizationId },
  };
}

export function buildServiceJsonLd({
  path,
  name,
  description,
  locale,
}: {
  path: string;
  name: string;
  description: string;
  locale: Locale;
}): Record<string, unknown> {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: name,
    description,
    url,
    inLanguage: locale === "en" ? "en" : "de-DE",
    areaServed: germany,
    provider: { "@id": organizationId },
  };
}
