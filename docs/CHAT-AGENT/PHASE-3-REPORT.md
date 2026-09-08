# DigitalWerk AI Chat Agent — Phase 3 Implementation Report

Date: 2026-09-06
Branch: `feat/chat-agent-foundation` (PR #1, not merged)
Base commit: `2041bc0` (Phase 2) → head `6140b3d`

---

## Overall engineering completion: ~90%
## Production readiness: ~55%

Engineering is essentially done: the application, the provider-agnostic AI
layer, the private-Postgres architecture, the deployment project, backups and
tests all exist and pass locally. Production readiness is gated by things only
the account owner can do — provision/point OmniRoute, run the deploy on the
Hetzner box, add one DNS record, generate server-side secrets, decide the
Vercel plan, and complete legal sign-off.

---

## 1. Implemented (DONE — verified locally)

### Provider-agnostic AI (the top requirement)
- The core agent no longer references Anthropic. It depends only on
  `getLlmProvider()`; provider choice is **configuration only**:
  `LLM_PROVIDER`, `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`,
  `LLM_TIMEOUT_MS`, `LLM_MAX_RETRIES`, `LLM_TEMPERATURE`,
  `LLM_MAX_OUTPUT_TOKENS` (legacy `CHAT_AGENT_*` aliases still read).
- **`OpenAiCompatibleLlmProvider`** (`lib/chat-agent/llm/openai-compatible-provider.ts`)
  — a generic `fetch` adapter for the OpenAI `/v1/chat/completions` shape.
  OmniRoute is strictly OpenAI-compatible (verified against its docs:
  `Authorization: Bearer`, `model: "provider/model-id"`, `messages`,
  `temperature`, `max_tokens`, `stream:false`, `GET /v1/models`), so this
  single adapter covers OmniRoute **and** OpenAI / Groq / Together / LiteLLM
  / vLLM / Ollama with no OmniRoute-specific code.
  - `AbortController` timeout; retry on `408/429/500/502/503/504` + network /
    timeout with capped exponential backoff; `LlmProviderUnavailableError`
    on give-up.
- `getLlmProvider()` factory is configuration-driven and memoised. If a
  provider is named but its credentials are missing it returns the **mock**
  provider — nothing ever hard-breaks.
- The Anthropic `fetch` adapter is kept as a clean optional provider
  (`LLM_PROVIDER=anthropic`), not the default and not on the production path.
- The gateway key is server-side only. `.env.example` documents it as
  "SERVER-SIDE ONLY — never a `NEXT_PUBLIC_` variable".
- On any gateway failure the orchestrator falls back to the deterministic
  composed reply — an LLM outage degrades answer quality, it never breaks
  the chat.

### Private-Postgres network architecture
Chosen shape (matches the prompt's preferred option):

```
visitor ─https─▶ chat widget (Vercel, www.digitalwerkk.de)
             ─same-origin POST /api/chat/*─▶ Next.js route handler (Vercel)
             ─if AGENT_API_URL set: proxy + X-Agent-Auth─▶ Agent API (Hetzner, Hono)
                     ├─▶ PostgreSQL  (Hetzner, internal:true Docker net, never published)
                     ├─▶ OmniRoute / OpenAI-compatible gateway  (outbound https)
                     └─▶ Resend  (outbound https, when configured)
```

- **`lib/chat-agent/http/handlers.ts`** — framework-agnostic handlers
  returning `{ status, body }`, holding **all** validation and business
  logic. The Next.js routes and the standalone server both call it — one
  implementation, no duplicated logic.
- **`server/`** — a small Hono app run with `tsx` (no build step):
  CORS (origins from `AGENT_API_ALLOWED_ORIGINS`), request-id + structured
  JSON access logging (no message content), `X-Agent-Auth` shared-secret
  gate on `/api/*` (health stays open), in-memory sliding-window per-IP
  rate limit on `session` + `message`. Hardened `Dockerfile`
  (`node:22-alpine`, pinned deps, non-root user, `HEALTHCHECK`).
- **`app/api/chat/*` + `app/api/cron/*`** rewritten as thin wrappers:
  `proxyOrLocal()` proxies to `AGENT_API_URL` when set, otherwise runs the
  agent in-process (dev / pre-split). The browser never sees the Agent API
  URL or any key.

### Self-hosted Postgres on the existing Hetzner box
`deploy/digitalwerk/` — an **isolated** Docker Compose project
(`name: digitalwerk`), designed to sit next to PDF Wandler without touching
it:
- `postgres:16-alpine`, tuned for a small box
  (`shared_buffers=96MB`, `max_connections=40`, …), `pg_isready`
  healthcheck, `restart: unless-stopped`, `mem_limit: 384m`, named volume
  `digitalwerk_pgdata`.
- On an `internal: true` Docker network (`digitalwerk_internal`) — no
  outbound route, never published to the host or the internet. Only the
  Agent API container can reach it.
- `agent-api` container: `read_only`, `cap_drop: ALL`,
  `no-new-privileges`, `pids_limit`, `mem_limit: 256m`, on
  `internal` + `edge` networks.
- Schema self-applies (`CREATE TABLE IF NOT EXISTS`) on first request;
  `lib/chat-agent/persistence/postgres/schema.sql` is the reference DDL.

### Backups & retention
- `deploy/digitalwerk/backup.sh` — nightly `docker exec … pg_dump | gzip -9`,
  `DAILY_KEEP=7` + `WEEKLY_KEEP=4`, optional off-server `rclone` copy
  (`BACKUP_RCLONE_REMOTE`) and healthchecks.io dead-man's-switch
  (`BACKUP_HEALTHCHECK_URL`).
- `deploy/digitalwerk/restore.sh` — restores into a throwaway DB by default
  (`--into-prod` to overwrite), prints row counts.
- `deploy/digitalwerk/systemd/` — `digitalwerk-backup.timer` (04:15 UTC) and
  `digitalwerk-maintenance.timer` (03:30 UTC → `GET /api/cron/purge-transcripts`
  with `CRON_SECRET`, so retention runs on Hetzner regardless of Vercel Cron).
- Retention unchanged: single source of truth
  `CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS` / `_EVENT_RETENTION_DAYS`,
  default **and hard cap 30**. Purge nulls the transcript, keeps session
  metadata + the lead record; idempotent; failures surface in the result.

### Health endpoint
`GET /api/chat/health` (open, no secret) reports:
`status` (`ok` / `degraded` → HTTP 503), `llm` (provider, kind, model,
`configured`, `live`), `database` (`memory` / `postgres`, `reachable`),
`notifications` (`configured`, `ready`), `retention`, `knowledge`, `limits`.

### Preserved from Phases 1–2
Progressive lead qualification + internal 0–100 score (never exposed);
guardrails (prompt-injection / system-prompt / secret probes blocked
**before** the model is called; output-leak scrub); 93-entry versioned
knowledge base with source + approval metadata; Resend behind
`NotificationChannel` (retry-safe, deduped, no transcript in mail);
admin API (Bearer, constant-time compare, 503 when disabled).

---

## 2. Changed

| File / area | Change |
|---|---|
| `lib/chat-agent/config.ts` | `LlmConfig` replaces `provider`/`model`/`anthropicKeyPresent`; `resolveLlm()`; `agentApiUrl` / `agentApiSecret` / `agentApiAllowedOrigins` / `rateLimitPerMinute` |
| `lib/chat-agent/llm/index.ts` | configuration-driven, memoised factory; exports `OpenAiCompatibleLlmProvider` |
| `lib/chat-agent/index.ts` | `chatAgentHealth()` rewritten (llm/db/notifications/retention split) |
| `app/api/chat/*`, `app/api/cron/*` (10 routes) | rewritten as thin proxy/local wrappers |
| `docs/CHAT-AGENT/ARCHITECTURE.md` | Phase 3 header + transport-split description |
| `docs/CHAT-AGENT/PROVIDER-SETUP.md` | full rewrite — provider-agnostic, OmniRoute section |
| `.env.example` | new `LLM_*` block + `AGENT_API_*` block, every secret documented (purpose / location / required? / client-safe?) |
| `package.json`, `tsconfig.json` | `+hono +@hono/node-server +tsx`; `typecheck` runs root **and** `server`; `server/` excluded from the Next tsconfig |

New: `lib/chat-agent/llm/openai-compatible-provider.ts`,
`lib/chat-agent/http/{handlers,proxy,next-route}.ts`,
`server/{app,index,rate-limit}.ts` + `Dockerfile` + `tsconfig.json`,
`deploy/digitalwerk/**`, `docs/CHAT-AGENT/DEPLOYMENT.md`,
`test/agent-api.test.ts`.

---

## 3. Infrastructure

| Item | State |
|---|---|
| Hetzner CX23 (`2.28.53.174`, Nuremberg) | audited read-only; **not modified** |
| PDF Wandler | untouched; the new compose project is isolated (own name, networks, volume, mem limits) |
| PostgreSQL on Hetzner | **compose project written, NOT yet deployed** |
| Agent API container | Dockerfile written, NOT yet built on the server |
| `agent.digitalwerkk.de` DNS | **BLOCKED** — Vercel-manages `digitalwerkk.de` DNS |
| Vercel | not modified; no plan change; Hobby commercial-use limitation documented in the infra audit |
| Nothing provisioned, no money spent | ✔ |

---

## 4. AI

| | |
|---|---|
| Production gateway | **OmniRoute** (intended) — OpenAI-compatible, adapter ready |
| Current provider | `mock` (deterministic, offline) — until an OmniRoute key exists |
| Switch cost | three env vars (`LLM_PROVIDER` / `LLM_BASE_URL` / `LLM_API_KEY` + `LLM_MODEL`), `docker compose up -d agent-api`. No code change. |
| Key exposure | server-side only; never in the browser bundle, never `NEXT_PUBLIC_` |
| Failure behaviour | `LlmProviderUnavailableError` → deterministic composed reply |

---

## 5. Tests

| Gate | Result |
|---|---|
| `npm test` (vitest) | **114 / 114 pass** (was 99; +6 OpenAI-compatible provider, +8 Agent API integration) |
| `npm run typecheck` — `tsc --noEmit` (root) | **PASS** |
| `npm run typecheck` — `tsc -p server --noEmit` | **PASS** |
| `npx eslint .` | **PASS** — 0 errors, 0 warnings |
| `npm run build` (`next build`) | **PASS** — static marketing routes unchanged; `/api/chat/*` + `/api/cron/*` dynamic |
| Standalone Agent API smoke (`node --import tsx server/index.ts`) | **PASS** — boots, `/health` = `status: ok`, full `session → message` returns the grounded pricing reply ("699 €"), admin gated |
| E2E in a browser against a deployed URL | **NOT RUN** — needs the Hetzner deploy + DNS |

New provider-abstraction test coverage: OmniRoute selection by config,
POST body shape + `Bearer` header, retry on 503, give-up on repeated 500,
timeout, malformed response, fallback-to-mock when unconfigured, provider
switching. Agent API: X-Agent-Auth gate (403), correct-secret accept (201),
session→message flow, per-IP rate-limit (429), admin 503→401→200, cron
endpoint, malformed-body 400.

---

## 6. Production blockers

Each: **what** · why · exact action · who.

### BLOCKER 1 — OmniRoute deployment + API key
- **Why:** without it the agent runs on the mock provider (canned replies).
- **Action:** stand up / obtain an OmniRoute instance, create an API key,
  note its `…/v1` base URL and a model id (`provider/model-id`).
- **Who:** DigitalWerk / account owner.

### BLOCKER 2 — Run the deploy on the Hetzner server
- **Why:** the compose project, Dockerfile, backup + timer units are all in
  the repo but nothing has been created on `2.28.53.174` (deploying to a box
  that also runs a live third-party service is not something to do without
  your explicit go-ahead).
- **Action:** `ssh deploy@2.28.53.174`; `git clone` into
  `/opt/apps/digitalwerk/`; create `deploy/digitalwerk/.env` (mode 600) from
  `.env.example`; `docker build -f server/Dockerfile -t digitalwerk-agent-api .`;
  `docker compose -f deploy/digitalwerk/compose.yml up -d`; verify
  `docker exec digitalwerk-agent-api-1 wget -qO- http://127.0.0.1:8080/api/chat/health`;
  install the systemd timers. Full runbook: `deploy/digitalwerk/README.md`.
  **I can do this once you confirm — it is isolated from PDF Wandler and
  reversible (`docker compose down`), but it does create containers on the
  production box.**
- **Who:** you to authorise; I can execute, or your ops.

### BLOCKER 3 — DNS A-record `agent.digitalwerkk.de → 2.28.53.174`
- **Why:** the Vercel proxy needs a hostname to reach the Agent API; TLS via
  the host's existing Caddy needs the name to resolve.
- **Action:** add the A-record in the Vercel dashboard (Domains →
  `digitalwerkk.de` → DNS Records). Then add the Caddy vhost +
  `docker network connect digitalwerk_edge <caddy-container>`.
- **Who:** whoever owns the Vercel account.

### BLOCKER 4 — Server-side secrets
- **Why:** `AGENT_API_SECRET`, `CHAT_AGENT_ADMIN_TOKEN`, `CRON_SECRET`,
  `POSTGRES_PASSWORD` must be strong and never committed.
- **Action:** generate on the server (`openssl rand -hex 32`), put them in
  `deploy/digitalwerk/.env`; put `AGENT_API_URL` + the same `AGENT_API_SECRET`
  in Vercel env.
- **Who:** whoever runs the deploy.

### BLOCKER 5 — Resend API key + verified sending domain
- **Why:** handoff / lead e-mails are a no-op until then (recorded, not sent).
- **Action:** create a Resend key, verify `digitalwerkk.de` (or a subdomain)
  as a sending domain, set `RESEND_API_KEY` / `CHAT_AGENT_HANDOFF_CHANNEL=resend`
  / `CHAT_AGENT_NOTIFY_TO` / `CHAT_AGENT_NOTIFY_FROM`.
- **Who:** DigitalWerk.

### BLOCKER 6 — Off-server backup destination
- **Why:** `pg_dump` runs locally; a disk failure loses both DB and backup.
- **Action:** configure an `rclone` remote (Hetzner Storage Box, S3, …) and
  set `BACKUP_RCLONE_REMOTE`; optionally a healthchecks.io URL.
- **Who:** ops.

### BLOCKER 7 — Vercel plan (commercial use)
- **Why:** `www.digitalwerkk.de` is commercial; Vercel Hobby prohibits that.
  Moving the agent to Hetzner reduces Vercel function usage but does not fix
  the plan question.
- **Action:** upgrade to Vercel Pro (or migrate the site to Hetzner — a
  larger, separate decision; see the infra audit).
- **Who:** account owner. *Not done here — the prompt says do not upgrade.*

### BLOCKER 8 — Legal / business sign-off
- **Why:** GDPR + AI Act.
- **Action:** verify the `provisional` pricing entries; name the
  sub-processors (OmniRoute + upstream model provider, Hetzner, Resend) in
  `/datenschutz` and `/en/privacy-policy`; confirm legal bases + third-country
  transfer mechanism; DPAs; retention specifics; AI transparency assessment.
- **Who:** DigitalWerk + counsel.

---

## 7. Optional / future improvements (OPTIONAL — not blockers)

- Widget focus-trap while the panel is open (a11y polish; keyboard nav,
  Escape-to-close and ARIA live regions already work).
- Distributed rate limiting — the current limiter is per-instance
  (fine for one Agent API container; revisit only if it is scaled out).
- Streaming responses (`stream:true`) — the adapter sends `stream:false`;
  the widget renders a full reply. Add SSE later for perceived latency.
- Vector retrieval — current lexical retriever is reliable for ~93 entries;
  swap `LexicalRetriever` (interface already there) only if conversation
  data justifies it.
- Real admin dashboard instead of JSON + Bearer token.
- jsdom + Testing Library component tests for the widget.
- Move Vercel Cron off entirely once the Hetzner maintenance timer is proven.
- `GET /v1/models` preflight in the factory to warn on a bad `LLM_MODEL`.

---

## 8. Git

- Branch `feat/chat-agent-foundation`, pushed, in sync with origin.
- New commits on top of Phase 2 (`2041bc0`):
  - `eb386d0` feat(chat-agent): provider-agnostic LLM layer (OmniRoute / OpenAI-compatible)
  - `eda9ff4` feat(chat-agent): standalone Hetzner Agent API + shared HTTP handlers
  - `6140b3d` feat(deploy): isolated self-hosted Postgres + Agent API for Hetzner
- PR #1 is **not merged**. (Its description update via the GitHub API was
  blocked by the local command classifier; the commit messages carry the
  full Phase 3 story, or update the PR body from
  `docs/CHAT-AGENT/PHASE-3-REPORT.md`.)
