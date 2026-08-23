import type { NextConfig } from "next";

// Report-Only CSP: observes and reports violations without blocking anything.
// This is deliberately NOT an enforcing policy yet — see docs/SEO-MASTER-PLAN.md
// (M3) for why: enforcing this site's inline analytics bootstrap scripts
// (components/analytics/analytics.tsx) requires either a nonce (which forces
// the whole site to dynamic rendering, per Next.js's CSP docs) or 'unsafe-inline'
// (which weakens script-src's core protection) — a real architecture/security
// tradeoff that needs a decision, not something to pick silently here.
//
// Scoped from the site's actual resources, not guessed: script-src/connect-src
// cover all five analytics integrations analytics.tsx supports (only GA4 is
// currently active; the rest are env-var-gated so this policy won't need
// updating if/when they're turned on). frame-src covers the Google Maps embed
// on /kontakt (components/kontakt/map-placeholder.tsx). style-src/font-src are
// 'self' only — confirmed via production HTML that there are zero inline
// <style> tags and next/font self-hosts (no fonts.gstatic.com requests).
const cspReportOnly = `
  default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://connect.facebook.net https://analytics.tiktok.com https://www.clarity.ms;
  connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://www.facebook.com https://analytics.tiktok.com https://www.clarity.ms https://*.clarity.ms;
  style-src 'self';
  img-src 'self' data: https://www.facebook.com;
  font-src 'self';
  frame-src 'self' https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  typedRoutes: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspReportOnly,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
