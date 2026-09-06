# Chat Agent — Persistence

## Store selection

`getChatAgentStore()` (async, memoized per process) returns a
`ChatAgentStore`:

| Environment | Store | Durable? |
|---|---|---|
| a Postgres connection string is set | `PostgresChatAgentStore` (Neon) | yes |
| nothing set | in-memory | no — lost on cold start / redeploy |

Accepted connection-string vars, in priority order:
`CHAT_AGENT_DATABASE_URL`, `DATABASE_URL`, `POSTGRES_URL`,
`POSTGRES_PRISMA_URL`. Use Neon's **pooled** endpoint (`-pooler` in the
host). The store connects lazily and, if the database is unreachable at
init, logs and falls back to the in-memory store for that instance — the
conversation keeps working; only persistence is affected.

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
`end()`) in `postgres/client.ts` — never on a Neon-specific API. The
current adapter wraps `postgres.js` with serverless-friendly settings
(`max: 1`, `prepare: false` for the transaction pooler). Swapping to another
Postgres driver, or to Neon's HTTP driver for edge, is a change to that one
file. A future Redis session store would be a **separate** seam (a new
`SessionStore` impl selected in `persistence/index.ts`), not a change here.

## Provisioning Neon (when the datastore decision is executed)

1. Create a Neon project (free tier). Nothing in this repo does this.
2. Copy the **pooled** connection string.
3. Set it as `DATABASE_URL` (or `CHAT_AGENT_DATABASE_URL`) in Vercel →
   Settings → Environment Variables, for the environments that should
   persist (typically Production, optionally Preview).
4. Redeploy. First request runs the migration. `GET /api/chat/health`
   should then show `persistence.active: "postgres"`.
5. (Optional) run `schema.sql` manually first if you want the tables to
   exist before traffic.

No plan upgrade is required for the expected volume; Neon's free tier
covers it.

## Local development against Postgres (optional)

Point `CHAT_AGENT_DATABASE_URL` at any local/remote Postgres in
`.env.local`. Without it, `npm run dev` uses the in-memory store, which is
the normal path for feature work and is what the test suite exercises.
