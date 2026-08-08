import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

type SitemapRoute = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

const routes: SitemapRoute[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/ueber-uns", priority: 0.6, changeFrequency: "monthly" },
  { path: "/loesungen", priority: 0.8, changeFrequency: "monthly" },
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
  { path: "/kontakt", priority: 0.8, changeFrequency: "yearly" },
  // Impressum and Datenschutz are intentionally excluded: both are set to
  // noindex, and listing noindex pages in the sitemap sends crawlers a
  // contradictory signal.
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
