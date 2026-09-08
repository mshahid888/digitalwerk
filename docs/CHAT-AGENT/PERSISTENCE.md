# Chat Agent — Persistence

## Store selection

`getChatAgentStore()` (async, memoized per process) returns a
`ChatAgentStore`:

| Environment | Store | Durable? |
|---|---|---|
| a Postgres connection string is set | `PostgresChatAgentStore` | yes |
| nothing set | in-memory | no — lost on cold start / redeploy |

Accepted connection-string vars, in priority order:
`CHAT_AGENT_DATABASE_URL`, `DATABASE_URL`, `POSTGRES_URL`,
`POSTGRES_PRISMA_URL`. In production this is the **self-hosted Postgres 16
on the Hetzner box** (`deploy/digitalwerk/`), reached only by the Hetzner
Agent API over a private `internal: true` Docker network. The store
connects lazily and, if the database is unreachable at init, logs and falls
back to the in-memory store for that instance — the conversation keeps
working; only persistence is affected.

## What is stored where

| Table | Contents | Retention |
|---|---|---|
| `chat_sessions` | session metadata (locale, timestamps, last intent/recommendation, handoff flag) **and** `messages` = the raw transcript | metadata: kept · transcript: **purged after ≤30 days** |
| `chat_leads` | the permanent lead record — only the minimum fields for lead handling (contact, company, industry, problem, current process, desired outcome, tools, timeline, budget, notes, score + breakdown, intent, recommended service, conversation summary, status, timestamps) | kept |
| `chat_handoffs` | handoff record + payload + notification delivery state (`dispatched`, `dispatch_attempts`, `dispatched_at`, `last_dispatch_error`) | kept |
| `chat_events` | raw analytics events | **purged after ≤30 days** |

One lead per session (`chat_leads.session_id` is unique; upsert merges).
The lead record stays complete and useful after the transcript is purged.

## Schema / migrations

- Authoritative: `lib/chat-agent/persistence/postgres/schema.ts`
  (`SCHEMA_STATEMENTS`), applied idempotently by `store.init()` on first use
  (`CREATE TABLE IF NOT EXISTS` + indexes).
- Reference copy: `lib/chat-agent/persistence/postgres/schema.sql` — run it
  by hand against a fresh database if you prefer explicit migration.
- To evolve the schema: add a statement to `SCHEMA_STATEMENTS` (idempotent —
  `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`), mirror it into
  `schema.sql`, and bump nothing else. There is no migration-version table
  yet; add one (`schema_migrations`) before the first destructive change.

## Driver decoupling

`store.ts` depends only on the `SqlClient` interface (`query(text, params)`,
`end()`) in `postgres/client.ts` — no vendor-specific API. The current
adapter wraps `postgres.js`. Swapping to another Postgres driver is a change
to that one file. A future Redis session store would be a **separate** seam
(a new `SessionStore` impl selected in `persistence/index.ts`), not a change
here.

## Provisioning (production: the Hetzner Postgres)

The production database is stood up by `deploy/digitalwerk/compose.yml`
(`postgres:16-alpine`, tuned for a small box, on an `internal: true` Docker
network, never published). Full runbook: `deploy/digitalwerk/README.md`.
The Hetzner Agent API's `.env` sets
`CHAT_AGENT_DATABASE_URL=postgresql://…@postgres:5432/digitalwerk`; the
schema self-applies on the first request. `GET /api/chat/health` then shows
`persistence.active: "postgres"`, `database: "ok"`.

The Vercel deployment does **not** get a database URL — its `/api/chat/*`
routes proxy to the Hetzner Agent API instead (see `DEPLOYMENT.md`).

## Local development against Postgres (optional)

Point `CHAT_AGENT_DATABASE_URL` at any local/remote Postgres in
`.env.local`. Without it, `npm run dev` uses the in-memory store, which is
the normal path for feature work and is what the test suite exercises.
