# DigitalWerk Keyword Strategy — Curated Commercial Keyword Universe

**Status: strategy proposal only. No website content has been modified.**
This document proposes clusters and page targets for review; implementation
is a separate, future step requiring explicit approval per
`.claude/SEO-AGENT.md`.

## What this is

A curated, commercially-focused keyword universe built from the two prior
research artifacts in this folder:

- `digitalwerk-recovered-semrush-research.csv/.xlsx` — 99 historically
  recovered keyword/theme terms (no metrics; discussion-recalled, not
  exported).
- `digitalwerk-semrush-reconstructed-dataset.csv/.xlsx` — 64 rows of real,
  manually-transcribed Semrush Keyword Magic Tool data (Germany database),
  gathered via a RankyTools shared-account proxy.

**This is explicitly not an attempt to recreate the original 801-keyword
dataset, and no reconciliation is claimed or attempted.** Per instruction,
this step works forward from what's actually available.

## Methodology

1. Took every one of the 64 real, measured rows and every recovered term
   whose intent is clearly commercial/agency-seeking (i.e., excluded a
   handful of purely generic/thematic recovered terms that don't function as
   standalone search queries — e.g. the bare theme label "Digital Marketing"
   itself was dropped in favor of "Digital Marketing Agentur" and its
   variants).
2. Grouped everything into the 7 priority tiers named in the task, in that
   order: **KI-Agenten → Digital Marketing → SEO → Web design/development →
   Automation → Lead generation → E-Commerce.** Chatbots and KI-Beratung are
   folded in as sub-clusters of KI-Agenten (same target pages, same audience
   — a search for "KI Chatbot" or "KI Beratung" is functionally the same
   buyer as "KI Agent"). Social & Content is included as an 8th, **supporting**
   cluster — it wasn't in the named priority list, so it's ranked last and
   flagged as outside the explicit scope, kept only because real/recovered
   data already exists for it.
3. Added exactly **4** new candidate keywords (`NEW_GENERATED`), all
   local-intent ("... Ansbach") gap-fills: every other tier already has at
   least one Ansbach-specific term (real or recovered) except KI-Agenten,
   Automation, Leadgenerierung, and E-Commerce. These 4 follow that
   established pattern. **No metrics were invented for them** — volume/KD/
   CPC/SF are blank, and they're clearly flagged as unmeasured strategy
   candidates, not data.
4. Every row carries a `target_page` — either a real existing route, or the
   literal string `GAP — no dedicated page` where no current page fits.
   Nothing was mapped to a page that doesn't exist in the live route list
   (`app/(de)/**/page.tsx`, checked directly against the file system, not
   the (possibly stale) architecture memory doc).

## Source status legend

| Status | Meaning | Count |
|---|---|---|
| `REAL_SEMRUSH_DATA` | Exact metrics from live Semrush Keyword Magic Tool, transcribed by hand | 64 |
| `RECOVERED_DISCUSSION_TERM` | Recalled from prior discussion; no metrics, never invented | 67 |
| `NEW_GENERATED` | New candidate keyword strings proposed by this strategy pass; no metrics attached | 4 |

**135 rows total** in `digitalwerk-keyword-strategy.csv` / `.xlsx`.

## Cluster-by-cluster findings and page targets

### Tier 1 — KI-Agenten (highest priority, incl. Chatbots + KI-Beratung)

**Target pages:** `/ki-agenten` (pillar — informational/brand terms),
`/ki-agenten/erstellen` (creation/build-intent terms: "erstellen",
"entwickeln", "Entwicklung").

**Real data highlights:** "ki agenten" (3,600/mo, KD 48) and "ki chatbot"
(3,600/mo, KD 70) are the two highest-volume terms in this tier. Chatbot
terms carry notably higher KD (64–79%) than KI-Agenten terms (45–48%) —
chatbots are a more contested SERP.

**No action needed** — both target pages already exist and are already the
site's Phase 1 pillar/supporting pages. This tier confirms the existing
architecture is well-aligned with real demand.

### Tier 2 — Digital Marketing

**Target page:** **GAP.** No dedicated "Digital Marketing Agentur" page
exists. Closest available: `/loesungen` (solutions overview) and
`/loesungen/digitalwerk-komplett` (flagship bundle, which already
functionally covers this positioning).

**Real data highlights:** "digital marketing agentur" (2,900/mo, KD 67,
CPC $6.96) is a real, sizeable, competitive national term. "Digital
Marketing Bayern" (recovered, regional — Ansbach is in Bavaria) and
"Marketing Agentur Ansbach" / "Online Marketing Ansbach" (recovered, local)
are the most strategically relevant recovered terms.

**Recommendation (not implemented):** worth evaluating whether a dedicated
page is warranted given the real 2,900/mo national volume — but per the
master plan's standing rule ("Do NOT create unnecessary pages"), this is a
call for you to make, not something to build now.

### Tier 3 — SEO (incl. Local SEO / lokale Suche)

**Target page:** `/loesungen/seo` (existing, strong match for all terms in
this tier, including the local ones — no new page needed).

**Real data highlights:** "seo agentur" (22,200/mo, KD 51) is the
**single highest-volume keyword in the entire universe**. The city-variant
rows (Berlin, München, Köln, Hamburg — all real, all 2,900–4,400/mo) are
**competitive intelligence, not targets** — they're markets DigitalWerk
doesn't serve. The one directly relevant local number is real but small:
"seo agentur ansbach" at 30/mo, CPC $8.07. Recovered regional terms (SEO
Nürnberg, Fürth, Rothenburg, and especially **SEO Mittelfranken** — Ansbach's
own administrative district) are unmeasured but geographically on-target
and worth prioritizing in on-page local copy.

### Tier 4 — Web design / development

**Target page:** `/loesungen/webentwicklung` (the site's one existing page
covers both webdesign and webentwicklung — this merge is a pre-existing
architecture decision, not something introduced here).

**Real data highlights:** "webdesign agentur" (9,900/mo, KD 51) is the
**second-highest-volume keyword in the entire universe**, well above every
term in the Webentwicklung sub-cluster (max 1,900/mo). This is a real
finding: web*design* intent dominates web*development* intent by a wide
margin in this market. "Webdesign Ansbach" and "Webentwicklung Ansbach"
(both recovered, no measured volume) are the direct local targets.

### Tier 5 — Automation (KI-Automatisierung)

**Target page:** mapped to `/ki-agenten/erstellen` — **an intentional
overlap, not a data gap.** DigitalWerk's automation offering *is* delivered
through KI-Agenten; there's no separate "automation" product, so a separate
"automation" page would fragment the same offer rather than serve a
distinct audience. Flagging this explicitly as a judgment call for your
review, not an unstated assumption.

**Real data highlights:** volumes are modest (140–260/mo for the
DigitalWerk-relevant rows; the Münster rows are competitive intelligence
only) but this is the **lowest-KD tier measured** (11–21%, vs. 25–79%
elsewhere) — real, low-competition opportunity, just smaller in absolute
size than the other tiers.

### Tier 6 — Leadgenerierung

**Target page:** **GAP.** No dedicated page exists.

**Real data highlights:** modest volumes (480–1,900/mo) but **the highest
CPC values in the entire universe** (up to $15.55 for "b2b leadgenerierung")
— a strong signal of high commercial/buyer value per click even where
absolute search volume is limited.

**Recommendation (not implemented):** given the CPC signal, this may
deserve either a dedicated page or a strong subsection within
`/loesungen/digitalwerk-komplett`. Flagging for your decision, not building.

### Tier 7 — E-Commerce

**Target pages:** `/e-commerce` (existing, general e-commerce services) and
`/ki-agenten/e-commerce` (existing, AI-agent-for-e-commerce angle — the
right target for "KI E-Commerce" and "E-Commerce Automatisierung"
specifically).

**Real data highlights:** modest volumes (260–1,900/mo) but the **highest
average CPC of any tier** ($13.39–$19.94) — the strongest per-click
commercial-value signal in the whole dataset. Both target pages already
exist; no new page needed.

### Tier 8 — Social & Content (supporting, outside the named priority list)

**Target page:** `/loesungen/content-creation` (existing).

**Real data highlights:** "social media agentur" (6,600/mo, KD 57) is a
real, large number — the third-highest-volume keyword in the universe —
but this tier wasn't part of the requested priority order, so it's
documented here for completeness rather than acted on.

## Cross-tier observations

- **Volume ranking of head terms** (all real, all national): SEO Agentur
  (22,200) > Webdesign Agentur (9,900) > Social Media Agentur (6,600) >
  KI Agenten / KI Chatbot (3,600 each) > KI Beratung (2,900) > Digital
  Marketing Agentur (2,900) > Leadgenerierung (1,900) > E-Commerce Agentur
  (1,900) > Webentwicklung Agentur (1,900). SEO and Webdesign are, by a wide
  margin, the largest real search markets DigitalWerk's existing pages
  target — larger than the KI-Agenten head terms Phase 1 treated as primary.
  This doesn't argue against the KI-Agenten-first business strategy (a
  deliberate positioning choice, not purely volume-driven), but it's worth
  knowing the raw demand shape.
- **CPC as a commercial-value signal**: E-Commerce and Leadgenerierung have
  the lowest volumes but the highest CPCs of any tier — classic
  high-intent/high-value, lower-funnel-traffic terms. KI-Agenten/Chatbot
  terms have the lowest CPCs ($0.60–$2.90) despite high volume — likely
  because these are still informational/early-funnel searches for a newer
  category (matches the high `I` intent share seen across that tier).
- **Local (Ansbach) coverage is currently thin everywhere.** Only SEO has a
  *measured* local number (30/mo). Every other tier's local coverage is
  either a recovered, unmeasured term, or — for KI-Agenten, Automation,
  Leadgenerierung, and E-Commerce — didn't exist in either source dataset at
  all until the 4 `NEW_GENERATED` candidates added here.

## Page-target summary table

| Cluster | Target page(s) | Status |
|---|---|---|
| KI-Agenten / Chatbots / KI-Beratung | `/ki-agenten`, `/ki-agenten/erstellen` | Existing — no gap |
| Digital Marketing | `/loesungen`, `/loesungen/digitalwerk-komplett` | **GAP** — no dedicated page |
| SEO / Local SEO | `/loesungen/seo` | Existing — no gap |
| Webdesign / Webentwicklung | `/loesungen/webentwicklung` | Existing — no gap |
| KI-Automatisierung | `/ki-agenten/erstellen` | Intentional overlap (see Tier 5) |
| Leadgenerierung | — | **GAP** — no dedicated page |
| E-Commerce | `/e-commerce`, `/ki-agenten/e-commerce` | Existing — no gap |
| Social & Content (supporting) | `/loesungen/content-creation` | Existing — no gap |

## What this document is not

- Not a content-writing task — no page copy, titles, or metadata were
  changed.
- Not a final, locked strategy — it's a proposal for review. The two GAP
  findings (Digital Marketing, Leadgenerierung) and the one intentional-
  overlap judgment call (Automation → KI-Agenten pages) are flagged
  specifically because they need your decision, not because they're
  resolved.
- Not exhaustive — built from 64 real + 99 recovered terms, not a full
  Semrush export. Expanding either source dataset would refine this further.

## Next step

Awaiting your review of the proposed clusters, page targets, and the two
flagged gaps before any implementation (new pages, on-page content changes,
or keyword-to-page mapping) begins.
