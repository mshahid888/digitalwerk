import type { Metadata } from "next";
import { siteConfig, siteConfigEn } from "./site-config";
import { absoluteUrl } from "./schema";

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
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(
    isEnglish ? "/en/opengraph-image" : "/opengraph-image"
  );
  // OG/Twitter titles don't get Next's automatic title.template treatment
  // (that only applies to the <title> tag), so it's replicated manually
  // here — except when overrides.title already includes the brand name
  // (the homepage passes its full "Brand — tagline" string directly, to
  // work around title.template not applying to its own same-segment
  // page.tsx; see docs/SEO-MASTER-PLAN.md Step 33), which would otherwise
  // duplicate the brand name.
  const pageTitle =
    typeof overrides.title === "string"
      ? overrides.title.includes(siteConfig.name)
        ? overrides.title
        : `${overrides.title} | ${siteConfig.name}`
      : `${siteConfig.name} — ${config.tagline}`;
  const pageDescription = overrides.description ?? config.description;

  const alternates: Metadata["alternates"] = { canonical };
  if (options.hreflang) {
    alternates.languages = {
      "de-DE": absoluteUrl(options.hreflang.de),
      en: absoluteUrl(options.hreflang.en),
      "x-default": absoluteUrl(options.hreflang.de),
    };
  }

  const defaultOpenGraph: Metadata["openGraph"] = {
    type: "website",
    locale,
    siteName: siteConfig.name,
    title: pageTitle,
    description: pageDescription,
    url: canonical,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${config.tagline}`,
      },
    ],
  };
  const defaultTwitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: ogImage,
        alt: `${siteConfig.name} — ${config.tagline}`,
      },
    ],
  };

  // openGraph/twitter are applied after ...overrides and explicitly
  // merged (not just replaced) so a future caller passing a *partial*
  // override (e.g. just a custom image) can't silently drop url/locale/
  // siteName/title/description — every field keeps its page-specific
  // default unless that exact field is overridden.
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title: {
      default: `${siteConfig.name} — ${config.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: pageDescription,
    alternates,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...overrides,
    openGraph: { ...defaultOpenGraph, ...overrides.openGraph },
    twitter: { ...defaultTwitter, ...overrides.twitter },
  };
}
