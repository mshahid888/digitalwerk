# DIGITALWERK SEO MASTER PLAN

Living status document for the DigitalWerk KI-Agenten SEO initiative. Updated as phases/tasks complete — historical entries are not rewritten.

**Current production commit:** `9b0bf1f` — feat(seo): wire unused JSON-LD schema helpers into pages

---

## PHASE 1 — SEO STRATEGY & KEYWORD FOUNDATION

**STATUS: MOSTLY COMPLETED**

### COMPLETED:

**1. Keyword research**
- German KI-Agenten keyword research completed.
- Semrush Keyword Magic Tool research completed.
- Dataset found:
  - 801 keywords
  - Total volume: 20,420
  - Average KD: 27%
- Commercial, informational, and transactional keyword clusters were identified.

Important keyword themes include:
- KI-Agenten
- KI-Agenten für Unternehmen
- KI-Agenten Agentur
- KI-Agenten kaufen
- KI-Agenten verkaufen
- KI-Agenten entwickeln
- KI-Agenten automatisieren Prozesse
- Was ist ein KI-Agent?
- Wie baut man einen KI-Agenten?
- KI-Agent vs. Chatbot
- KI-Agenten Beispiele
- KI-Agenten Kosten
- KI-Agenten für E-Commerce

**2. Pillar page**

Main pillar: `/ki-agenten`

Completed:
- SEO title optimized
- Meta description optimized
- H1 optimized around KI-Agenten
- Commercial intent strengthened
- FAQ expanded
- KI-Agent vs. Chatbot comparison added
- Internal CTA structure preserved
- Existing page sections were NOT removed or reordered

**3. Supporting pages**

Created:
- `/ki-agenten/erstellen`
- `/ki-agenten/e-commerce`

Existing page connected:
- `/e-commerce`

Industry contextual connection:
- `/branchen` → `/ki-agenten`

**4. Internal linking**

Completed:
- KI-Agenten pillar → supporting pages
- Supporting pages → relevant existing pages
- `/e-commerce` → KI-Agenten
- `/branchen` → KI-Agenten
- Relevant contextual anchors added
- Footer service links → `/ki-agenten/erstellen` and `/ki-agenten/e-commerce` (added in Phase 2, H2)

**5. Homepage**

IMPORTANT: The homepage already had an established structure.

Completed:
- Existing homepage structure preserved.
- No homepage sections were added, removed, or reordered.
- Existing cards were contextually optimized to mention KI-Agenten where appropriate.

**Phase 1 commits:**
- `0d615ce` — feat(seo): optimize KI-Agenten pillar page
- `68dc356` — feat(seo): add KI-Agenten supporting pages

Both pushed to main and deployed.

### REMAINING PHASE 1 WORK:
- Full mapping of the broader 801-keyword dataset to future content/pages.
  **BLOCKED — dataset not accessible (checked 2026-08-23), see finding below.
  Not unblocked — see "Keyword strategy (2026-08-23)" under Phase 4 for the
  curated substitute built from different sources instead.**
- Identify remaining high-value keyword clusters that deserve dedicated pages.
  **Partially addressed (2026-08-23)** — see the Digital Marketing and
  Leadgenerierung gap findings in the Phase 4 keyword-strategy section.
- Do NOT create pages merely to target low-volume keywords.
- Do NOT change completed Phase 1 pages unless an audit identifies a concrete issue.

**Finding (2026-08-23): the 801-keyword dataset does not exist anywhere in
this repository.** Exhaustive search performed: every file extension a
keyword export could plausibly use (`.csv`, `.xlsx`, `.json`), every
filename containing "keyword", the full `docs/` folder (contains only this
file), the full repo root, and a text search for "801", "Keyword Magic",
and "20,420" across the entire project (excluding `node_modules`) — the
**only** place any of this appears is the summary prose right above (a
handful of aggregate numbers and ~13 illustrative theme names). The actual
row-by-row data — each of the 801 keywords with its own volume, difficulty,
and intent — was never saved into the project. It appears to exist only
wherever the original Semrush Keyword Magic Tool research was run (e.g. a
Semrush export on the researcher's own machine, or a prior conversation
not accessible from this repository), not in version control.

**This blocks Step 42 (Content optimization) and the deeper per-page
content work under Steps 34–38** — none of that can be done without
inventing which keywords apply to which page, which `.claude/SEO-AGENT.md`
explicitly prohibits.

**What's needed to unblock this**: the actual dataset file (CSV/XLSX/JSON
export from Semrush, or equivalent) added to the repository — e.g. under
`docs/keyword-research/`. Per `.claude/SEO-AGENT.md`, SEMrush is not part
of the current workflow, so this can't be re-fetched automatically; it
needs to be provided.

---

## PHASE 2 — TECHNICAL SEO FOUNDATION

**STATUS: PARTIALLY COMPLETED**

### COMPLETED (pre-audit):

**1. Crawlability**
- robots.txt exists
- sitemap.xml exists
- Production sitemap verified
- Production robots.txt verified

**2. URL architecture**
- German route structure exists
- English route structure exists
- Existing URLs preserved
- New KI-Agenten routes added
- Sitemap updated for new routes

**3. Breadcrumb architecture**

Completed and deployed:
- Breadcrumb component
- German breadcrumb labels
- English breadcrumb labels
- Breadcrumb navigation
- BreadcrumbList JSON-LD

**4. Structured data architecture**

Completed and deployed:
- Organization / ProfessionalService schema
- Stable organization `@id`
- Shared JSON-LD component
- Schema helper architecture
- BreadcrumbList JSON-LD
- Service schema foundation
- ContactPage schema foundation
- WebSite schema foundation
- Old LocalBusiness schema removed

**5. Technical validation** — TypeScript, ESLint, production build, isolation testing, production deployment verification all completed successfully at each commit.

**Phase 2 schema/breadcrumb commit:**
- `ffdca8a` — feat(seo): add schema and breadcrumb architecture

Pushed to main and deployed.

### PHASE 2 TECHNICAL SEO AUDIT (completed)

A full technical SEO audit (crawlability, indexability, metadata, canonicals, internal linking, HTTP/URL health, sitemap, schema, performance, mobile SEO, rendering/crawlability, security basics) was performed against production. Result:

- **Critical issues found: none.**
- **High-priority issues found: 2 (H1, H2)** — both now resolved, see below.
- **Medium/low-priority issues found: 5** (M1–M5, not yet implemented — see "Remaining Phase 2 Work").
- Clean findings confirmed during the audit (no action needed): all 42 pages have unique, non-duplicate titles/descriptions; sitemap contains exactly the 36 indexable routes (1:1 match, no orphans, no noindex leaks); all 6 legal pages correctly `noindex`; canonicals correct and absolute on every page checked; hreflang correct; HTTPS/HSTS/security headers present; fully server-rendered static HTML on all but `/api/kontakt`; `next/font` self-hosted fonts; conditional/deferred analytics scripts.

### H1 — robots.txt

**STATUS: ✅ COMPLETE / LIVE**

**Commit:** `cbf90f7` — fix(seo): improve robots and footer internal links

**Implemented:**
- `Disallow: /api/` added
- `Host: https://digitalwerkk.de` added

**Lifecycle:** Implemented → Committed → Pushed → Deployed → Production Verified — all 5 stages complete.

**Production verification:**
- Deployment is READY and live.
- `/robots.txt` returns HTTP 200.
- Content confirmed exactly:
  ```
  User-Agent: *
  Allow: /
  Disallow: /api/

  Host: https://digitalwerkk.de
  Sitemap: https://digitalwerkk.de/sitemap.xml
  ```

### H2 — Footer internal links

**STATUS: ✅ COMPLETE / LIVE**

**Commit:** `cbf90f7`

**Implemented:**
- "KI-Agenten erstellen" → `/ki-agenten/erstellen`
- "KI-Agenten für E-Commerce" → `/ki-agenten/e-commerce`
- Added to `footerServiceLinks` (German footer only — no English equivalents exist for these pages yet).
- Header/primary navigation deliberately left unchanged — `/ki-agenten` remains the sole primary nav destination; the two supporting pages are not header nav items.

**Lifecycle:** Implemented → Committed → Pushed → Deployed → Production Verified — all 5 stages complete.

**Production verification:**
- Verified on: `/`, `/ki-agenten`, `/ki-agenten/erstellen`, `/ki-agenten/e-commerce`, `/branchen`, `/e-commerce`, `/kontakt`.
- All tested pages returned HTTP 200.
- Links confirmed actually rendered inside `<footer>` (position-verified against the `<footer>...</footer>` boundaries, correct styling class confirmed).
- No malformed or unexpected duplicate links — all observed link counts fully explained by known, intentional sources (footer + pre-existing Phase 3 contextual links).
- Header/primary navigation confirmed unchanged — only `/ki-agenten` present in `<nav aria-label="Hauptnavigation">`.

### H1/H2 regression verification

- TypeScript: **PASS**
- ESLint: **PASS**
- Production build: **PASS**
- 50 routes generated
- Phase 1 KI-Agenten content: **PASS**
- Phase 3 supporting pages: **PASS**
- Breadcrumbs: **PASS**
- Schema/JSON-LD: **PASS**
- No new 404s
- No runtime/application errors
- Vercel error monitor: 0 error clusters / 0 affected routes during verification

**H1/H2 commit:** `cbf90f7` — fix(seo): improve robots and footer internal links

Pushed to main and deployed.

### REMAINING PHASE 2 WORK

Not yet implemented — deferred per explicit scoping, not forgotten:

| ID | Finding | Severity | Status |
|---|---|---|---|
| M1 | New `buildContactPageJsonLd`/`buildServiceJsonLd`/`buildWebSiteJsonLd` schema helpers defined but not called by any page yet (`/kontakt` and the two KI-Agenten supporting pages still use disconnected inline JSON-LD) | Medium | ✅ COMPLETE / LIVE — see "M1 — Schema helper wiring" below |
| M2 | 2-hop redirect chain (HTTP apex → HTTPS apex → HTTPS www) | Low-Medium | NOT STARTED (Vercel domain config, not app code) |
| M3 | No `Content-Security-Policy` header | Low | ✅ CLOSED (Report-Only, deferred/monitored — user decision 2026-08-23) — see "M3 — Content-Security-Policy" below |
| M4 | Core Web Vitals (LCP/INP/CLS) unverified — no authenticated Lighthouse/PSI access in the audit environment | Medium | BLOCKED (re-attempted 2026-08-23 with real avenues, all closed — see below) |
| M5 | `lib/metadata.ts` pending `absoluteUrl()`-based canonical rewrite — robustness improvement, not a live bug (live canonicals already verified correct) | Low | ✅ COMPLETE / LIVE (2026-08-23, commit `c60da5b`) — see the OG-metadata resolution write-up under Step 33 (Phase 4) |

Do NOT mark M2/M4 as completed without explicit approval or real evidence respectively. M1/M3/M5 are resolved — see their write-ups.

### M1 — Schema helper wiring

**STATUS: ✅ COMPLETE / LIVE**

**Commit:** `9b0bf1f` — feat(seo): wire unused JSON-LD schema helpers into pages

**Implemented:**
- `/kontakt` and `/en/contact`: inline `contactPageJsonLd` object + raw `<script>` replaced with `<JsonLd data={buildContactPageJsonLd(path, locale)} />`.
- `/ki-agenten/erstellen` and `/ki-agenten/e-commerce`: inline `serviceJsonLd` object + raw `<script>` replaced with `<JsonLd data={buildServiceJsonLd({ path, name, description, locale })} />`. `Service.provider` now references the single canonical Organization entity (`{"@id": "https://www.digitalwerkk.de#organization"}`) instead of a duplicated inline Organization block.
- `components/layout/site-shell.tsx`: `buildWebSiteJsonLd()` wired in alongside the existing `buildOrganizationJsonLd()`, so `WebSite` schema now renders site-wide (both locales) exactly once per page.

**Lifecycle:** Implemented → Committed → Pushed → Deployed → Production Verified — all 5 stages complete.

**Isolation method:** the two contact pages had pre-existing, unrelated uncommitted edits (phone-number removal) in the working tree. Isolated via `git stash push` (full pre-existing dirty set) → clean HEAD baseline → made the M1 edit → validated → committed → pushed → `git stash pop` (3-way merge restored the unrelated edits cleanly, still uncommitted, exactly as before).

**Validation:** `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` — 50/50 routes generated successfully (all static, meaning every schema builder executed without error at build time, including `buildWebSiteJsonLd` via `SiteShell` on every route).

**Production verification (2026-08-23):**
- `https://www.digitalwerkk.de/kontakt` — 5 JSON-LD blocks present: `Organization`/`ProfessionalService`, `WebSite`, `BreadcrumbList`, `ContactPage`, `FAQPage`. No duplicates.
- `https://www.digitalwerkk.de/ki-agenten/erstellen` — 5 JSON-LD blocks: `Organization`/`ProfessionalService`, `WebSite`, `BreadcrumbList`, `Service`, `FAQPage`. `Service.provider` correctly resolves to the site's Organization `@id`. Canonical confirmed correct.

### M3 — Content-Security-Policy (2026-08-23)

**STATUS: ⚠️ PARTIALLY COMPLETE.** Report-Only shipped, deployed, and
verified live. Enforcing mode is a genuine architecture/security decision,
documented below and **not implemented** — stopping at this decision point
per instruction.

**Analysis performed** (source-code + live-production audit, not assumed):

- **Inline scripts**: `components/analytics/analytics.tsx` renders up to 5
  `next/script` blocks, each gated behind an unset env var — only
  `NEXT_PUBLIC_GA_MEASUREMENT_ID` is currently set. Each integration's
  bootstrap code (`ga4-init`, `gtm-init`, `meta-pixel-init`,
  `tiktok-pixel-init`, `clarity-init`) is an **inline** `<Script id="...">`
  block with `strategy="afterInteractive"` — none carry a `nonce` or hash
  today.
- **GA4**: confirmed live via network trace — `gtag.js` loads from
  `googletagmanager.com` (200), and the actual collection beacon fires to
  **`region1.google-analytics.com/g/collect`** (a regional subdomain, not
  the plain `www.google-analytics.com` one initially assumed) — this
  changed the policy from a single fixed domain to a
  `https://*.google-analytics.com` wildcard in `connect-src`.
- **GTM/Meta/TikTok/Clarity**: not currently active (env vars unset) but
  `analytics.tsx` is explicitly designed for later activation with no code
  change, so the policy pre-allowlists all four now rather than needing an
  update the day one gets turned on. **Caveat recorded, not solved**: GTM's
  entire purpose is injecting arbitrary tags without a code deploy, which
  is fundamentally in tension with a strict CSP allowlist — if GTM is ever
  actually used to add tags beyond what's hardcoded today, the policy will
  need per-tag updates.
- **Third-party resources**: one `<iframe>` (Google Maps embed,
  `components/kontakt/map-placeholder.tsx`, `/kontakt` only) requiring
  `frame-src https://www.google.com`.
- **Next.js requirements**: confirmed via production HTML — zero inline
  `<style>` tags (Tailwind compiles to one external stylesheet), zero
  external font requests (`next/font` self-hosts, per the earlier Phase 2
  finding), zero `<img>`/`next/image` usage (per the Step 44 finding) — so
  `style-src`, `font-src`, and `img-src` can all stay tight (`'self'`,
  `'self'`, `'self' data:` respectively) with no third-party exceptions
  needed beyond Facebook's pixel fallback image.
- **Nonce-based CSP practicality**: checked against
  `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`
  (this project's actual Next.js 16.3.0 docs, not assumed from training
  data — this version renamed `middleware.ts` to `proxy.ts` for this
  purpose, a real breaking change). Per that doc: nonces require a
  `proxy.ts` that generates a fresh nonce per request, and **"all pages
  must be dynamically rendered"** — static generation, ISR, and CDN caching
  are all disabled site-wide. This site is currently **100% statically
  generated** (50/50 routes, confirmed via this session's own build
  output) — adopting nonces would be a real architecture change with real
  performance/cost consequences, not a drop-in fix.
- **Components needing modification for nonces**: `analytics.tsx` (every
  inline `Script` would need a `nonce` prop sourced from `headers()`), a
  new `proxy.ts` (doesn't exist yet), and every page would need to either
  accept dynamic rendering or use `connection()` to opt in — effectively a
  site-wide rendering-strategy change.
- **Alternative — Subresource Integrity (SRI)**: Next.js 16 offers
  experimental hash-based CSP as a static-generation-compatible
  alternative to nonces. Rejected as a same-session solution: explicitly
  experimental, App-Router-only features can change/break, and the docs
  themselves note SRI "cannot handle dynamically generated scripts" — this
  site's inline analytics bootstraps interpolate a build-time env-var
  value into the script body, and it's not established from the docs alone
  whether that counts as "dynamically generated" for SRI's purposes.
  Untested here; not assumed safe.
- **CSP Report-Only**: usable immediately, no rendering-strategy change,
  **never blocks anything by definition** — the safe first step.

**Recommended safest approach (this pass): ship Report-Only now; decide
nonce-vs-unsafe-inline-vs-SRI later, with real violation data in hand.**

**Implemented — Report-Only only:**

**Commit:** `2ca18f9` — feat(seo): add Content-Security-Policy in
Report-Only mode.

`next.config.ts` — added `Content-Security-Policy-Report-Only` to the
existing `headers()` array (same pattern as the pre-existing
`X-Content-Type-Options`/`X-Frame-Options`/`Referrer-Policy` headers, no
new mechanism introduced). Policy: `default-src 'self'`; `script-src`
allows `'self'` + the four analytics domains
(`googletagmanager.com`, `connect.facebook.net`, `analytics.tiktok.com`,
`clarity.ms`); `connect-src` adds their collection-endpoint domains
(including the `*.google-analytics.com` wildcard); `style-src`/`font-src`
are `'self'` only; `img-src` is `'self' data:` + Facebook's pixel-fallback
domain; `frame-src` is `'self' https://www.google.com` for the Maps embed;
`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`,
`frame-ancestors 'none'`, `upgrade-insecure-requests`. No `report-uri`/
`report-to` configured yet (no collector endpoint exists) — violations are
visible in each browser's own devtools, not centrally aggregated. Note:
`script-src`/`style-src` intentionally have **no** `'unsafe-inline'` and
**no** nonce, so this policy — once switched to enforcing — **would**
currently block the inline analytics bootstrap scripts. That's the point:
Report-Only surfaces this now, safely, ahead of the enforcing-mode
decision.

**Lifecycle:** Implemented → Validated (`npx tsc --noEmit` clean,
`npm run lint` clean, `npm run build` — 50/50 routes, all still static,
confirming Report-Only doesn't force dynamic rendering) → Committed →
Pushed → Deployed (`dpl_E6SQkDauBExQA46FNn6i4pkGGUzJ`, READY, aliased to
`www.digitalwerkk.de`) → Production Verified — all 5 stages complete.

**Production verification (2026-08-23):**
- `curl -sD - https://www.digitalwerkk.de/` — header present, byte-for-byte
  the intended policy.
- Live browser check (homepage): network trace showed `gtag.js` (200) and
  the GA4 collection beacon to `region1.google-analytics.com/g/collect`
  both completing normally — **analytics functions identically to before**,
  confirming Report-Only mode blocks nothing, as designed. (This same
  trace is what surfaced the `region1.` regional subdomain, correcting the
  policy's `connect-src` before this was even called "final.")
- Live browser check (`/kontakt`): confirmed the Google Maps `<iframe>`
  element still renders with a `google.com/maps` `src`.
- Console-level CSP violation messages were not independently visible
  through this session's console-reading tool (a tooling limitation —
  native browser security warnings may not surface through the same
  channel as page `console.*()` calls, not evidence of anything wrong);
  the network-level and header-level checks above are the load-bearing
  verification, and Report-Only's non-blocking behavior is guaranteed by
  the CSP spec regardless.

**Decision point — enforcing mode (not implemented, stopping here):**

Three real options exist to move from Report-Only to actually enforcing,
none of them a free technical fix:

| Option | Keeps static generation? | Security strength | Cost |
|---|---|---|---|
| **A. Nonce + `strict-dynamic`** | ❌ No — forces site-wide dynamic rendering (`proxy.ts`, per Next.js 16 docs) | Strongest | Real: loses CDN caching, slower TTFB, higher server load/cost |
| **B. `'unsafe-inline'` for scripts** | ✅ Yes | Weak — defeats most of CSP's script-injection protection | Low engineering cost, but a real security-posture compromise |
| **C. Subresource Integrity (experimental)** | ✅ Yes | Strong for static assets | Experimental/App-Router-only; untested against this site's inline, env-var-interpolated analytics bootstraps |

This is exactly the kind of "significant architecture/security tradeoff"
that shouldn't be picked autonomously. **Awaiting a decision on A vs. B vs.
C** (or: stay in Report-Only indefinitely as monitoring-only, which is
also a legitimate choice) before enforcing mode is implemented.

**DECISION (user, 2026-08-23): remain in Report-Only mode. Do not switch
to enforcing. Do not use `'unsafe-inline'`, nonce-based dynamic rendering,
or experimental SRI at this stage.**

**STATUS: ✅ M3 CLOSED as "Report-Only, deferred/monitored" — this is the
policy's intended, final state for now, not a partial/incomplete status.**
CSP enforcement (options A/B/C above) is explicitly deferred technical
work, to be revisited only on a future explicit decision — not something
to re-propose or re-litigate autonomously. The Report-Only header
(`2ca18f9`) stays active in production as ongoing, passive monitoring:
it costs nothing, blocks nothing, and any future browser-reported
violation pattern (if a `report-uri`/`report-to` collector is ever added)
would inform whichever enforcing option is eventually chosen. No further
action on M3 unless/until the user revisits the A/B/C decision.

---

## PHASE 3 — GOOGLE SEARCH CONSOLE & MEASUREMENT

**STATUS: IN PROGRESS** — 6 of 10 steps COMPLETE + VERIFIED (23, 24, 25, 26, 30, 31); 1 not authorized (27); 2 blocked on Google-side processing (28, 29); 1 undefined scope (32). This section reflects real GSC/GA4 evidence gathered 2026-08-23, superseding the earlier "NOT STARTED" placeholder — see `.claude/SEO-AGENT.md` for the operating rules driving this phase going forward.

**Step 23 — Google Search Console: ✅ COMPLETE + VERIFIED**
Domain property created for `digitalwerkk.de` under the account's Google identity.

**Step 24 — Domain verification: ✅ COMPLETE + VERIFIED**
Verified via DNS TXT record (`google-site-verification=...`) added at the domain's DNS provider (IONOS), host `@`, as a separate record alongside all pre-existing records (none modified/removed). GSC returned "Ownership auto verified" via the Domain name provider method.

**Step 25 — Sitemap submission: ✅ COMPLETE + VERIFIED**
`https://www.digitalwerkk.de/sitemap.xml` submitted. GSC status: **Success**. Discovered pages: **36** (matches `app/sitemap.ts`'s route count exactly — no orphans, no gaps).

**Step 26 — URL Inspection: ✅ COMPLETE**
All 7 priority pages inspected (`/`, `/ki-agenten`, `/ki-agenten/erstellen`, `/ki-agenten/e-commerce`, `/branchen`, `/e-commerce`, `/kontakt`). None are indexed yet (expected — property verified only days ago). 6 of 7 show "URL is unknown to Google"; `/e-commerce` shows "Discovered - currently not indexed" (Google has seen it via the sitemap and a referring link from `/impressum`, hasn't crawled it yet). Homepage Live Test: "available to Google," HTTP 200. No robots/noindex/redirect blocks found on any inspected page.

**Step 27 — Request indexing: NOT AUTHORIZED**
Requires explicit per-instance user approval every time — never assumed, even under the standing operating rules in `.claude/SEO-AGENT.md`. Not requested for any URL so far.

**Step 28 — Check indexed/excluded pages: BLOCKED**
GSC → Indexing → Pages report has not finished processing for this newly-verified property: "Processing data, please check again in a day or so" (both the summary widget and the "Why pages aren't indexed" breakdown table are empty). Not a technical fault — Google-side processing delay. Retry later; do not loop on it repeatedly.
**Re-checked 2026-08-23 (later same day): unchanged, still processing.** Not retrying again this session.

**Step 29 — Google-selected canonical: BLOCKED (depends on Step 28)**
For the homepage, both "User-declared canonical" and "Google-selected canonical" show `N/A` in the Index view — expected, since Google assigns a canonical only after indexing. Not yet checked for other pages.

**Step 30 — Security & Manual Actions: ✅ COMPLETE + VERIFIED**
GSC → Security & Manual Actions, both sub-reports checked directly (not gated by the Step 28 processing delay, as anticipated): **Security issues — "No issues detected."** **Manual actions — "No issues detected."**

**Step 31 — GA4: ✅ COMPLETE + VERIFIED**
Account "DigitalWerk", property "DigitalWerk" (Internet & Telecom, Germany, EUR), web stream "DigitalWerk Website" → `https://www.digitalwerkk.de`. Measurement ID `G-YXGMNDPP14` wired into `components/analytics/analytics.tsx` via `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Vercel Production + Preview). Confirmed live: GA4 Realtime overview showed 1 active user in the last 30 minutes from real production traffic.

**Step 32 — Connect other required analytics: SCOPE UNDEFINED**
Not started — "other required analytics" isn't defined anywhere in this plan or by the user yet. `components/analytics/analytics.tsx` already supports GTM/Meta Pixel/TikTok Pixel/Clarity (all inactive, gated behind unset env vars) if/when one of these is actually decided as needed. Do not activate any of them without an explicit decision on what's required.

**SEMrush**: evaluated and explicitly excluded from the workflow (not necessary at DigitalWerk's current stage — see prior audit). A "RankyTools" group-buy/shared-account service was also investigated and rejected (no official SEMrush relationship, no API/MCP, likely violates SEMrush's own Terms of Service). Neither is depended on anywhere in this plan.

Original Phase 3 scope (for reference — now tracked step-by-step above instead):

- Google Search Console: verify property, indexing, crawl errors, excluded pages, sitemap processing
- Sitemap submission and discovered-URL confirmation
- URL Inspection across the priority page list
- Index coverage: indexed / excluded / crawled-not-indexed / canonical issues
- Search performance baseline: impressions, clicks, CTR, average position, KI-Agenten keyword performance (not yet reachable — no Performance data exists for a property this new)
- Analytics/conversion tracking: GA4, lead/contact conversions, CTA clicks, SEO conversion baseline (GA4 connected; conversion/CTA event tracking not yet implemented)

---

## PHASE 4 — ON-PAGE SEO

**STATUS: IN PROGRESS** (roadmap Steps 33–46, first pass 2026-08-23 via source-code audit — no live content changed)

Phase 3's remaining items (27 not authorized, 28/29 blocked on Google, 32
undefined scope) are not currently executable, so per the roadmap's
dependency/order rules the next executable work is Phase 4. This pass
audited the SEO **elements** (Steps 39–46), since they cut across every
page and several were already substantially handled by earlier phases;
per-page-type review (Steps 33–38) is folded into the same findings below
rather than repeated separately.

**Step 39 — Title tags: ✅ COMPLETE + VERIFIED (existing implementation)**
Already verified in the Phase 2 technical audit: all 42 pages have unique,
non-duplicate titles via the shared `buildMetadata()` helper. Not
re-audited from scratch — recorded per `.claude/SEO-AGENT.md`'s rule that
existing verified work isn't repeated.

**Step 40 — Meta descriptions: ✅ COMPLETE + VERIFIED (existing implementation)**
Same basis as Step 39 — Phase 2 already verified all 42 pages have unique
descriptions via `buildMetadata()`.

**Step 41 — H1/H2/H3 structure: ✅ COMPLETE + VERIFIED**
Fresh source audit (2026-08-23): every heading site-wide renders through
one shared `components/ui/heading.tsx` component, which decouples semantic
`level` (the actual `<h1>`–`<h4>` tag) from visual `size` — this exists
specifically to let a heading sit correctly in the document outline without
skipping a level. Exactly 7 direct `level={1}` usages exist, each a
distinct page-template's hero/intro component (`service-page/hero.tsx`,
`shared/page-intro.tsx`, `home/hero.tsx`, `app/en/page.tsx`'s own hero
block, `layout/not-found-content.tsx`, `legal/legal-page.tsx`,
`(de)/error.tsx`) — confirmed one H1 per page composition pattern, no
page composes two of them together, no duplicate H1s found.

**Step 42 — Content optimization: NOT STARTED (prerequisite substitute now available, awaiting approval)**
Previously blocked on Phase 1's still-open item: "Full mapping of the
broader 801-keyword dataset to future content/pages" (see Phase 1
"REMAINING PHASE 1 WORK"). That original dataset remains inaccessible and
this does **not** claim to have found or reconstructed it. Instead, a
curated keyword strategy built from the 99 recovered historical terms and
the 64 real Semrush-sourced rows (see "Keyword strategy (2026-08-23)"
below) now gives a non-invented basis for keyword-to-page decisions on 7
of the site's clusters. Content optimization itself has **not** begun —
this strategy is a proposal awaiting your review (see
`docs/keyword-research/KEYWORD-STRATEGY.md`, "Next step").

**Step 43 — Internal links: ✅ COMPLETE + VERIFIED (2026-08-23)**
Full site-wide broken-link/orphan-page crawl performed via direct
source-code cross-reference (not a live browser crawl): every `href`
in `lib/navigation.ts` (`primaryNav`, `primaryNavEn`, all four footer
link groups, DE + EN) was diffed against the complete 42-route list
derived directly from `app/**/page.tsx` on disk. Result: **exact 1:1
match — every route is nav-linked, no orphans, no broken nav links.**
Separately grepped every inline `href="/..."` JSX literal outside
`navigation.ts` (28 contextual in-body links across pages/components,
e.g. `/branchen`→`/ki-agenten`, `/e-commerce`→`/ki-agenten/e-commerce`,
`/ki-agenten`↔its two supporting pages, homepage/solutions CTAs): **every
one resolves to a real route.** No broken or orphaned internal links found
anywhere in the codebase.

**Step 44 — Images/alt text: N/A — confirmed by source audit**
Grepped the entire codebase for `<img`, `next/image`, and `Image` imports:
**zero matches anywhere.** The site is built entirely from typography,
`lucide-react` icons, and CSS — there is no raster image inventory to have
alt text on. Nothing to fix; this step doesn't apply to the current design
system.

**Step 45 — Schema: ✅ COMPLETE + VERIFIED (existing implementation)**
Fully covered by Phase 2's schema architecture plus the M1 fix above:
Organization/ProfessionalService, WebSite, BreadcrumbList, ContactPage,
Service, and FAQPage schema are all wired and verified live in production
(see M1 above). Not re-audited — already has direct production evidence
from today.

**Step 46 — Conversion/CTA optimization: NEEDS HUMAN STRATEGIC INPUT**
What CTA copy/offers/placement to use is a business decision, not a
technical or data-derivable one — `.claude/SEO-AGENT.md` prohibits inventing
strategy. Not started; needs direction before any CTA content changes.

**Step 33 — Homepage SEO: ✅ COMPLETE + VERIFIED**

**Decision (user, 2026-08-23):** update the homepage title and meta
description to include "KI-Agenten".

**Commits:** `fcc965f` (initial change) + `0fb2161` (fix-up, see below).

**Implemented:** `app/(de)/page.tsx` title override changed to
`"DigitalWerk — KI-Agenten & digitaler Wachstumspartner"`; description
changed to swap "KI-Automatisierung" for "KI-Agenten". H1 and homepage
structure intentionally left untouched (outside this approval's scope).

**Real issue found and fixed during production verification:** the first
version of this change (`fcc965f`) used title `"KI-Agenten & digitaler
Wachstumspartner"` with no brand name, assuming the `(de)` layout's
`title.template` ("%s | DigitalWerk") would apply automatically the same
way it does for nested pages (verified live: `/kontakt` renders "Kontakt |
DigitalWerk"). Live production check showed the **homepage does not
inherit that template for its own same-segment `page.tsx`** — the title
rendered with no "DigitalWerk" anywhere in it, a genuine regression.
Fixed in `0fb2161` by including the brand name explicitly in the title
string. **Technical note for future title-override work on this exact
route**: `app/(de)/page.tsx` (and presumably `app/en/page.tsx`) do not
get the parent layout's title template applied the way every other page
does — any future title override on the homepage route must include the
brand name explicitly rather than relying on the template.

**Production verification (2026-08-23):**
`https://www.digitalwerkk.de/` — `document.title` = "DigitalWerk —
KI-Agenten & digitaler Wachstumspartner", `<meta name="description">`
contains "KI-Agenten aus einer Hand", canonical unaffected
(`https://www.digitalwerkk.de/`).

**Secondary observation (not fixed — out of scope, pre-existing,
sitewide, not a regression):** `og:title` and `og:description` on both
the homepage and `/kontakt` (checked as a control) show generic,
brand-only values ("DigitalWerk" / the sitewide default description)
instead of each page's own title/description. This is not new — it
predates today's changes and affects every page equally, not just the
homepage. Likely related to M5 (`lib/metadata.ts` robustness). Not
investigated further or fixed here since it wasn't part of what was
approved; flagging for a future, separate decision.

**Re-confirmed still live (2026-08-23), root cause NOT found — needs its
own dedicated investigation, not attempted here.** Re-checked via fresh
`curl` against production: both `/` and `/kontakt` still show the
identical generic `og:title="DigitalWerk"` and the sitewide default
`og:description`, not page-specific values. Traced as far as source +
Next.js's own docs allow without deeper build-level debugging:
`lib/metadata.ts`'s `buildMetadata()` does construct a page-specific
`openGraph.title`/`openGraph.description` internally (uses `pageTitle`/
`pageDescription`, which are correctly derived from each page's
`overrides.title`/`description` — confirmed by reading the source), and
per `node_modules/next/dist/docs/.../generate-metadata.md`'s own
documented merge rule ("Metadata objects exported from multiple segments
... are shallowly merged ... Duplicate keys are replaced ... metadata with
nested fields such as `openGraph` ... defined in an earlier segment are
overwritten by the last segment to define them"), `/kontakt/page.tsx`'s
own `openGraph` (non-undefined) *should* fully replace
`(de)/layout.tsx`'s generic one. It doesn't, in production. This
contradicts both the source-level reasoning and the documented behavior,
so the actual cause is unknown — not simply "page doesn't override
openGraph" (it does) and not simply "Next merges differently than
expected" (the docs match the expected behavior). Ruled out as a
same-session fix: this needs real build-output-level debugging (not just
source reading), and any change touches `lib/metadata.ts`, which every
one of the site's 50 routes' social-sharing tags depends on — too broad a
blast radius to guess at a fix. Flagged as its own investigation task,
not folded into M5 without first confirming they're actually the same
root cause.

**✅ RESOLVED (2026-08-23), root cause narrowed to Vercel build-side, not
source code — fixed via a real robustness change that also served as the
empirical test.** Build-level debugging (as flagged above) performed:

1. **Ruled out a source bug conclusively.** `rm -rf .next && npm run build`
   (fully clean, zero cache, current committed HEAD) produced **correct,
   page-specific** `og:title`/`og:description` locally for both `/` and
   `/kontakt` — proving the committed source was never actually wrong.
2. **Ruled out stale CDN/edge caching.** The generic production response
   had `X-Vercel-Cache: PRERENDER` and `Age: 0` — a fresh prerendered
   response from the live deployment itself, not a cached one.
3. **Conclusion:** the discrepancy was specific to Vercel's own build
   output for this route's metadata on that deployment — most consistent
   with Vercel's persistent build cache (restored between deployments for
   faster incremental builds) reusing a stale prerendered metadata
   fragment for routes whose own file hadn't changed in a while, though
   this couldn't be directly inspected/confirmed (no tool access to
   Vercel's internal build cache). Not stated as certain — recorded as the
   most evidence-consistent explanation, not a confirmed root cause.

**Commit:** `c60da5b` — fix(seo): merge openGraph/twitter defensively, fix
duplicate brand name in OG title.

**Implemented:** `lib/metadata.ts` — `openGraph`/`twitter` are now built
into standalone `defaultOpenGraph`/`defaultTwitter` objects and explicitly
merged **after** the `...overrides` spread (`{ ...defaultOpenGraph,
...overrides.openGraph }`), so a future page passing a *partial*
`openGraph` override (e.g. just a custom image) can no longer silently
drop `url`/`locale`/`siteName`/`title`/`description` — a real robustness
gap regardless of the caching question. This content change forced
Vercel to recompute the route's output on the next deploy, which is what
resolved the discrepancy in practice.

**Bonus fix, found while in this code:** the homepage's `og:title`/
`twitter:title` showed **"DigitalWerk — KI-Agenten & digitaler
Wachstumspartner | DigitalWerk"** — the brand name twice. `pageTitle`
always appended `| DigitalWerk`, but the homepage's title override
already embeds the brand explicitly (the Step 33 `title.template`
workaround). Fixed: `pageTitle` now skips the suffix when
`overrides.title` already contains `siteConfig.name`. Verified this
doesn't change behavior for any other page — none of the other ~40 pages'
title overrides include the brand name.

**Lifecycle:** Implemented → Validated (`npx tsc --noEmit` clean,
`npm run lint` clean, `rm -rf .next && npm run build` — 50/50 routes,
confirmed correct output locally before pushing) → Committed → Pushed →
Deployed (`dpl_5CResndWgtQ5b7QNHSXy9yQTpdfE`, READY, aliased to
`www.digitalwerkk.de`) → Production Verified — all 5 stages complete.

**Production verification (2026-08-23):** fresh `curl` against all three
of `/`, `/kontakt`, and `/ki-agenten`:
- `/` — `og:title="DigitalWerk — KI-Agenten & digitaler Wachstumspartner"`
  (brand appears once, not twice), `og:description` matches the
  homepage's own description.
- `/kontakt` — `og:title="Kontakt | DigitalWerk"`, `og:description`
  matches Kontakt's own description (previously both were the generic
  sitewide defaults).
- `/ki-agenten` — `og:title="KI-Agenten für Unternehmen: Kundenservice &
  Termine automatisieren | DigitalWerk"`, `og:description` matches that
  page's own description.

All three now show correct, page-specific, non-duplicated values. M5
(`lib/metadata.ts` robustness) can be considered addressed by this same
change — the underlying `openGraph`/`twitter` merge-order fragility M5
was tracking is exactly what this commit fixed.

### M4 — Core Web Vitals (re-attempted 2026-08-23, still blocked)

Per instruction, tried every real avenue actually accessible this
session rather than restating the old "no API key" note unchanged:

- **Google PageSpeed Insights, unauthenticated public endpoint**:
  `GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.digitalwerkk.de/&strategy=mobile` —
  returned HTTP 429: `"Quota exceeded for quota metric 'Queries' and limit
  'Queries per day'"`. This is a shared global quota for unauthenticated
  callers (not specific to this project) — already exhausted by other
  traffic. A real Google Cloud API key would remove this limit but
  creating one is an account-level action outside this session's
  authority.
- **Vercel Web Analytics / Speed Insights**: queried directly via the
  Vercel API (`get_web_analytics`) — `400: "web_analytics_not_enabled"`.
  Confirms the earlier source-level finding (no `@vercel/analytics` or
  `@vercel/speed-insights` package installed) with a direct platform
  response. Enabling Speed Insights requires adding the
  `@vercel/speed-insights` package and mounting `<SpeedInsights />` — a
  real product/cost decision (Vercel Speed Insights has its own pricing
  beyond the Hobby plan's free tier limits), not something to add
  silently as a side effect of an audit.
- **Single-sample client-side extraction** (`performance.getEntriesByType`
  in a live browser tab on the production homepage): attempted as a
  fallback; `paint`/`largest-contentful-paint` entries came back empty
  despite the page having fully loaded, making the sample unreliable.
  **Not reported as real CWV data** — a single sample from an
  automated-browser context (unknown throttling profile, not real-user
  monitoring, not a proper Lighthouse lab run) wouldn't be credible
  Core-Web-Vitals evidence even if it had come back complete, and
  `.claude/SEO-AGENT.md`'s GA4/GSC rule against fabricating or estimating
  performance data as real applies here too.

**Fourth avenue checked (2026-08-23): GSC's own Core Web Vitals report**
(Experience → Core Web Vitals in the left nav) — a genuinely free, no-key,
real-field-data source that hadn't been checked yet this session. Both
Mobile and Desktop show: **"Not enough usage data in the last 90 days for
this device type."** This is GSC surfacing Chrome UX Report (CrUX) field
data, which requires meaningful real-world traffic volume to populate —
consistent with GA4 showing only a handful of real visitors so far (this
is a newly-verified property). Not a missing-access problem this time;
the site genuinely doesn't have enough traffic yet for CrUX to report on.

**STATUS: remains BLOCKED — now for four independently-confirmed
reasons**, not just the original one: (1) unauthenticated PSI quota
exhausted, (2) Vercel Speed Insights not enabled (cost/product decision
needed), (3) a single-sample browser extraction is not credible CWV
evidence, (4) GSC's own CrUX-backed report has insufficient real-world
traffic to report anything yet. No further action possible without
either a real Google API key, a decision to enable Vercel Speed Insights,
or simply more time/traffic for CrUX to accumulate data naturally. Not
retrying again this session per the "don't loop on a known blocker"
rule — flagging for your decision: get/provide a PSI API key, approve
enabling Speed Insights, or accept that this will resolve itself
naturally once the site has more real traffic.

Original write-up before the decision (kept for the historical record):
Live source audit of the homepage (`app/(de)/page.tsx` + `components/home/*`):
- Body content already mentions the primary "KI-Agenten" keyword cluster
  in 3 places (`services-overview.tsx`, `solution-pillars.tsx`,
  `komplett-callout.tsx`) — matches Phase 1's claim that "existing cards
  were contextually optimized."
- **However: the homepage `<title>` tag ("DigitalWerk — Ihr digitaler
  Wachstumspartner"), meta description, and H1 ("Mehr Kunden. Mehr
  Sichtbarkeit. Mehr Wachstum – digital.") contain no "KI-Agenten" keyword
  at all** — the meta description mentions "KI-Automatisierung" (a related
  but different term), not the specific, highest-volume keyword cluster
  Phase 1 identified (801 keywords, 20,420 total volume).
- This is a real, evidenced gap in the two highest-weighted on-page SEO
  elements — but Phase 1 explicitly preserved the homepage H1/structure
  unchanged by design ("No homepage sections were added, removed, or
  reordered"), and the working rules require explicit approval before any
  homepage structural change. **Flagging for a decision, not implementing
  it**: should the title/meta description/H1 be adjusted to include
  "KI-Agenten," or is the current brand-positioning copy intentional and
  should stay as-is? This is the kind of call that belongs to you, not
  something to invent.

**Steps 34–38 (Service-page / AI-agent / Digital-marketing / SEO /
Web-design page SEO): PARTIALLY COMPLETE** — the underlying elements
(titles, meta descriptions, H1 structure, schema, internal links) are
verified sound across all of these page groups via Steps 39–45 above.
Page-specific content/keyword-targeting quality per vertical now has a
non-invented basis to work from (see "Keyword strategy (2026-08-23)"
immediately below).

**✅ Title/description alignment pass completed (2026-08-23, commit
`c7dea46`).** Audited every existing service page's title/description
against the real keywords mapped to it in `KEYWORD-STRATEGY.md`. Found
and fixed the same category of gap Step 33 found on the homepage: SEO
(`/loesungen/seo`, `/en/solutions/seo`) and E-Commerce (`/e-commerce`,
`/en/e-commerce`) titles were missing "Agentur"/"Agency" despite their
real head terms ("seo agentur" 22,200/mo — the single largest keyword in
the whole project; "e-commerce agentur" 1,900/mo) using that exact
framing; Webentwicklung (`/loesungen/webentwicklung`,
`/en/solutions/web-development`) never mentioned "Webdesign" at all
despite "webdesign agentur" (9,900/mo) — the **second**-largest keyword
in the whole project — being mapped to that exact page. Title/description
only, same scope constraint as Step 33's homepage fix (H1 and body left
untouched). Deployed (`dpl_FfaErN6qy3rA5SK9NyTgZQSVzo7i`, READY) and
production-verified: all six updated titles (3 pages × DE/EN) confirmed
live via fresh `curl`. KI-Agenten pillar (`/ki-agenten`) was also
audited and found already well-aligned from its Phase 1 optimization —
no change needed there, consistent with the "don't touch completed Phase
1 pages without a concrete issue" rule (none was found).

Body-copy-level content optimization beyond title/description (deeper
Steps 34–38 work — e.g., working the recovered/regional keyword terms
into FAQ or body sections of existing pages) remains a larger, lower-
urgency task not undertaken here, since it goes beyond the same-scope
precedent this pass deliberately stayed within.

### Keyword strategy (2026-08-23)

**Status: proposal, not implemented.** Following the two prior research
steps (99-term recovery reference; 64-row real Semrush-sourced dataset —
both in `docs/keyword-research/`), a curated commercial keyword universe was
built and clustered into page-target recommendations. Full detail:
`docs/keyword-research/KEYWORD-STRATEGY.md` and
`docs/keyword-research/digitalwerk-keyword-strategy.csv` / `.xlsx`.

**Explicitly not a reconciliation with the original 801-keyword dataset** —
that dataset remains inaccessible (see Phase 1 finding above) and no attempt
was made to recreate or force-match it here.

**Methodology summary:**
- 135 curated rows: 64 `REAL_SEMRUSH_DATA` (exact, unmeasured values never
  invented), 67 `RECOVERED_DISCUSSION_TERM` (recalled from prior discussion,
  no metrics attached), 4 `NEW_GENERATED` (new local-intent "... Ansbach"
  candidates, explicitly flagged, no metrics attached — a documented gap-fill
  pattern, not invented data).
- Grouped into the 7 tiers requested, in priority order: KI-Agenten →
  Digital Marketing → SEO → Web design/development → Automation → Lead
  generation → E-Commerce. Chatbots and KI-Beratung folded in as KI-Agenten
  sub-clusters (same buyer, same target pages). Social & Content added as an
  8th, explicitly out-of-scope supporting tier for completeness only.
- Every row maps to either a real, currently-live route (checked directly
  against `app/(de)/**/page.tsx` on disk, not the possibly-stale
  architecture memory doc) or the literal flag `GAP — no dedicated page`.

**Key findings:**
- 6 of 8 clusters map cleanly onto existing pages — no new pages needed
  (KI-Agenten, SEO, Webdesign/Webentwicklung, E-Commerce, Social & Content,
  plus Automation via an intentional overlap onto the KI-Agenten pages,
  since DigitalWerk delivers automation through KI-Agenten rather than as a
  separate product).
- **2 real content gaps found, flagged for a decision, not built:** Digital
  Marketing (real 2,900/mo national head term, no dedicated page — closest
  fit is `/loesungen/digitalwerk-komplett`) and Leadgenerierung (modest
  volume but the highest CPCs in the entire dataset, up to $15.55 — no
  dedicated page at all).
- "seo agentur" (22,200/mo) and "webdesign agentur" (9,900/mo) are the two
  highest-volume real keywords in the whole universe — larger than any
  KI-Agenten term — though this doesn't argue against the deliberate
  KI-Agenten-first business positioning.
- Local (Ansbach) coverage is thin across the board: only SEO has one
  *measured* local data point (30/mo); every other cluster's local coverage
  is either unmeasured (recovered) or was a genuine gap until the 4 new
  candidates added here.

**Next step:** awaiting review of `KEYWORD-STRATEGY.md`'s proposed clusters,
page targets, and the two flagged gaps. No page content, metadata, or new
pages have been created as part of this step.

### Gap-page strategy: Digital Marketing & Leadgenerierung (2026-08-23)

**Approved (user, 2026-08-23):** proceed with the keyword-strategy
findings; keep KI-Agenten as primary positioning; keep the validated
existing page mappings unchanged; develop the two identified gaps to
implementation-ready detail; do not implement either page yet.

**Status: proposal only — not implemented.** Full detail:
`docs/keyword-research/GAP-PAGE-STRATEGY.md`.

**Digital Marketing** — proposed URL `/loesungen/digital-marketing`
(+ `/en/solutions/digital-marketing`). Primary keywords (real):
"digital marketing agentur" (2,900/mo, KD 67, CPC $6.96), "agentur für
digital marketing" (320/mo, KD 54, CPC $5.63). Local/regional targets
("Marketing Agentur Ansbach," "Online Marketing Ansbach," "Digital
Marketing Bayern") are recovered, not measured. Full page-section plan
mapped to the locked service-page template.

**Leadgenerierung** — proposed URL `/loesungen/leadgenerierung`
(+ `/en/solutions/lead-generation`). Primary keywords (real):
"leadgenerierung" (1,900/mo, KD 42, CPC $5.81), "leadgenerierung agentur"
(880/mo, **KD 12** — the lowest KD of any "...Agentur" commercial term
found in this project), "b2b leadgenerierung" (880/mo, **CPC $15.55** —
the highest CPC found in this project). "KI Leadgenerierung" (recovered,
unmeasured) anchors the page's core differentiator section, directly
reinforcing the KI-Agenten primary positioning rather than competing with
it. Local coverage: only a `NEW_GENERATED`, unmeasured candidate
("leadgenerierung ansbach") exists — this tier had zero local term of any
kind before this pass.

**Open decision (not resolved):** both proposed pages would be a 6th/7th
item in the "Lösungen" dropdown, which currently has exactly 5 locked
items. Needs your call on nav placement (dropdown item vs. linked-but-
unlisted, the same pattern already used for the two `/ki-agenten/*`
supporting pages) before implementation.

**Page-creation gate evaluation (2026-08-23, not a decision — still not
implemented).** Per the standing rule ("Do NOT create unnecessary pages
... only when supported by keyword opportunity, search intent, topical
architecture, and business value") and explicit instruction not to build
a page merely because keywords exist, both candidates were scored against
all four criteria, not just volume — full table in
`GAP-PAGE-STRATEGY.md` §3.5. **Reading**: Leadgenerierung clears the bar
more clearly — real intent, the lowest-KD "...Agentur" commercial term
found anywhere in this project, a genuine KI-Agenten-reinforcing angle
("KI Leadgenerierung"), no cannibalization of an existing page, and the
single highest CPC in the whole dataset ($15.55). Digital Marketing has
the larger raw volume (2,900/mo) but weaker topical fit (a broad generic
category term, real overlap risk with the existing
`/loesungen/digitalwerk-komplett` flagship) and only average business
value — the exact pattern the "don't build for keywords alone" rule
exists to catch. Neither is disqualified; this is a recommendation for
your review, not a go/no-go call made here.

**✅ IMPLEMENTED + VERIFIED (2026-08-23), approved by user.** Both pages
built per the strategy above.

**Commits:** `5c0e0f5` (initial implementation), `90e35dc` (isolation
fix — see "Process note" below).

**New routes (all statically generated):** `/loesungen/digital-marketing`,
`/en/solutions/digital-marketing`, `/loesungen/leadgenerierung`,
`/en/solutions/lead-generation`. Both follow the exact same pattern as
their `/loesungen/*` siblings (SEO, Webentwicklung, GMB, Content
Creation) — plain `ServicePageTemplate`, no bespoke Service JSON-LD (kept
consistent with those pages rather than the special KI-Agenten
treatment). No pricing was invented for either — both omit `hero.pricing`
and `ComparisonItem.price` since no real DigitalWerk price exists yet for
either service.

**Navigation/internal linking, based on existing site architecture:**
- `lib/navigation.ts`: added to `footerServiceLinks`/`footerServiceLinksEn`
  — the same pattern already used for the `/ki-agenten/*` supporting
  pages. **Deliberately not added** to `primaryNav`/`primaryNavEn`'s
  Lösungen dropdown — that 5-item list is locked navigation architecture,
  and the same footer-only precedent was already set for the KI-Agenten
  supporting pages, resolving the earlier open nav-placement question by
  following existing precedent rather than inventing a new pattern.
- `app/(de)/loesungen/page.tsx`, `app/en/solutions/page.tsx`: added both
  as `ComparisonList` cards on the Lösungen/Solutions overview page — the
  established internal-linking hub for individually-bookable services.
- `lib/site-structure.ts`: breadcrumb entries (DE + EN).
- `app/sitemap.ts`: both routes registered with DE/EN hreflang alternates.

**Lifecycle:** Implemented → Validated locally (tsc/lint/build clean,
54/54 routes) → Committed → Pushed → **Deployed: FAILED** (see process
note) → Fixed → Re-validated → Committed → Pushed → Deployed
(`dpl_6dRYuvjMsCfWJf3k1r9WevZg3Q3c`, READY) → Production Verified — all
stages now complete.

**Production verification (2026-08-23):** all four new routes return
HTTP 200 with correct, keyword-targeted titles; sitemap.xml contains all
four; CSP Report-Only header still present and unaffected;
`/en/solutions` overview page still loads correctly (200) after the fix.

**Process note — a real isolation mistake, caught and corrected the same
session.** The first push (`5c0e0f5`) failed Vercel's build
(`TS2322` at `RelatedServices`/`CTA` call sites in
`app/en/solutions/page.tsx`) despite a clean local build. Root cause:
`app/en/solutions/page.tsx` was already one of this session's known
pre-existing unrelated dirty files (present in the original working-tree
state before this session began, alongside `components/ui/cta.tsx` and
`components/solutions/related-services.tsx` — an in-progress,
never-committed `locale` prop addition to those two components). Editing
that file's `services` array and then staging/committing the *whole
file* pulled in those unrelated, uncommitted `locale`-prop usages too —
committing code that called a prop the actually-committed component
definitions don't support. The local build didn't catch this because the
local working tree still had the matching (also uncommitted) component
changes; Vercel builds from git only, so it hit the real mismatch. Fixed
in `90e35dc`: reverted the file to its last real commit (`de7cbc7`) plus
only this task's own two-item addition, isolating the unrelated edit back
out — then restored that unrelated edit to the working tree as an
uncommitted change again (`git diff` confirmed byte-identical to its
pre-session state), so nothing the user had in progress was lost, per
`.claude/SEO-AGENT.md`'s isolation rule. **Lesson applied going forward:**
before staging a file for an SEO commit, diff it against its last commit
first when it's known to have pre-existing uncommitted changes — don't
assume an edit to one region of a file is isolated from unrelated changes
elsewhere in that same file.

**Local/Ansbach opportunity analysis (expanded):** the only *measured*
local search number anywhere in the project is "seo agentur ansbach"
(30/mo) — real evidence against building multiple thin per-keyword local
landing pages, and evidence for concentrating local signal on schema +
Google Business Profile + in-page local copy instead. **New technical
finding surfaced during this research** (not previously recorded): the
site's `Organization` schema (`lib/schema.ts` `buildOrganizationJsonLd()`)
emits the real, confirmed Ansbach street address but has **no
`addressLocality`, `addressRegion`, `postalCode`, or `GeoCoordinates`**,
and `areaServed` is hardcoded Germany-wide with no city/region layer.
`siteConfig.social` also has no Google Business Profile URL. Proposed
fix recorded in `GAP-PAGE-STRATEGY.md` §3.3.

**✅ IMPLEMENTED + VERIFIED (2026-08-23).** This finding was small,
schema-only, no page creation, no nav change — normal-authorized under
`.claude/SEO-AGENT.md` — so it was executed immediately as the next
autonomous step rather than left as a proposal only.

**Commit:** `b86ee47` — fix(seo): add local Ansbach/Bavaria signals to
Organization schema.

**Implemented:** `lib/schema.ts` `buildOrganizationJsonLd()` — added
`addressLocality: "Ansbach"`, `addressRegion: "Bayern"`,
`postalCode: "91522"` to `PostalAddress`; layered `City` (Ansbach) +
`AdministrativeArea` (Mittelfranken, Bayern) onto `areaServed` alongside
the pre-existing `Country` (Germany) entry — additive, the national claim
is unchanged. `GeoCoordinates` and a Google Business Profile `sameAs`
entry were considered and intentionally **not** added: no verified
coordinate source or GBP URL was available this session, and inventing
either would violate the no-invented-data rule. Flagged as open follow-up
items, not done.

**Lifecycle:** Implemented → Validated (`npx tsc --noEmit` clean,
`npm run lint` clean, `npm run build` — 50/50 routes) → Committed → Pushed
→ Deployed (`dpl_6Z54nES5XNQ95i3NELYaYJNwDxvi`, READY) → Production
Verified — all 5 stages complete.

**Production verification (2026-08-23):** fetched
`https://www.digitalwerkk.de/` directly — `areaServed` now contains
`Country/Germany`, `City/Ansbach`, `AdministrativeArea/Mittelfranken`,
`AdministrativeArea/Bayern`; `PostalAddress` contains
`addressLocality":"Ansbach"`, `addressRegion":"Bayern"`,
`postalCode":"91522"`, confirmed present in the live page's JSON-LD.

---

## COMMIT / DEPLOYMENT HISTORY

| Commit | Message | Phase | Status |
|---|---|---|---|
| `0d615ce` | feat(seo): optimize KI-Agenten pillar page | Phase 1 | Pushed, deployed, production verified |
| `68dc356` | feat(seo): add KI-Agenten supporting pages | Phase 1 | Pushed, deployed, production verified |
| `ffdca8a` | feat(seo): add schema and breadcrumb architecture | Phase 2 | Pushed, deployed, production verified |
| `cbf90f7` | fix(seo): improve robots and footer internal links | Phase 2 (H1/H2) | Pushed, deployed, production verified |
| `9b0bf1f` | feat(seo): wire unused JSON-LD schema helpers into pages | Phase 2 (M1) | Pushed, deployed, production verified |
| `b86ee47` | fix(seo): add local Ansbach/Bavaria signals to Organization schema | Phase 4 (keyword strategy → local finding) | Pushed, deployed, production verified |
| `2ca18f9` | feat(seo): add Content-Security-Policy in Report-Only mode | Phase 2 (M3) | Pushed, deployed, production verified |
| `c60da5b` | fix(seo): merge openGraph/twitter defensively, fix duplicate brand name in OG title | Phase 2 (M5) / Phase 4 (Step 33 OG finding) | Pushed, deployed, production verified |
| `5c0e0f5` | feat(seo): add Digital Marketing and Leadgenerierung service pages | Phase 4 (gap pages) | Pushed; deployment FAILED (see process note) |
| `90e35dc` | fix(seo): remove accidentally-committed unrelated changes from en/solutions/page.tsx | Phase 4 (gap pages, isolation fix) | Pushed, deployed, production verified |
| `c7dea46` | fix(seo): align existing service-page titles/descriptions with real keyword data | Phase 4 (Steps 34-38) | Pushed, deployed, production verified |

For each commit above, all five lifecycle stages are complete: **Implemented → Committed → Pushed → Deployed → Production Verified.**

Not in this table (infrastructure/config changes, not commits): DNS TXT record added at IONOS for GSC domain verification; Vercel `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variables added (Production + Preview); GSC domain property created and verified; GA4 account/property/stream created. All performed with explicit user approval at the time.

---

## AUTONOMOUS OPERATION (added 2026-08-23)

Day-to-day execution of this plan is now governed by `.claude/SEO-AGENT.md` —
a durable operating guide the user asked to be created so ordinary SEO work
(content, metadata, schema, on-page fixes, committing/pushing/deploying
through the existing Vercel pipeline) doesn't need repeated per-step
approval. High-risk actions (indexing requests, DNS, domain config,
deletions, billing, purchases, account-permission changes) still always
require explicit approval — see that file for the full list.

**Roadmap note:** the user has also given a 106-step, 10-phase roadmap
(Phases 1–10) as the strategic structure going forward, with Phases 1–2
(Steps 1–22, corresponding to this document's Phase 1 and Phase 2) directed
not to be re-executed or re-audited as tasks. That directive is honored
above and in `.claude/SEO-AGENT.md`. It does **not** mean the M2–M5 findings
in this document's Phase 2 are being treated as resolved — they remain open
and will be picked up when their corresponding roadmap step is reached (see
`.claude/SEO-AGENT.md`'s reconciliation note). This document remains the
authoritative evidence record regardless of which step-numbering scheme is
in use.

## IMPORTANT WORKING RULES

1. **Audit first.** Do not start modifying code immediately on a new phase/task.
2. Separate: already completed / partially completed / missing / technically incorrect.
3. Do NOT redo completed work.
4. Do NOT change homepage structure. The homepage structure is intentionally established and must remain intact unless a concrete technical/SEO issue requires a specific change.
5. Do NOT create unnecessary pages. Only create new pages when supported by keyword opportunity, search intent, topical architecture, and business value.
6. Do NOT touch unrelated existing working-tree changes without approval.
7. Before implementing a new phase/task set: produce a clear audit/status report (finding, severity, evidence, recommended fix, files affected, expected SEO impact).
8. Then STOP and wait for approval before making broad changes.
9. For approved implementation: make the smallest coherent changes; validate TypeScript, lint, build; test production routes; perform isolation testing where appropriate; stage only intended files; commit with a descriptive message; push only after approval; deploy and verify production.
10. Maintain clean commit boundaries. Never mix unrelated work into an SEO commit.

---

## NOTE ON PRE-EXISTING UNCOMMITTED WORKING-TREE CHANGES

At the time of writing, the repository's working tree contains additional pre-existing uncommitted changes unrelated to this SEO master plan (e.g., contact form/legal-page copy edits, a phone-number removal from the footer, schema-helper consumption groundwork). These are **not** part of Phase 1/2/3 of this SEO initiative and must not be assumed to belong to it, committed alongside SEO work, or described as SEO progress in this document.
