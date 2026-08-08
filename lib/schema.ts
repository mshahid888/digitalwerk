import { legalInfo, siteConfig } from "./site-config";

// Returns null until real, confirmed business data exists. Never render
// LocalBusiness schema built from placeholder NAP data — search engines
// would index the placeholder as if it were real.
export function buildLocalBusinessJsonLd(): Record<string, unknown> | null {
  if (!siteConfig.contact.addressConfirmed || !legalInfo.companyName) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: legalInfo.companyName,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "DE",
    },
  };
}
