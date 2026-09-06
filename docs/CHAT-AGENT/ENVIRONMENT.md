# Chat Agent — Environment Variables

Every variable is **optional**. With none set, the agent runs on the
deterministic mock LLM provider, an in-memory store, and a no-op
notification channel — no external account, no cost. See `.env.example`
for the canonical list.

## LLM

| Variable | Default | Purpose |
|---|---|---|
| `CHAT_AGENT_PROVIDER` | `mock` (or `anthropic` if a key is present) | `mock` or `anthropic`. |
| `ANTHROPIC_API_KEY` | — | Anthropic Messages API key. **Only read when the provider resolves to `anthropic`.** Setting this incurs usage cost. Never commit it. |
| `CHAT_AGENT_MODEL` | `claude-sonnet-5` / `mock-1` | Model id override. |
| `CHAT_AGENT_TEMPERATURE` | `0.4` | Sampling temperature. |
| `CHAT_AGENT_MAX_OUTPUT_TOKENS` | `700` | Cap on generated tokens per turn. |

## Guardrails / limits

| Variable | Default | Purpose |
|---|---|---|
| `CHAT_AGENT_MAX_INPUT_CHARS` | `4000` | Max chars in one visitor message. |
| `CHAT_AGENT_MAX_MESSAGES_PER_SESSION` | `40` | Abuse guard — session then routes to the team. |
| `CHAT_AGENT_MAX_HISTORY_TURNS` | `16` | Turns kept in the model context window. |

## Persistence (Neon Postgres)

| Variable | Default | Purpose |
|---|---|---|
| `CHAT_AGENT_DATABASE_URL` | — | Postgres connection string. **Unset → in-memory store** (not durable). Takes precedence over the names below. |
| `DATABASE_URL` / `POSTGRES_URL` / `POSTGRES_PRISMA_URL` | — | Also accepted — these are what Vercel's Neon integration sets. |

Use Neon's **pooled** connection string (host contains `-pooler`). The
schema is created automatically on first use; `postgres/schema.sql` is the
reference DDL. Nothing is provisioned by this code — a Neon database must be
created first (its free tier is sufficient).

## Retention (privacy)

| Variable | Default | Purpose |
|---|---|---|
| `CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS` | `30` | Days to keep raw transcripts. **Hard-capped at 30.** |
| `CHAT_AGENT_EVENT_RETENTION_DAYS` | `30` | Days to keep raw analytics events. **Hard-capped at 30.** |

The permanent lead record is never affected by retention.

## Notifications (Resend email)

| Variable | Default | Purpose |
|---|---|---|
| `CHAT_AGENT_HANDOFF_CHANNEL` | — | `resend` to enable email. Unset → records only. |
| `RESEND_API_KEY` | — | Resend API key. Server-side only. Without it, `resend` stays a safe no-op. |
| `CHAT_AGENT_NOTIFY_TO` | `CONTACT_TO_EMAIL`, then `info@digitalwerkk.de` | Recipient for handoff + lead emails. |
| `CHAT_AGENT_NOTIFY_FROM` | `CONTACT_FROM_EMAIL`, then `onboarding@resend.dev` | Sender (must be a Resend-verified domain for production). |
| `CHAT_AGENT_NOTIFY_MAX_ATTEMPTS` | `5` | Max delivery retries before a handoff is left for manual follow-up. |

## Admin API + cron

| Variable | Default | Purpose |
|---|---|---|
| `CHAT_AGENT_ADMIN_TOKEN` | — | Bearer token for `/api/chat/admin/*`. **Unset → those endpoints return 503.** |
| `CRON_SECRET` | — | Secret Vercel Cron sends in the `Authorization` header for `/api/cron/purge-transcripts`. Set in production; without it the cron route runs unauthenticated and logs a warning. |

## Where to set them

- **Local:** `.env.local` (git-ignored). Copy from `.env.example`.
- **Vercel:** Project → Settings → Environment Variables. `CRON_SECRET` is
  set automatically by Vercel when you add a cron; the others are manual.

## Verifying

`GET /api/chat/health` reports which LLM provider, store kind and
notification channel are active, whether each key/URL is present (never the
value), and the retention settings. Check it after any deploy.
