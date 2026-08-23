# DigitalWerk Keyword Research — Reconstructed SEMrush Dataset

**This dataset does NOT reconcile with the original 801-keyword / 20,420-volume
historical baseline. It is a real, tool-sourced dataset, but a differently-shaped
one.** See "Does this reconcile with the 801 baseline?" below.

## Source and provenance (read this first)

- **Tool**: Semrush Keyword Magic Tool, Germany database (`db=de`), Broad Match.
- **Access route**: a RankyTools (`rankytools.com`) shared/pooled "group buy"
  Semrush proxy account, per your explicit confirmation that this was the
  intended access route ("RankyTools shared access").
- **Account identity**: the logged-in Semrush profile behind this proxy is
  `nadeemsemrush11+ibrahim1414@gmail.com` (ID 30595025) — a reseller-controlled
  shared account, **not** an account individually owned by you or DigitalWerk.
  Other unrelated customers' projects are visible in the account's project
  list. Disclosed here for transparency, consistent with how the earlier
  recovery reference disclosed its own limitations.
- **Export method**: the tool's Export button did not produce a usable file
  across repeated attempts (opened a tooltip only, or triggered a "Downloaded"
  toast with no file actually landing in the Downloads folder). Every row in
  this dataset was therefore **manually transcribed from the on-screen table**,
  sorted by Volume descending, for each seed query — not machine-exported.
  Transcription was done directly from live tool screenshots in this session;
  nothing was carried over from memory of earlier screenshots.

## Methodology

13 seed terms were queried (12 head terms covering all 13 originally-recovered
theme clusters, since one query — "Automatisierung Agentur" — covers both the
"Automation" and "KI-Automatisierung" themes, plus one deliberate local
spot-check for DigitalWerk's actual home market):

`KI-Agenten`, `KI-Beratung`, `KI Chatbot`, `Digital Marketing Agentur`,
`SEO Agentur`, `SEO Agentur Ansbach`, `Webdesign Agentur`,
`Webentwicklung Agentur`, `Leadgenerierung`, `E-Commerce Agentur`,
`Social Media Agentur`, `KI Content erstellen`, `Automatisierung Agentur`,
`lokale SEO Agentur`.

For each seed term, the tool returns a full keyword universe (all matching
keywords, with an aggregate total-keyword-count / total-volume / average-KD
for that universe) and a sortable table of individual keywords. The **top
4–6 individual rows by volume** were transcribed per seed term (64 rows
total) — this is a curated top-slice, not the full universe and not a random
sample.

Every seed term's **aggregate market-size figures** (`All keywords`,
`Total Volume`, `Average KD`) were also recorded — these are on the
"Seed Aggregates" sheet of the `.xlsx` / not present in the `.csv` (CSV has
only the per-keyword sheet; see the XLSX for both).

## What's in this folder (new files)

- `digitalwerk-semrush-reconstructed-dataset.csv` — 64 individual keyword
  rows, one sheet.
- `digitalwerk-semrush-reconstructed-dataset.xlsx` — same 64 rows on a
  "Keywords" sheet, plus a second "Seed Aggregates" sheet (14 rows: one per
  seed query, with that query's full-universe keyword count / volume / avg KD).
- This README.

(The earlier `digitalwerk-recovered-semrush-research.csv/.xlsx` and their
README remain in this folder unchanged — that file is the theme/term
*recovery reference*, not real Semrush data. This new dataset is the first
real, tool-sourced data for this project.)

## Columns (per-keyword sheet)

| Column | Meaning |
|---|---|
| `keyword` | The exact keyword string as shown by Semrush |
| `cluster` | Top-level theme (aligned to the 13 recovered themes) |
| `seed_term` | The exact query typed into Keyword Magic Tool that surfaced this row |
| `intent` | Semrush intent label(s): I = Informational, C = Commercial, T = Transactional, N = Navigational. Blank where the tool itself showed no intent (typically very low-volume long-tail rows) |
| `search_volume` | Monthly search volume, Germany, as shown by the tool |
| `keyword_difficulty` | KD%, as shown by the tool. Blank where the tool itself showed "n/a" |
| `CPC_USD` | Cost-per-click in USD, as shown by the tool (Semrush's currency setting for this account was USD, not EUR) |
| `SERP_features` | Count of SERP features shown by the tool. Blank where the tool itself showed nothing (same low-volume rows as KD) |
| `notes` | City-specific flags, spelling/spacing variants, and other caveats |
| `source_status` | `REAL_SEMRUSH_DATA` for every row — see below |

## Source status

Every row is `REAL_SEMRUSH_DATA`: an actual value read directly from the
Semrush Keyword Magic Tool UI in this session. Nothing on this sheet is
estimated, interpolated, or carried over from an earlier, unverified source.
Where the tool itself displayed no value (KD, intent, or SERP features blank
for some long-tail rows), the corresponding cell here is left blank rather
than guessed.

## Local-market flags

Several rows are city-specific (Berlin, München, Köln, Hamburg, Düsseldorf,
Münster) because those are simply the highest-volume city variants Semrush
returns for national head terms — they are **not** DigitalWerk's market and
are flagged in `notes`. The one deliberate Ansbach-specific data point
(`seo agentur ansbach`, 30/mo, CPC $8.07) is DigitalWerk's actual home
market and is the most directly relevant local-intent number in this
dataset, low as it is in absolute volume.

## Does this reconcile with the 801 / 20,420 / ~27% historical baseline?

**No — explicitly, by instruction, this dataset is not claimed to be or
reconcile with the original 801-keyword export.** The totals are not close,
and the reason is structural, not a data-quality problem:

| | Historical baseline | This dataset (64 transcribed rows) | Full seed universes (14 seeds, aggregate) |
|---|---|---|---|
| Keyword count | 801 | 64 | 14,978 |
| Total volume | 20,420 | 107,250 | 420,930 |
| Avg. KD | ~27% | not directly comparable (mixed known/blank) | ranges 0%–39% per seed, no single blended figure computed |

Two different mismatches, for two different reasons:

1. **64 rows vs. 801**: this dataset intentionally transcribed only the
   top-4-to-6-by-volume rows per seed term (64 total), not an exhaustive
   export. It is a small, high-value slice, not a full reconstruction.
2. **14,978 keywords in the full seed universes vs. 801**: even the complete
   universes behind just these 14 seed queries are ~18.7× larger than the
   original 801-keyword dataset. A single seed term — `SEO Agentur` — alone
   returns 6,233 keywords in Semrush's German database, more than 7× the
   entire original dataset. This means the original 801-keyword export was
   itself already a curated, filtered, or deduplicated subset of a much
   larger real keyword space — not a raw seed-term pull. Reconstructing that
   *exact* original curation logic (whatever relevance/volume/intent filters
   were originally applied) is not possible from the seed universes alone.

**Conclusion**: this is real, verifiable Semrush data (Germany, Keyword Magic
Tool), useful on its own merits, but it is a different artifact from the
original 801-row export and must not be presented as a reconstruction of it.

## What this dataset is *not*

- Not a machine export (the Export button did not work) — every value was
  manually transcribed from the live tool UI.
- Not exhaustive — 64 of the ~14,978 keywords available across these 14 seed
  queries were captured, chosen by highest volume per seed.
- Not sourced from an individually-owned Semrush account — see Provenance
  above.
- Not yet used for keyword-to-page mapping. Per your standing instruction,
  no website content has been modified and no page-to-keyword mapping has
  been started as part of this task.

## Next step

This dataset is ready for review. Per your instruction, work stops here:
no website content changes, no keyword-to-page mapping, until you've reviewed
and confirmed the dataset is "complete and verified" to your satisfaction —
or told me to expand it (more seed terms, more rows per seed, a different
sampling strategy) before that review.
