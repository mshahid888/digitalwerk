# Chat Agent — Privacy & Data Handling

This documents what the chat agent does with data, so the privacy notice
and the legal review have a factual basis. It is **not** legal advice.

## Data flow

1. **Visitor message** → `POST /api/chat/message`. Held in the session.
2. **Session** (`chat_sessions`): a random UUID, locale, timestamps, the
   message list (raw transcript), the qualification state, last intent and
   recommendation. No IP address or device fingerprint is stored by the
   agent. (Server request logs are the hosting provider's, covered by the
   privacy notice's hosting section.)
3. **Lead** (`chat_leads`), created only once the internal score leaves the
   `informational` band: name, company, industry, email, phone, problem,
   current process, desired outcome, tools, timeline, budget, notes, the
   score + band + breakdown, intent, recommended service, a conversation
   summary, status, timestamps. These are the fields DigitalWerk needs to
   follow up a lead — nothing more.
4. **Handoff** (`chat_handoffs`) on escalation: the structured payload
   (same minimal fields + summary + reason) and the notification delivery
   state.
5. **Notification**: when `CHAT_AGENT_HANDOFF_CHANNEL=resend` and a key is
   set, an email with the minimal fields + summary (no raw transcript) goes
   to `CHAT_AGENT_NOTIFY_TO`.
6. **LLM**: in mock mode nothing leaves the server. When Anthropic is
   connected, the visitor's messages + the system prompt + retrieved
   knowledge are sent to Anthropic to generate the reply.

## Retention

- **Raw transcripts** (`chat_sessions.messages`) and **raw events**
  (`chat_events`): automatically deleted after
  `CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS` / `CHAT_AGENT_EVENT_RETENTION_DAYS`
  — default and maximum **30 days**. The sweep nulls the transcript and
  keeps session metadata.
- **Lead + handoff records**: kept (no automatic deletion) — the permanent
  record for lead handling. Deletion on request is a manual DB operation
  (or add a per-record delete endpoint later).
- Enforced by `conversations.purgeExpired()`, run daily by Vercel Cron
  (`/api/cron/purge-transcripts`) and on demand via
  `POST /api/chat/admin/purge`. Retention is configured in exactly one
  place (`config.ts` → the two `*_RETENTION_DAYS` vars); no retention
  logic is duplicated elsewhere.

## Guardrails relevant to privacy

- The system prompt tells the agent not to ask for special-category data
  (health, financial account details, government IDs) and to request
  contact details only when there is a clear reason.
- `checkOutput()` strips any reply that would leak a key, an env var name,
  or the system prompt.
- Admin endpoints (lead PII) are disabled unless `CHAT_AGENT_ADMIN_TOKEN`
  is set, and then require it as a Bearer credential.
- `RESEND_API_KEY` / `ANTHROPIC_API_KEY` / the DB URL are server-side only,
  never sent to the browser, never logged.

## What still needs legal / business sign-off before a public launch

(mirrored in the privacy-page notice)

- Name the **hosting providers** and complete the processing terms
  (pre-existing gap, section 3 of the privacy page). The actual setup:
  **Vercel** hosts the static site + the thin `/api/chat/*` proxy;
  **Hetzner** (Nürnberg, EU) hosts the Agent API + the PostgreSQL database.
- Name the **sub-processors** actually used, with a DPA (Art. 28) for each:
  Hetzner (hosting + database), Resend (email — **only if** a key is set;
  currently disabled), and — **only if** OmniRoute / an upstream model
  provider is connected — the **AI provider**, including the legal basis for
  any transfer and any **third-country transfer** mechanism. Until then the
  assistant runs on the local mock provider with no external AI call.
- Confirm the **legal bases** stated (Art. 6(1)(f) / 6(1)(b)) and the
  balancing test for the legitimate-interest basis.
- Decide whether an **AI Act** transparency obligation applies and whether
  the current in-widget "this is an AI assistant, not a staff member"
  disclosure is sufficient.
- Confirm the **retention periods** (30-day raw-transcript cap; "kept as
  long as necessary" for the lead record — a concrete period may be
  preferable) and the **extent of the verbatim conversation excerpt**
  retained in the permanent lead record (`summary.ts` keeps the last up to 8
  messages; the notification e-mail no longer includes it).
- Data-processing agreements (Art. 28) with each processor.
- Whether the chat should be gated behind cookie/consent (it currently
  sets no cookies and uses no `localStorage`).
