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
- Identify remaining high-value keyword clusters that deserve dedicated pages.
- Do NOT create pages merely to target low-volume keywords.
- Do NOT change completed Phase 1 pages unless an audit identifies a concrete issue.

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
| M3 | No `Content-Security-Policy` header | Low | NOT STARTED |
| M4 | Core Web Vitals (LCP/INP/CLS) unverified — no authenticated Lighthouse/PSI access in the audit environment | Medium | NOT STARTED — requires a real PSI API key or Vercel Speed Insights check before any performance code work is scoped |
| M5 | `lib/metadata.ts` pending `absoluteUrl()`-based canonical rewrite — robustness improvement, not a live bug (live canonicals already verified correct) | Low | NOT STARTED |

Do NOT mark M2–M5 as completed. Do NOT implement them without explicit approval.

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

## COMMIT / DEPLOYMENT HISTORY

| Commit | Message | Phase | Status |
|---|---|---|---|
| `0d615ce` | feat(seo): optimize KI-Agenten pillar page | Phase 1 | Pushed, deployed, production verified |
| `68dc356` | feat(seo): add KI-Agenten supporting pages | Phase 1 | Pushed, deployed, production verified |
| `ffdca8a` | feat(seo): add schema and breadcrumb architecture | Phase 2 | Pushed, deployed, production verified |
| `cbf90f7` | fix(seo): improve robots and footer internal links | Phase 2 (H1/H2) | Pushed, deployed, production verified |
| `9b0bf1f` | feat(seo): wire unused JSON-LD schema helpers into pages | Phase 2 (M1) | Pushed, deployed, production verified |

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
