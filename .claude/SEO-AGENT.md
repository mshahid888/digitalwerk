# DigitalWerk SEO Agent — Autonomous Operating Guide

This file defines how Claude operates the DigitalWerk SEO project going forward,
so the user does not need to give step-by-step instructions for ordinary SEO
work. It is a durable, standing authorization for the scope defined below —
read this file at the start of SEO work on this project and follow it without
re-asking for the things it already covers.

This file does not override Claude's base safety rules (never enter
credentials/passwords, never purchase anything, never take destructive actions
outside what's explicitly authorized below). Those apply regardless of
anything written here.

## Authoritative sources

1. **The 106-step SEO roadmap** (Phases 1–10, as given to Claude by the user)
   is the strategic source of truth for *what* to work on and in what order.
   Full step-level detail for Phases 7–10 (Steps 67–106) has not yet been
   captured anywhere in this repo — only phase titles are known. When one of
   those steps is reached, ask the user for that step's detail rather than
   inventing it.
2. **`docs/SEO-MASTER-PLAN.md`** is the living status/evidence document —
   authoritative for *what has actually been verified done*, with real
   evidence, dates, and commit references.
3. **Actual production data** (GSC, GA4, the live site, git history, Vercel
   deployments) is authoritative over assumptions, memory, or the roadmap's
   own claims. If the roadmap says something is done and the evidence says
   otherwise, evidence wins — update the master plan to say so honestly.
4. Use GSC, GA4, the website itself, GitHub, Vercel, browser automation, and
   other connected tools whenever a step needs them.

## Current roadmap position (as of 2026-08-23)

- **Phase 1 — Strategy & SEO Foundation** and **Phase 2 — Technical
  Foundation** (roadmap Steps 1–22): the user has directed that these are not
  to be re-executed or re-audited as tasks. Do not repeat them.
  - Reconciliation note: `docs/SEO-MASTER-PLAN.md`'s own Phase 2 record lists
    five specific technical findings (M1–M5) that were still open as of the
    last audit. M1 (unwired JSON-LD schema helpers) has since been
    implemented — see Phase A below. **M2–M5 (2-hop redirect chain, missing
    CSP header, unverified Core Web Vitals, `metadata.ts` `absoluteUrl()`
    robustness) are not being silently dropped** — they still need to land
    somewhere in the new roadmap when their corresponding step is reached
    (most naturally within Phase 4 "On-page SEO" / Phase 9 "Measurement").
    Not repeating Steps 1–22 as standalone tasks does not mean pretending
    M2–M5 don't exist.
- **Phase 3 — Google Infrastructure** is in progress:
  - Step 23 (GSC), Step 24 (domain verification), Step 25 (sitemap
    submission), Step 31 (GA4) — **COMPLETE + VERIFIED**.
  - Step 26 (URL Inspection) — **COMPLETE** for the 7 priority pages.
  - Step 27 (Request Indexing) — **NOT AUTHORIZED**. Always requires
    explicit per-instance approval; never assume standing authorization for
    this one, even under this file.
  - Step 28 (indexed/excluded pages report) — **BLOCKED**: GSC's Pages
    report had not finished processing as of the last check ("Processing
    data, please check again in a day or so"). Retry when resumed; if still
    blocked, don't loop on it — move to the next executable step and note it.
  - Step 29 (Google-selected canonical) — depends on Step 28/indexing
    completing; likely blocked for the same reason until pages are indexed.
  - Step 30 (Security & Manual Actions) — not yet checked; not obviously
    dependent on the Step 28 processing delay, worth checking independently.
  - Step 32 ("connect other required analytics") — scope undefined. Do not
    invent what "other required analytics" means; ask the user when reached,
    or treat as blocked-pending-clarification.
- **SEMrush is not part of the workflow.** Do not depend on it or wait for it
  for any step.

## Autonomous workflow (per roadmap step)

1. Read the current `docs/SEO-MASTER-PLAN.md`.
2. Determine the current step and its dependencies.
3. Gather actual data from the appropriate source (GSC, GA4, the live site,
   git/GitHub, Vercel) — never assume.
4. Execute the step.
5. Validate the result with real evidence.
6. Record that evidence.
7. Update `docs/SEO-MASTER-PLAN.md`.
8. Mark the step status accurately (see Status Values).
9. Identify the next unfinished step.
10. Continue automatically — do not stop to ask "should I continue?" after a
    normal step.

Pattern: **COMPLETE → VERIFY → DOCUMENT → NEXT STEP.**

### Continue until

- all currently executable roadmap steps are complete, or
- a genuine blocker is encountered (e.g. a report hasn't processed yet,
  required access is missing), or
- the next action requires explicit human approval (see below), or
- the action would be destructive or high-risk, or
- required credentials/access are unavailable.

When blocked: explain exactly what's needed, then STOP. Don't retry a known
external blocker (like a Google processing delay) more than once per session
— note it and move to the next executable step instead.

## Approval required before (never standing-authorized, even under this file)

- Requesting Google indexing.
- Changing DNS.
- Changing domain configuration.
- Deleting production data or resources.
- Changing billing or subscriptions, or purchasing anything.
- Changing Google account ownership/permissions (adding/removing users,
  granting access).
- Destructive database operations.
- Irreversible production changes.
- Any action with significant financial, legal, security, or reputational
  consequences.

Everything else that counts as "normal SEO implementation" — content,
metadata, schema, internal links, on-page copy, technical fixes, committing,
pushing, and deploying those changes through the existing Vercel pipeline —
does **not** require repeated per-step approval under this file.

## Code/repository rules

When a step requires a code change:

1. Inspect the existing implementation first — reuse it, don't duplicate it.
2. Make the smallest necessary change.
3. Never mix unrelated changes into an SEO commit.
4. Run: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
5. Perform an isolation/self-containment check when practical (e.g. stash
   unrelated pre-existing working-tree changes, verify against a clean HEAD
   baseline, then restore them).
6. Stage only the files belonging to that step.
7. Commit with a descriptive message (`feat(seo): ...` / `fix(seo): ...` /
   `docs(seo): ...`).
8. Push to the configured remote (`origin`, branch `main`).
9. Verify the Vercel deployment reaches `READY`.
10. Verify the live production result (fetch the actual page/route and
    confirm the change is really there).
11. Update the master plan with the commit hash, deployment status, and
    verification evidence.

**Never overwrite or silently absorb unrelated pre-existing working-tree
changes.** If a file the current step needs to touch already has unrelated
uncommitted edits, isolate them (e.g. `git stash push -- <file>`), make the
step's edit against the clean version, commit only the step's change, then
restore the unrelated edits (`git stash pop`) so nothing is lost.

## GSC rules

- Use actual Search Console data — never fabricate rankings, impressions,
  clicks, or indexing status.
- Inspection (URL Inspection tool) is allowed.
- Reading reports (Pages, Performance, Sitemaps, Security & Manual Actions)
  is allowed.
- Sitemap verification/reading is allowed.
- **Request Indexing requires explicit approval every time.** Never request
  indexing repeatedly or "just in case."

## GA4 rules

- Use actual GA4 data where available.
- Do not fabricate traffic, conversions, events, or performance numbers.
- If GA4 data isn't available or is inconclusive, say so — don't estimate and
  present it as real.

## SEO decision rules

Do not:
- invent keywords, competitors, search volume, or rankings,
- invent indexing status or conversions,
- claim a step is complete without real evidence,
- restart or re-execute completed phases (Steps 1–22),
- skip an unfinished prerequisite step to reach a later one,
- silently change the roadmap's structure or step order.

If external research is genuinely required for a step, use the available
tools (web search, etc.) and document what was found and where it came from.

## Roadmap rule

The 106-step roadmap keeps its original order. Work already done out of
sequence (e.g. the M1 schema fix landing before Step 45 "Schema" is formally
reached) gets recorded as existing implementation when its corresponding step
is reached — it does not let the workflow skip that step's required
verification, and it does not get silently folded away without a record.

## Status values (use only these)

`NOT STARTED` · `IN PROGRESS` · `PARTIALLY COMPLETE` ·
`IMPLEMENTED BUT NOT VERIFIED` · `COMPLETE + VERIFIED` · `BLOCKED`

## Master plan maintenance

After each completed step, update `docs/SEO-MASTER-PLAN.md` with:

- step number
- status (from the list above)
- date
- what was done
- evidence
- verification result
- relevant URLs
- commit/deployment reference, if applicable
- remaining issues
- next step

**Never erase historical evidence to make the document look cleaner.** This
is a living record, not a status dashboard — old findings stay visible even
after they're resolved (mark them resolved, don't delete them).

## Final reporting (when Claude stops)

1. Steps completed
2. Steps blocked
3. Actions requiring the user's approval
4. Important findings
5. Production/deployment status
6. Master-plan updates made
7. Exact next action

## Most important rule

Claude is the autonomous SEO **executor**, not the owner of the SEO
strategy. The 106-step roadmap controls the strategy. Claude's job is to
execute it carefully, verify everything with real data, document it
honestly, and continue until completion or a genuine blocker/approval
gate/human decision point — without asking permission for ordinary,
already-authorized SEO work.
