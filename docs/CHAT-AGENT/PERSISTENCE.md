# Chat Agent — Persistence

## What persists

| Entity | Written when | Read by |
|---|---|---|
| Conversation / session | every turn | the next turn in the same session |
| Lead | score leaves the `informational` band, or explicit form input | admin follow-up, handoff payload |
| Handoff | the agent escalates, or the visitor clicks "talk to the team" | the team (via a future notification channel) |
| Analytics event | session start, each message, handoff | conversation analytics |

Interfaces: `lib/chat-agent/persistence/types.ts` —
`ConversationStore`, `LeadStore`, `HandoffStore`, `EventStore`, bundled as
`ChatAgentStore`.

## Current implementation

`memory-store.ts` — an in-memory `ChatAgentStore`. Chosen for the Phase 1
foundation because it needs **no infrastructure and no cost**.

Limitations (do not ship to production as-is):

- data is lost on every cold start / redeploy;
- not shared across serverless invocations or regions;
- `globalThis.__chatAgentStore` keeps it alive within one warm instance only.

For local dev, a single preview instance, and the whole test suite, this is
sufficient.

## Production store — decision pending

`16_GAP_ANALYSIS.md` (planning package) lists the datastore as a hard
blocker requiring Shahid's decision. Recommended shape once decided:

- **Leads + handoffs + events** → a relational store (e.g. Vercel Postgres
  / Neon free tier). These are low-volume, queryable, and the team needs to
  read them.
- **Sessions / transcripts** → either the same Postgres (simplest) or a
  KV/Redis store with a TTL (e.g. Upstash free tier) if transcript
  retention should be short by default.

Retention (full transcripts vs. summaries, and for how long) is a
**privacy decision** that must be made before production — see spec 09.

## How to add a durable store

1. Implement the four interfaces in a new file, e.g.
   `persistence/postgres-store.ts`.
2. Change `getChatAgentStore()` in `persistence/index.ts` to return it when
   its connection string env var is set, falling back to the memory store
   otherwise.
3. Nothing in `agent/` or `app/api/chat/` changes.
4. Add migration/schema files alongside, and document the connection env
   var in `ENVIRONMENT.md` and `.env.example`.

## Handoff delivery

`service.ts` → `dispatchHandoff()` is the seam. Today it is a no-op unless
`CHAT_AGENT_HANDOFF_CHANNEL` is set (then it only marks the record
`pending:<channel>`). A real implementation would send the
`conversationSummary` by email (reuse the Resend pattern in
`app/api/kontakt/route.ts`), to Slack, or into a CRM. The structured
`HandoffPayload` already contains everything the team needs.
