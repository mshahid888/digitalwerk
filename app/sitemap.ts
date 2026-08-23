import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

type SitemapRoute = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  // Only set for the page pairs that are fully translated and indexable in
  // both languages — matches the hreflang wiring in each page's metadata.
  languages?: { de: string; en: string };
};

const routes: SitemapRoute[] = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly",
    languages: { de: "/", en: "/en" },
  },
  {
    path: "/ueber-uns",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: { de: "/ueber-uns", en: "/en/about" },
  },
  {
    path: "/loesungen",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/loesungen", en: "/en/solutions" },
  },
  {
    path: "/loesungen/digitalwerk-komplett",
    priority: 0.9,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/digitalwerk-komplett",
      en: "/en/solutions/complete",
    },
  },
  {
    path: "/loesungen/seo",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: { de: "/loesungen/seo", en: "/en/solutions/seo" },
  },
  {
    path: "/loesungen/webentwicklung",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/webentwicklung",
      en: "/en/solutions/web-development",
    },
  },
  {
    path: "/loesungen/google-unternehmensprofil",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/google-unternehmensprofil",
      en: "/en/solutions/google-business-profile",
    },
  },
  {
    path: "/loesungen/content-creation",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/content-creation",
      en: "/en/solutions/content-creation",
    },
  },
  {
    path: "/ki-agenten",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/ki-agenten", en: "/en/ai-agents" },
  },
  {
    path: "/ki-agenten/erstellen",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/ki-agenten/e-commerce",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/werbeanzeigen",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/werbeanzeigen", en: "/en/advertising" },
  },
  {
    path: "/werbeanzeigen/google-ads",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: {
      de: "/werbeanzeigen/google-ads",
      en: "/en/advertising/google-ads",
    },
  },
  {
    path: "/werbeanzeigen/meta-ads",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: {
      de: "/werbeanzeigen/meta-ads",
      en: "/en/advertising/meta-ads",
    },
  },
  {
    path: "/werbeanzeigen/tiktok-ads",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: {
      de: "/werbeanzeigen/tiktok-ads",
      en: "/en/advertising/tiktok-ads",
    },
  },
  {
    path: "/e-commerce",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/e-commerce", en: "/en/e-commerce" },
  },
  {
    path: "/branchen",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: { de: "/branchen", en: "/en/industries" },
  },
  {
    path: "/referenzen",
    priority: 0.7,
    changeFrequency: "weekly",
    languages: { de: "/referenzen", en: "/en/references" },
  },
  {
    path: "/kontakt",
    priority: 0.8,
    changeFrequency: "yearly",
    languages: { de: "/kontakt", en: "/en/contact" },
  },
  {
    path: "/en",
    priority: 1,
    changeFrequency: "weekly",
    languages: { de: "/", en: "/en" },
  },
  {
    path: "/en/about",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: { de: "/ueber-uns", en: "/en/about" },
  },
  {
    path: "/en/solutions",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/loesungen", en: "/en/solutions" },
  },
  {
    path: "/en/solutions/complete",
    priority: 0.9,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/digitalwerk-komplett",
      en: "/en/solutions/complete",
    },
  },
  {
    path: "/en/solutions/seo",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: { de: "/loesungen/seo", en: "/en/solutions/seo" },
  },
  {
    path: "/en/solutions/web-development",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/webentwicklung",
      en: "/en/solutions/web-development",
    },
  },
  {
    path: "/en/solutions/google-business-profile",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/google-unternehmensprofil",
      en: "/en/solutions/google-business-profile",
    },
  },
  {
    path: "/en/solutions/content-creation",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: {
      de: "/loesungen/content-creation",
      en: "/en/solutions/content-creation",
    },
  },
  {
    path: "/en/ai-agents",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/ki-agenten", en: "/en/ai-agents" },
  },
  {
    path: "/en/advertising",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/werbeanzeigen", en: "/en/advertising" },
  },
  {
    path: "/en/advertising/google-ads",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: {
      de: "/werbeanzeigen/google-ads",
      en: "/en/advertising/google-ads",
    },
  },
  {
    path: "/en/advertising/meta-ads",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: {
      de: "/werbeanzeigen/meta-ads",
      en: "/en/advertising/meta-ads",
    },
  },
  {
    path: "/en/advertising/tiktok-ads",
    priority: 0.6,
    changeFrequency: "monthly",
    languages: {
      de: "/werbeanzeigen/tiktok-ads",
      en: "/en/advertising/tiktok-ads",
    },
  },
  {
    path: "/en/e-commerce",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/e-commerce", en: "/en/e-commerce" },
  },
  {
    path: "/en/industries",
    priority: 0.7,
    changeFrequency: "monthly",
    languages: { de: "/branchen", en: "/en/industries" },
  },
  {
    path: "/en/references",
    priority: 0.7,
    changeFrequency: "weekly",
    languages: { de: "/referenzen", en: "/en/references" },
  },
  {
    path: "/en/contact",
    priority: 0.8,
    changeFrequency: "yearly",
    languages: { de: "/kontakt", en: "/en/contact" },
  },
  // Impressum, Datenschutz, and Cookie-Richtlinie (DE and EN) are
  // intentionally excluded: all are set to noindex, and listing noindex
  // pages in the sitemap sends crawlers a contradictory signal.
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.languages
      ? {
          alternates: {
            languages: {
              "de-DE": `${siteConfig.url}${route.languages.de}`,
              en: `${siteConfig.url}${route.languages.en}`,
              "x-default": `${siteConfig.url}${route.languages.de}`,
            },
          },
        }
      : {}),
  }));
}
