# Chat Agent — Deployment Architecture

## Target: frontend on Vercel, agent + database on the existing Hetzner box

```
Website visitor
  │  https
  ▼
DigitalWerk chat widget  (Vercel — www.digitalwerkk.de, static Next.js)
  │  same-origin  POST /api/chat/*
  ▼
Next.js route handlers  (Vercel)
  │  if AGENT_API_URL set → proxy with X-Agent-Auth
  │  else                 → run the agent in-process (dev / pre-split)
  ▼
DigitalWerk Agent API  (Hetzner — digitalwerk-agent-api container, Hono)
  ├──► PostgreSQL  (Hetzner — digitalwerk-postgres container, PRIVATE Docker network, never published)
  ├──► OmniRoute / OpenAI-compatible gateway   (outbound https)
  └──► Resend   (outbound https, when configured)
```

Why this shape:

- **PostgreSQL is never on the public internet.** It lives on an
  `internal: true` Docker network that cannot even route outbound. Only the
  Agent API container can reach it.
- **The browser never talks to the Agent API.** It calls the Vercel
  same-origin `/api/chat/*`; the Next route proxies server-to-server with a
  shared secret (`X-Agent-Auth`). No CORS, no client-side URL, no key in the
  bundle.
- **One codebase.** The Next routes and the Agent API both call
  `lib/chat-agent/http/handlers.ts` — identical validation and business
  logic, two transports.
- **The whole public website does NOT move.** Only the ~9 agent endpoints
  run on Hetzner.

## Components

| Where | What | Repo path |
|---|---|---|
| Vercel | Next.js site + `/api/chat/*` proxy routes | `app/`, `lib/chat-agent/http/proxy.ts` |
| Hetzner | Agent API (Hono, run with `tsx`, no build step) | `server/`, `server/Dockerfile` |
| Hetzner | PostgreSQL 16 (isolated compose project) | `deploy/digitalwerk/compose.yml` |
| Hetzner | nightly `pg_dump` + off-server copy + restore test | `deploy/digitalwerk/backup.sh`, `restore.sh` |
| Hetzner | systemd timers (backup 04:15, maintenance 03:30) | `deploy/digitalwerk/systemd/` |
| Hetzner host Caddy | one added vhost `agent.digitalwerkk.de` → agent-api | see `deploy/digitalwerk/README.md` |

## Deploy runbook

Full step-by-step is in **`deploy/digitalwerk/README.md`**. Summary:

1. `ssh deploy@2.28.53.174`, `git clone` into `/opt/apps/digitalwerk/`.
2. `deploy/digitalwerk/.env` from `.env.example` (mode 600): set
   `POSTGRES_PASSWORD`, `AGENT_API_SECRET`, `CHAT_AGENT_ADMIN_TOKEN`,
   `CRON_SECRET`. Leave `LLM_*` as `mock` until OmniRoute creds exist.
3. `docker build -f server/Dockerfile -t digitalwerk-agent-api:<sha> .`
4. `docker compose -f deploy/digitalwerk/compose.yml up -d`
5. Apply `lib/chat-agent/persistence/postgres/schema.sql` (or let it
   self-apply on first request).
6. Add the `agent.digitalwerkk.de` DNS A-record → `2.28.53.174`
   (**BLOCKED — Vercel-managed DNS**).
7. Add the Caddy vhost + `docker network connect digitalwerk_edge pdfwandler-caddy-1`.
8. On Vercel: `AGENT_API_URL=https://agent.digitalwerkk.de` +
   `AGENT_API_SECRET=<same>`. The Next routes start proxying.
9. Install + enable the systemd timers.

## Verification

- `docker exec digitalwerk-agent-api-1 wget -qO- http://127.0.0.1:8080/api/chat/health`
  → `status: ok`, `database: ok`, `llm.provider: mock` (or `omniroute`).
- `curl https://www.digitalwerkk.de/api/chat/health` (once `AGENT_API_URL`
  is set) reflects the Hetzner Agent API's health.
- `docker stats` — postgres + agent-api together should stay well under
  their 384m / 256m limits; PDF Wandler unaffected.

## What stays on Vercel vs. moves

| Stays on Vercel | Moves to Hetzner |
|---|---|
| the entire marketing website (static) | the chat Agent API (session, message, lead, handoff, health, admin, cron) |
| `/api/kontakt` (contact form) | the chat database |
| `/api/chat/*` as a **thin proxy** | notification dispatch (Resend calls) |
| Vercel Cron (optional — Hetzner has its own timer) | the maintenance job (retention purge, handoff retry) |

The Vercel plan question is unchanged and separate: `www.digitalwerkk.de`
is commercial use and Hobby prohibits that → **Vercel Pro is required**
regardless of this split (documented in `16b_EXISTING_INFRASTRUCTURE_AUDIT.md`).
Moving the agent off Vercel reduces Vercel function usage but does not by
itself resolve the plan issue.
