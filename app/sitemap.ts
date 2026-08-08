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
  { path: "/ueber-uns", priority: 0.6, changeFrequency: "monthly" },
  {
    path: "/loesungen",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/loesungen", en: "/en/solutions" },
  },
  { path: "/loesungen/digitalwerk-komplett", priority: 0.9, changeFrequency: "monthly" },
  { path: "/loesungen/seo", priority: 0.7, changeFrequency: "monthly" },
  { path: "/loesungen/webentwicklung", priority: 0.7, changeFrequency: "monthly" },
  { path: "/loesungen/google-unternehmensprofil", priority: 0.7, changeFrequency: "monthly" },
  { path: "/loesungen/content-creation", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ki-agenten", priority: 0.8, changeFrequency: "monthly" },
  { path: "/werbeanzeigen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/werbeanzeigen/google-ads", priority: 0.6, changeFrequency: "monthly" },
  { path: "/werbeanzeigen/meta-ads", priority: 0.6, changeFrequency: "monthly" },
  { path: "/werbeanzeigen/tiktok-ads", priority: 0.6, changeFrequency: "monthly" },
  { path: "/e-commerce", priority: 0.8, changeFrequency: "monthly" },
  { path: "/branchen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/referenzen", priority: 0.7, changeFrequency: "weekly" },
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
    path: "/en/solutions",
    priority: 0.8,
    changeFrequency: "monthly",
    languages: { de: "/loesungen", en: "/en/solutions" },
  },
  {
    path: "/en/contact",
    priority: 0.8,
    changeFrequency: "yearly",
    languages: { de: "/kontakt", en: "/en/contact" },
  },
  // Impressum and Datenschutz (DE and EN) are intentionally excluded: all
  // are set to noindex, and listing noindex pages in the sitemap sends
  // crawlers a contradictory signal. The same applies to the still-stub
  // English routes under /en/* not listed above — they're noindex until
  // their full translation ships.
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
            },
          },
        }
      : {}),
  }));
}
