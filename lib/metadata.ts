import type { Metadata } from "next";
import { siteConfig } from "./site-config";

// `path` is the route's own path (e.g. "/loesungen/seo"). metadataBase
// resolves it to an absolute canonical URL — Next.js does not infer a
// canonical from metadataBase alone, so every page must pass its path.
export function buildMetadata(overrides: Metadata = {}, path: string = "/"): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
}
