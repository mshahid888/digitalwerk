import type { Metadata } from "next";
import { siteConfig, siteConfigEn } from "./site-config";

type MetadataOptions = {
  // Present only for the page pairs that are fully translated so far —
  // omit for German pages without an English equivalent yet, and for
  // English stub/placeholder pages, so we never advertise an alternate
  // that isn't a genuine, indexable equivalent.
  hreflang?: { de: string; en: string };
  locale?: "de_DE" | "en_US";
};

// `path` is the route's own path (e.g. "/loesungen/seo"). metadataBase
// resolves it to an absolute canonical URL — Next.js does not infer a
// canonical from metadataBase alone, so every page must pass its path.
export function buildMetadata(
  overrides: Metadata = {},
  path: string = "/",
  options: MetadataOptions = {}
): Metadata {
  const isEnglish = options.locale === "en_US";
  const config = isEnglish ? siteConfigEn : siteConfig;
  const locale = options.locale ?? siteConfig.locale;

  const alternates: Metadata["alternates"] = { canonical: path };
  if (options.hreflang) {
    alternates.languages = {
      "de-DE": options.hreflang.de,
      en: options.hreflang.en,
      "x-default": options.hreflang.de,
    };
  }

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${config.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: config.description,
    alternates,
    openGraph: {
      type: "website",
      locale,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: config.description,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: config.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
}
