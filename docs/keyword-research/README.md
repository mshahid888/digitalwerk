# DigitalWerk Keyword Research — Recovery Reference

**This is a RECOVERY REFERENCE, not a replacement for the original SEMrush dataset.**

## Historical baseline (confirmed)

The following aggregate figures are confirmed from the original DigitalWerk
SEO research (Semrush Keyword Magic Tool, German market):

- **Total keywords:** 801
- **Total monthly search volume:** 20,420
- **Average keyword difficulty:** approximately 27%
- **Market/database:** Germany / German-language SEO
- **Primary business focus:** KI-Agenten
- **Primary keyword cluster:** KI-Agenten / AI agents

**The complete original 801-row SEMrush export was not available in the
repository.** This document contains only recoverable historical
information and discussion terms. It must not be treated as the complete
original SEMrush dataset.

## What's in this folder

- `digitalwerk-recovered-semrush-research.csv` / `.xlsx` — 99 recovered
  keyword/theme terms, one row each, with the columns below.
- This README.

## Columns

| Column | Meaning |
|---|---|
| `keyword` | The recovered keyword or theme term |
| `cluster` | Top-level theme (aligned to the 13 original theme names where they match; one additional cluster, "Social & Content", was not among the original 13 — see notes) |
| `subcluster` | Either "Original theme list" (the term came from the 13 named themes) or the specific discussion-subsection it came from (e.g. "KI-Agenten / AI", "SEO", "Chatbots") |
| `source_status` | See below — every row in this file is `RECOVERED_DISCUSSION_TERM` |
| `search_volume` | Left blank — not known for any individual term |
| `keyword_difficulty` | Left blank — not known for any individual term |
| `intent` | Left blank — not known for any individual term |
| `CPC` | Left blank — not known for any individual term |
| `SERP_features` | Left blank — not known for any individual term |
| `notes` | Duplicate/near-duplicate flags, local/Ansbach flags, and other caveats |

## Source status definitions

- **HISTORICAL_CONFIRMED** — information explicitly preserved from the
  original research. In this project, that's the aggregate baseline
  figures above (801 / 20,420 / ~27% / Germany / KI-Agenten focus) — not
  any individual keyword row, since no individual keyword's own metrics
  were preserved from the original research.
- **RECOVERED_DISCUSSION_TERM** — a keyword or theme that appeared in
  later discussion about the original research and is useful as a
  recovered candidate. **Every row in this file uses this status.** This
  includes both the 13 originally-named themes and the longer list of
  specific keyword phrases discussed afterward — neither is the verified
  original row-level export, so neither is marked `HISTORICAL_CONFIRMED`.
- **NEW_GENERATED** — anything generated later, not recovered from any
  prior research or discussion. **No row in this file uses this status.**
  Nothing here was invented; everything traces back to the recovered
  material provided for this task.

## What this file is *not*

- It is **not** the original 801-row Semrush export — this file has 99
  rows, not 801, and none of the per-keyword metrics (volume, KD, CPC,
  intent, SERP features) that a real export would include are present,
  because they aren't known.
- It should **not** be used for keyword-to-page mapping on its own. See
  `docs/SEO-MASTER-PLAN.md` (Phase 4, Step 42) for why that work stays
  blocked until the real dataset — or a genuine reconstruction via the
  official Semrush account — is available.

## Next step

Per the project's SEO Master Plan, the next task is to use the official
Semrush account to recover or reconstruct the authoritative keyword
dataset. This recovery reference exists to preserve what's known in the
meantime, not to substitute for that work.
