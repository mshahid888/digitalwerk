# DigitalWerk Chat Agent

A consultative website assistant for DigitalWerk: understands visitor
intent, answers from approved knowledge, diagnoses business problems,
recommends a relevant DigitalWerk service, qualifies leads, and hands off
to the team when appropriate — in German and English.

Built to the planning package in the `DigitalWerk_Chat_Agent_Project`
folder (specs `01`–`15`, gap analysis `16`).

## Status

**Phase 4 — deployed on the existing Hetzner server, wired to Vercel, live
end to end in mock-LLM mode.** `PR #1` (`feat/chat-agent-foundation` → `main`)
is a **draft, not merged** — the chat agent is not yet on the public
production site.

- Provider-agnostic LLM layer (OmniRoute / any OpenAI-compatible gateway).
  **Mock provider active** until an OmniRoute key is set — no code change.
- Self-hosted Postgres on the Hetzner box (`deploy/digitalwerk/`), private
  Docker network, never exposed to Vercel or the browser.
- Standalone Hono Agent API on Hetzner behind the shared host Caddy
  (`https://agent.digitalwerkk.de`); the Vercel `/api/chat/*` routes proxy
  to it. Browser only ever calls the Vercel same-origin route.
- Retry-safe Resend notifications (**disabled** until a key is set — safe
  no-op), 30-day transcript retention, admin API.

Every external dependency (LLM gateway, Postgres, Resend) activates only
when its credential is present and degrades safely otherwise — the whole
system still develops and tests with **no paid resource**.

Remaining external blockers: OmniRoute key · Resend key · off-server backup
target · Vercel plan · legal sign-off · PR #1 merge. See `PHASE-4-REPORT.md`.

## Docs

| File | Topic |
|---|---|
| `ARCHITECTURE.md` | module layout, one-turn flow, transports, persistence, notifications, retention, admin |
| `DEPLOYMENT.md` | frontend-on-Vercel / agent-on-Hetzner split; what moves, what stays |
| `OPERATIONS.md` | incident runbook: health checks, agent/Postgres/Caddy failures, rollback, backups, PDF Wandler coexistence |
| `PROVIDER-SETUP.md` | connecting OmniRoute / any OpenAI-compatible gateway; Resend; Postgres |
| `PERSISTENCE.md` | store selection, schema, connection string |
| `ENVIRONMENT.md` | every env var (all optional; safe cost-free defaults) |
| `PRIVACY.md` | data flow, retention, what needs legal sign-off |
| `TESTING.md` | `npm test`, coverage map, regression rule |
| `LOCAL-SETUP.md` | run it locally, try the API |
| `KNOWLEDGE-UPDATES.md` / `PRICING-UPDATES.md` | editing the knowledge base / pricing |
| `PHASE-3-REPORT.md` / `PHASE-4-REPORT.md` | implementation reports + blocker list |

Server-side deploy assets: `deploy/digitalwerk/` (`README.md` runbook,
`compose.yml`, `backup.sh` / `restore.sh` / `maintenance.sh`, systemd
timers, `apply-caddy-vhost.sh`, `verify-https-endpoint.sh`).

## Quick start (local)

```bash
npm install
npm run dev        # chat launcher appears bottom-right on every page
npm test           # 118 deterministic, offline tests
npm run typecheck  # tsc (app) + tsc -p server
```

CI (`.github/workflows/ci.yml`) runs test / typecheck / lint / build on
every PR to `main`.
