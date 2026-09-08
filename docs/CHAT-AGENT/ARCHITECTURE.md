# DigitalWerk Chat Agent — Architecture

Status: **Phase 3** — provider-agnostic LLM layer (OmniRoute / any
OpenAI-compatible gateway; **not tied to Anthropic**), a standalone Agent
API for the existing Hetzner server, isolated self-hosted Postgres, retry-
safe Resend notifications, 30-day retention. Every external dependency
(LLM, database, email) degrades to a safe default when its credentials are
absent, so the whole system still runs, develops and tests with **no paid
resource**.

## Where it lives

The agent's **logic** is framework-agnostic TypeScript in `lib/chat-agent/`.
Two transports call it:

1. **Next.js route handlers** (`app/api/chat/*`, on Vercel) — thin. Either
   run the agent in-process (dev / pre-split) or **proxy** to the Hetzner
   Agent API when `AGENT_API_URL` is set.
2. **The standalone Agent API** (`server/`, a small Hono app run with
   `tsx`, on Hetzner) — the production path. Sits in front of the private
   Postgres; the browser never reaches it directly (see `DEPLOYMENT.md`).

Both call `lib/chat-agent/http/handlers.ts` — one implementation, no
duplicated validation or business logic.

```
lib/chat-agent/
  config.ts            env-driven config; safe cost-free defaults
  index.ts             public surface + chatAgentHealth()
  service.ts           application service used by the API routes

  llm/                  provider-independent LLM interface
    types.ts             LlmProvider, LlmMessage, LlmResponse, LlmProviderUnavailableError
    mock-provider.ts     deterministic, offline, no cost
    openai-compatible-provider.ts  generic /v1/chat/completions adapter — OmniRoute + others (no SDK)
    anthropic-provider.ts  optional direct Anthropic (no SDK; not the production path)
    index.ts             getLlmProvider() factory — configuration-driven, memoised, falls back to mock

  http/                 framework-agnostic HTTP layer (shared by both transports)
    handlers.ts          session/message/lead/handoff/health/admin/cron — all validation + logic
    proxy.ts             proxyToAgentApi() — Vercel route → Hetzner Agent API
    next-route.ts        toResponse()/readJson()/proxyOrLocal() glue for app/api/chat/*

  knowledge/           approved knowledge base + retrieval
    types.ts             KnowledgeEntry + source/verification metadata
    sources/             company, services, ai-solutions, pricing, faq, policies
    retrieval.ts         LexicalRetriever (dependency-free, deterministic)
    index.ts             retrieveForPrompt()

  agent/               orchestration + business logic
    types.ts             all shared types
    language.ts          DE/EN detection + locale-hint resolution
    intent.ts            16-category rule-based intent detection
    guardrails.ts        input + output guardrails
    recommendation.ts    service recommendation matrix (spec 06)
    qualification.ts     progressive fact capture + 0–100 lead scoring (spec 05)
    handoff.ts           handoff decision + structured payload
    summary.ts           deterministic conversation summary
    system-prompt.ts     persona + rules (no facts, no secrets)
    compose-reply.ts     deterministic reply composer (mock + fallback)
    orchestrator.ts      runAgentTurn() — one visitor turn, end to end

  persistence/         store interfaces + two implementations
    types.ts             Conversation/Lead/Handoff/Event stores + PurgeResult
    memory-store.ts      in-memory (dev / preview / tests; not durable)
    postgres/
      client.ts          SqlClient interface + postgres.js adapter
      schema.ts          SCHEMA_STATEMENTS + migrate() (CREATE TABLE IF NOT EXISTS)
      schema.sql         reference DDL (kept in sync with schema.ts)
      store.ts           PostgresChatAgentStore (row <-> type mappers)
    index.ts             getChatAgentStore() — picks postgres if a URL is set

  notifications/       outbound notification abstraction
    types.ts             NotificationChannel interface
    noop-channel.ts      records only, never sends (default / fallback)
    resend-channel.ts    Resend email adapter (fetch, no SDK; safe w/o key)
    templates.ts         handoff + lead email bodies (minimal fields, no transcript)
    index.ts             getNotificationChannel() factory

  admin-auth.ts        Bearer-token guard for the admin API

app/api/chat/               thin wrappers — proxyOrLocal(): proxy to the Hetzner
  session|message|lead|      Agent API when AGENT_API_URL is set, else run in-process.
  handoff|health/route.ts    Never talk to Postgres from here in production.
  admin/leads|handoffs|purge/route.ts  Bearer CHAT_AGENT_ADMIN_TOKEN
app/api/cron/
  purge-transcripts/route.ts  GET/POST  maintenance (Vercel Cron OR Hetzner timer)

server/                    the standalone DigitalWerk Agent API (Hetzner)
  app.ts                   Hono app: CORS, request-id logging, X-Agent-Auth gate,
                           per-IP rate limit — routes call lib/chat-agent/http/handlers
  index.ts                 @hono/node-server entry (tsx, no build step)
  rate-limit.ts            in-memory sliding-window limiter
  Dockerfile               node:22-alpine, non-root, healthcheck

deploy/digitalwerk/        isolated Compose project for the existing Hetzner box
  compose.yml              postgres (internal-only net) + agent-api (hardened)
  backup.sh restore.sh maintenance.sh   pg_dump / restore test / retention sweep
  systemd/                 digitalwerk-backup.timer (04:15) + -maintenance.timer (03:30)

vercel.json             one cron entry -> /api/cron/purge-transcripts @ 03:00

components/chat/
  chat-widget.tsx       launcher + panel, mounted once in site-shell.tsx
  use-chat.ts           client hook (session, messages, send, handoff)
  strings.ts            DE/EN widget chrome copy
```

## One turn, end to end (`runAgentTurn`)

Deterministic logic runs first; the LLM only phrases the final reply.

1. **Language** — `resolveLanguage()` combines the widget's locale hint with
   detection on the visitor's words; a strong signal in the message wins.
2. **Input guardrails** — `checkInput()`. Prompt-injection, system-prompt
   probes and secret probes → the turn is blocked and a safe refusal is
   returned *without calling the model*. Oversized/empty input is rejected.
3. **Intent** — `detectIntent()`, rule-based, 16 categories + `OTHER`.
4. **Retrieval** — `retrieveForPrompt()` returns approved/provisional
   knowledge in the conversation language, formatted with source lines.
5. **Recommendation** — `recommendService()` maps *problem signals* (never a
   bare keyword) to a service, as a hypothesis + follow-up question.
6. **Qualification** — `extractFacts()` pulls any volunteered facts;
   `scoreLead()` computes the internal 0–100 score; `decideNextField()`
   picks the next useful question (problem understanding before contact
   details; never repeats a question).
7. **Handoff** — `decideHandoff()` checks explicit requests, complaints,
   legal/contract topics, existing-client issues, custom quotes, complex
   projects, high intent, and unanswerable questions.
8. **Compose** — `composeReply()` builds a spec-aligned reply purely from
   the computed state (problem → diagnosis → recommendation → next step).
9. **LLM phrasing** — the system prompt (persona + rules + retrieved
   knowledge) plus a per-turn directive block and the deterministic reply
   as `fallbackText` go to `getLlmProvider().generate()`. The mock returns
   the fallback verbatim; a real provider rephrases within the same facts.
   If the provider errors, the fallback text is used — the agent never
   hard-fails a turn.
10. **Output guardrails** — `checkOutput()` replaces any reply that leaks a
    key, an env var name or the system prompt.
11. **Persist** — `service.ts` (`await getChatAgentStore()`) saves the
    session, records an analytics event, upserts a lead once the score
    leaves the `informational` band, and on escalation creates a durable
    handoff record (deduped within a 10-minute window per session+reason)
    then attempts its notification.

## Persistence

`getChatAgentStore()` returns a `ChatAgentStore` chosen by environment:

- a Postgres connection string set (`CHAT_AGENT_DATABASE_URL`, or
  `DATABASE_URL` / `POSTGRES_URL` / `POSTGRES_PRISMA_URL`) →
  `PostgresChatAgentStore`. **In production this is the self-hosted
  Postgres 16 on the Hetzner box** (`deploy/digitalwerk/`), reached only by
  the Agent API over a private `internal: true` Docker network — never
  published, never reachable from Vercel or the browser. Any standard
  `postgresql://` string works. Connects lazily and runs
  `CREATE TABLE IF NOT EXISTS` on first use. If the DB is unreachable at
  startup it logs and falls back to the memory store for that instance.
- otherwise → **in-memory** store (dev, preview, tests).

The store depends only on a small `SqlClient` interface (`query`, `end`) —
no vendor-specific API. `postgres.js` is the current driver and works with
any Postgres. `store.ping()` is a live `SELECT 1` used by the health
endpoint so a database that drops *after* startup is reported as
`unavailable` (HTTP 503), not a stale `ok`. Four tables: `chat_sessions`
(metadata + raw transcript), `chat_leads` (the permanent record, minimum
fields), `chat_handoffs` (record + delivery state), `chat_events`. See
`DEPLOYMENT.md`, `PERSISTENCE.md` and `postgres/schema.sql`.

## Retention (privacy)

Single source of truth: `CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS` /
`CHAT_AGENT_EVENT_RETENTION_DAYS` in `config.ts`, both defaulting to and
**hard-capped at 30**. `conversations.purgeExpired()` nulls the raw
transcript (`messages → []`) on sessions older than the window and deletes
old events; **session metadata and the lead record are kept**. Runs daily
via Vercel Cron (`/api/cron/purge-transcripts`) and on demand via
`POST /api/chat/admin/purge`.

## Notifications / handoff delivery

`getNotificationChannel()`:

- `CHAT_AGENT_HANDOFF_CHANNEL` unset → `NoopNotificationChannel` (records
  only).
- `= "resend"` + `RESEND_API_KEY` set → `ResendNotificationChannel` (email,
  `fetch`, no SDK).
- `= "resend"` without a key → no-op (safe).

Retry-safe: a handoff whose notification fails stays `dispatched = false`
with `dispatch_attempts` incremented and `last_dispatch_error` recorded;
`retryPendingHandoffs()` (cron + `POST /api/chat/admin/handoffs`) re-sends
up to `CHAT_AGENT_NOTIFY_MAX_ATTEMPTS`, and skips entirely when no channel
is ready. Duplicate suppression: the per-session+reason dedup window plus an
`X-Entity-Ref-ID` mail header. Lead notifications fire once per lead (an
`lead_notification_sent` event is the idempotency marker) — the durable lead
record + admin listing is the source of truth, so a failed lead ping is not
retried.

## Admin API

`GET /api/chat/admin/leads`, `GET/POST /api/chat/admin/handoffs`,
`POST /api/chat/admin/purge` — all require
`Authorization: Bearer <CHAT_AGENT_ADMIN_TOKEN>` (constant-time compare) and
return **503 when the token env var is unset** (disabled by default, since
they expose lead PII).

## Design decisions

- **No SDK for Anthropic.** The adapter uses `fetch`, matching the Resend
  pattern already in `app/api/kontakt/route.ts`. Zero new runtime deps.
- **Deterministic core.** Intent, language, scoring, recommendation and
  guardrails are pure rule-based functions — testable without an LLM and
  stable for regression evals.
- **Retrieval is lexical, not vector.** The knowledge base is dozens of
  entries; a token-overlap scorer with a light stemmer is reliable, fast
  and dependency-free. `KnowledgeRetriever` is an interface — a vector
  retriever can replace `LexicalRetriever` later without touching the agent.
- **The lead score is internal.** It is never in a reply and never sent to
  the visitor; `checkOutput` and a regression test both enforce this.
- **Pricing is data, not prompt.** Prices live in
  `knowledge/sources/pricing.ts` with `effectiveDate` / `approvalStatus` and
  are retrieved per turn. The system prompt contains no prices.

## What is deliberately deferred (decisions pending — see 13_OPEN_DECISIONS)

| Area | Now | Later |
|---|---|---|
| LLM provider | mock | OmniRoute / any OpenAI-compatible gateway (needs a key + base URL); adapter already built |
| Persistence | self-hosted Postgres on Hetzner (`deploy/digitalwerk/`), deployed in mock-LLM mode | point Vercel `AGENT_API_URL` at it once DNS + the Caddy vhost exist |
| Handoff / lead delivery | Resend adapter built; no-op until `RESEND_API_KEY` is set | set the key + verify a sending domain |
| Notification channels | Resend only | Slack / CRM = new file + one branch in `notifications/index.ts` |
| Session store | Postgres (same as leads) | Redis only if scale proves the need — `SqlClient` seam is separate from a KV seam |
| Retrieval | lexical | vector, only if conversation data justifies it |
| Rate limiting | per-session message cap + per-IP sliding window on the Agent API | edge rate limit + WAF |
| Admin UI | JSON endpoints + bearer token | a real dashboard + proper auth |
| Widget component tests | none | jsdom + Testing Library |
