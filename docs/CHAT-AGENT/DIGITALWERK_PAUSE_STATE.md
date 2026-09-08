# DIGITALWERK — PAUSE STATE

**Paused:** 2026-09-08 · **Resume:** Thursday evening
**Reason:** conserving Claude weekly usage credits. All work stopped after a clean
save. No implementation continues past this document.

---

## A. CURRENT STATUS

### Completed

- **Chat agent (Phases 1–4)** — provider-agnostic AI chat agent for the DigitalWerk
  website: intent detection, knowledge-grounded answers (DE/EN), service
  recommendation, lead qualification + scoring, team handoff, guardrails.
- **Provider-agnostic LLM layer** — `getLlmProvider()` factory; kinds `mock` /
  `openai-compatible` / `anthropic`. No vendor SDK in the business logic. Selected
  entirely by env (`LLM_PROVIDER`, `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`).
  Currently resolves to **mock** everywhere.
- **Two transports, one implementation** — `lib/chat-agent/http/handlers.ts` is
  called by both the Next.js `app/api/chat/*` routes (Vercel) and the standalone
  Hono Agent API (`server/`, Hetzner).
- **Hetzner deployment (mock mode)** — isolated Docker Compose project
  `digitalwerk` at `/opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk/`:
  `digitalwerk-postgres-1` (postgres:16-alpine, private `internal: true` network,
  never published) + `digitalwerk-agent-api-1` (Hono, image tag `bbdad3e`).
- **HTTPS endpoint** — `https://agent.digitalwerkk.de` live via the shared host
  Caddy (`pdfwandler-caddy-1`), cert valid to ~2026-12-06, auto-renew.
- **Vercel wiring** — `AGENT_API_URL` + `AGENT_API_SECRET` set for all
  environments on the `digitalwerk` project. Preview deployments proxy
  browser → Vercel `/api/chat/*` → Hetzner Agent API → private Postgres. Verified
  end-to-end in mock mode.
- **Backups / retention** — nightly `pg_dump` timer (`digitalwerk-backup.timer`),
  maintenance/purge timer (`digitalwerk-maintenance.timer`), both active.
  `backup.sh` rewritten (fails loudly on a bad dump, `.last-run` status file).
  30-day hard cap on raw transcripts + events.
- **CI** — `.github/workflows/ci.yml`: tests + typecheck (app + server) + lint +
  build on every PR to `main`. Passing on current head.
- **Docs** — `docs/CHAT-AGENT/` (README, ARCHITECTURE, DEPLOYMENT, PROVIDER-SETUP,
  PERSISTENCE, ENVIRONMENT, PRIVACY, TESTING, OPERATIONS, PHASE-3/4 reports).
- **Security review** — auth gate (`X-Agent-Auth`), constant-time admin token,
  per-IP rate limit, output guardrail covering the full secret surface, non-UUID
  session → 400, SQL fully parameterised, no secrets in client bundles / git /
  journald. `npm audit` clean.

### Production-ready

- All **engineering** is production-ready: 118 tests pass, tsc (app + server)
  pass, ESLint passes, `npm run build` passes, CI green.
- Infrastructure is stood up and healthy **in mock mode**.

### Still blocked (see section E)

- Real LLM credential (deciding: **OmniRoute, local test first**).
- Resend email credential.
- Off-server backup destination.
- Vercel commercial-plan decision (team is on Hobby).
- Legal / privacy review sign-off.
- PR #1 merge + production activation (gated on all of the above).

### Git / PR / production

| | |
|---|---|
| Current branch | `feat/chat-agent-foundation` |
| Current commit (HEAD) | `8b3deea` — *docs(chat-agent): operations runbook + de-stale the Phase-2 docs* |
| Pushed | **Yes** — `origin/feat/chat-agent-foundation` == local, working tree clean |
| Branch position | 24 commits ahead of `origin/main`, 0 behind (clean fast-forward) |
| `origin/main` HEAD | `b763b64` (pre-agent) |
| PR #1 | `feat/chat-agent-foundation` → `main` · **open, draft, NOT merged** · `mergeable: clean` |
| Production (`www.digitalwerkk.de`) | serves `main` = `b763b64` — **the chat agent is NOT on the public site** |
| Hetzner Agent API | up, healthy, `llm.provider: "mock"`, `database: "ok"` |
| PDF Wandler | untouched, all containers healthy |

---

## B. DIGITALWERK ARCHITECTURE (current, accurate)

```
Visitor browser
  │  same-origin HTTPS
  ▼
Vercel — www.digitalwerkk.de
  static site + thin /api/chat/* route handlers (Next.js)
  │  if AGENT_API_URL set: server-to-server proxy + X-Agent-Auth shared secret
  ▼
Agent API on Hetzner — https://agent.digitalwerkk.de
  standalone Hono app (server/), behind the shared host Caddy
  │
  ├─▶ private PostgreSQL 16  (Docker internal:true network, never published,
  │                           no outbound; sessions / leads / handoffs / events)
  │
  ├─▶ LLM provider abstraction  (getLlmProvider())
  │      currently: MOCK (deterministic, offline, no cost)
  │      target:    an OpenAI-compatible /v1 gateway — OmniRoute
  │                  → set LLM_PROVIDER / LLM_BASE_URL / LLM_API_KEY / LLM_MODEL,
  │                    no code change
  │
  └─▶ Resend email (handoff/lead notifications) — DISABLED until a key is set
                                                  (safe no-op, records still stored)
```

**OmniRoute is NOT installed on Hetzner.** No OmniRoute container, process, port,
or config exists on `2.28.53.174`. The Hetzner Agent API's `.env` has
`LLM_PROVIDER=mock` and empty `LLM_BASE_URL` / `LLM_API_KEY` / `LLM_MODEL`.
Production has never called a real model.

Shared resources with PDF Wandler (the only contact points, unchanged):
the host Caddy (one appended `agent.digitalwerkk.de` vhost) and the
`pdfwandler_edge` Docker network (the Agent API joins it so Caddy can reach it).

---

## C. OMNIROUTE DECISION

- **OmniRoute will be tested LOCALLY FIRST** on the Windows dev machine before any
  decision about Hetzner/production.
- An **existing Windows OmniRoute installation was discovered** during discovery:
  - npm global package `omniroute` (installed `3.8.49`; registry latest ~`3.8.50`).
    Binaries: `omniroute`, `omniroute-reset-password`. Prefix
    `C:\Users\DELL\AppData\Roaming\npm`.
  - Pre-existing personal data dir **`C:\Users\DELL\.omniroute\`** (created
    2026-08-14, last activity 2026-08-27): `storage.sqlite` (~14 MB),
    `oauth/` (contains a `kimi-coding-device-id`), `call_logs/`, `db_backups/`,
    `logs/`, `.env` (88 bytes — **not inspected**, may hold a credential).
  - This predates the DigitalWerk project and is the owner's own OmniRoute setup.
- **`localhost:20128` previously failed only because the OmniRoute server process
  was not running.** 20128 is OmniRoute's default port (dashboard + `/v1`). The
  package is installed and previously initialised; nothing is listening.
- OmniRoute was **NOT started during this session.** No local OmniRoute process
  was launched, nothing was stopped, and `C:\Users\DELL\.omniroute\` was not
  modified or deleted.
- **Next step** is to start the existing local OmniRoute install and verify a real
  model response, then connect DigitalWerk to it locally **through the existing
  provider abstraction** (`OpenAiCompatibleLlmProvider`, no code change).
- **No production Vercel or Hetzner changes** are to be made during the local
  test. OmniRoute on Hetzner is **postponed** until local validation succeeds.

Reference: OmniRoute = MIT-licensed open-source OpenAI-compatible AI gateway,
`github.com/diegosouzapw/OmniRoute`, npm `omniroute`, image
`diegosouzapw/omniroute`. Keyless on localhost; needs at least one **upstream
provider key** (Anthropic/OpenAI/…) added in its dashboard to route to a real
paid model.

---

## D. NEXT SESSION — EXACT ORDER (Thursday evening)

Do these in order. Stop and record if any step fails.

1. Inspect the existing local OmniRoute installation
   (`C:\Users\DELL\.omniroute\`, `npm ls -g omniroute`, `~/.omniroute/.env`).
2. Start OmniRoute on `localhost:20128` (`omniroute` from a terminal; do **not**
   reinstall or wipe data).
3. Verify the dashboard (`http://localhost:20128`) and the API
   (`http://127.0.0.1:20128/v1/models`).
4. Identify which upstream provider(s) / model(s) are already configured and
   working in this OmniRoute instance.
5. Make a real `POST http://127.0.0.1:20128/v1/chat/completions` test and confirm
   a genuine model response.
6. Configure the DigitalWerk **LOCAL** environment only — create
   `digitalwerk/.env.local` (git-ignored):
   ```
   LLM_PROVIDER=omniroute
   LLM_BASE_URL=http://127.0.0.1:20128/v1
   LLM_API_KEY=<local OmniRoute credential if the instance requires one>
   LLM_MODEL=<a model confirmed working in step 5>
   ```
7. Start DigitalWerk locally (`npm run dev` in `digitalwerk/`).
8. Test the full path: DigitalWerk → OmniRoute → model (send a chat message,
   confirm a real generated reply, not the deterministic mock/fallback).
9. Test **German + English** parity (Sie-default, mid-conversation switch).
10. Test **knowledge retrieval + service recommendation** (grounded answers,
    no fabricated services/prices/customers).
11. Test **lead qualification** (no premature form, score band, handoff trigger).
12. Test **guardrails** (prompt injection, system-prompt / secret extraction,
    oversized input, output leak).
13. Test **fallback** — stop OmniRoute, confirm the orchestrator returns the
    deterministic composed reply and the chat never hard-breaks.
14. Record all results (a short LOCAL-OMNIROUTE-TEST section or its own doc).
15. **Only after** successful local validation, decide whether OmniRoute belongs
    on Hetzner production — and if so, plan it as an isolated Docker service bound
    to `127.0.0.1:20128` (never a public port), with an owner-provided upstream
    provider key.

---

## E. REMAINING PRODUCTION BLOCKERS

None of these are solved.

| # | Blocker | Class | What is needed |
|---|---|---|---|
| 1 | **Real LLM credential** | owner decision + paid action | Local OmniRoute test first (section D). For production: a working OmniRoute instance + at least one upstream model-provider API key (metered spend — owner must fund). Until then the agent runs on `mock`. |
| 2 | **Resend email** | credential unavailable / owner decision | A Resend API key + verified sending domain (or an explicit decision to reuse the website's key). Handoffs are recorded and queued but not delivered without it. |
| 3 | **Off-server backup** | owner decision (free options exist) | An `rclone` remote (Cloudflare R2 / Backblaze B2, no card) + optional healthchecks.io URL in the server `.env`. Backups are currently local-only on the Hetzner box. |
| 4 | **Vercel commercial plan** | paid action / owner decision | The `digitalwerk` Vercel team is on **Hobby**, which prohibits commercial use; the site is commercial. Upgrade to Pro, or an explicit accepted-risk decision. |
| 5 | **Legal / privacy review** | legal decision | Verify `provisional` pricing entries; name sub-processors (Hetzner, Resend if used, the upstream AI provider via OmniRoute) with DPAs; confirm legal bases + third-country transfer; decide the lead-record retention period and the extent of the retained conversation excerpt; AI-Act transparency assessment. |
| 6 | **PR #1 merge** | owner decision | Gated on 1–5. PR is a draft; must be marked "Ready for review" and merged only when merge conditions are met or explicitly accepted. |
| 7 | **Production activation** | consequence of #6 | On merge, Vercel auto-deploys `main` to production with the agent live and env wiring already in place. Not before. |

---

## F. INFRASTRUCTURE SAFETY (rules in force during the pause)

- **PDF Wandler must remain untouched** — no changes to its containers, images,
  volumes, compose files, or application behaviour. Shared Caddy vhost + the
  `pdfwandler_edge` network stay exactly as they are.
- **Hetzner OmniRoute installation is postponed** — nothing OmniRoute-related on
  `2.28.53.174` until after local validation and an explicit decision.
- **No public OmniRoute port** — if/when OmniRoute is ever deployed server-side it
  binds to `127.0.0.1` only.
- **No purchases, subscriptions, upgrades, or intentional new paid usage.**
- **No production deployment** during the pause.
- **PR #1 is not merged** during the pause.
- Local `C:\Users\DELL\.omniroute\` data is preserved — not deleted, not modified.

---

## G. REPOSITORY STATE (verified at pause)

```
branch:          feat/chat-agent-foundation
HEAD:            8b3deea  docs(chat-agent): operations runbook + de-stale the Phase-2 docs
working tree:    clean (nothing to commit)  [before this pause doc was added]
remote:          origin/feat/chat-agent-foundation == HEAD (pushed)
vs origin/main:  +24 / -0   (origin/main = b763b64)
PR #1:           open, draft, not merged, mergeable: clean
secrets:         none committed — only .env.example files are tracked (empty values);
                 all key-shaped strings in the diff are placeholders, regexes, or test fixtures
tests:           118 passing, tsc (app+server) pass, eslint pass, build pass, CI green
                 (last full run earlier in the session; not re-run at pause to save credits)
```

Recent commits (newest first): `8b3deea`, `16b83db`, `e571be5`, `bbdad3e`,
`170bd6f`, `ccf2770`, `b612927`, `cfbfc3e`, `c0f4fb2`, `0e4d771`.
