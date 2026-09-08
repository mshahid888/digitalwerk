# DigitalWerk AI Chat Agent — Phase 4: Production Activation

Date: 2026-09-06 … 2026-09-07
Branch: `feat/chat-agent-foundation` (PR #1, **not merged**)
Deployed commit on Hetzner: `761c931`

---

## Status (updated 2026-09-07 — DNS live, HTTPS + Vercel wiring complete)

```
Engineering:          ~98%
Production readiness:  ~80%
```

The full public path is **live and verified end to end**:

```
browser → Vercel /api/chat/*  →  https://agent.digitalwerkk.de  (Let's Encrypt, host Caddy)
        →  Hetzner agent-api  →  private PostgreSQL      (LLM: mock, until OmniRoute)
```

Verified through the Vercel preview of `feat/chat-agent-foundation`: DE + EN
replies grounded in the knowledge base, lead qualification + scoring, human
handoff, and **every session / lead / handoff row confirmed in the Hetzner
Postgres** (handoff IDs returned by the Vercel API matched the DB rows).
`AGENT_API_SECRET` / `AGENT_API_URL` are set on the Vercel `digitalwerk`
project for **all environments** (secret is write-only); neither appears in
any client bundle or the page HTML. Production (`www.digitalwerkk.de`) was
redeployed and is healthy, but still serves `main` — the chat agent reaches
production only when PR #1 is merged (the env wiring is already in place for
that).

What remains is external: an **OmniRoute key** (agent runs on the mock
provider until then), a **Resend key**, an **off-server backup target**, the
**Vercel plan** decision, **PR #1 merge**, and **legal sign-off**.

### Phase 4 addendum — what was done 2026-09-07

- **DNS**: `A agent → 2.28.53.174` added in the IONOS panel (by the owner);
  propagated after ~1h40m.
- **HTTPS**: `deploy/digitalwerk/apply-caddy-vhost.sh` appended the
  `agent.digitalwerkk.de` vhost to the shared pdfwandler Caddyfile; Let's
  Encrypt cert issued; PDF Wandler never went down (config pushed via
  Caddy's admin API, then one ~2 s Caddy recreate to persist it).
- **Networking fix** (`4d2d18d`): the agent-api container now joins the
  existing `pdfwandler_edge` network itself (`external: true`) instead of a
  manual `docker network connect`, so the Caddy↔agent link survives a Caddy
  recreate. Active health checks removed from the vhost (single upstream,
  nothing to fail over to, 30 s recovery lag). `digitalwerk_edge` removed.
- **Bug fix** (`761c931`): a non-UUID `sessionId` reached the Postgres
  `uuid` column and came back as a 500; the handlers now reject a
  malformed `sessionId` with 400 before it hits the DB (a well-formed but
  unknown id still returns 404). +2 tests → **117 passing**.
- **Vercel**: `AGENT_API_URL` (Config) + `AGENT_API_SECRET` (Secret) added
  to all environments via the dashboard; preview and production both
  redeployed; the secret value was moved server→clipboard→form, never into
  chat/logs/git; local copies deleted afterwards.
- Bind-mount gotcha (single-file Caddyfile mount serving a stale inode after
  `sed -i`) documented in `deploy/digitalwerk/README.md`.

---

## Completed (this phase)

- **Deployed** the Phase 3 stack to `2.28.53.174` under
  `/opt/apps/digitalwerk/digitalwerk/`, isolated Compose project
  `digitalwerk` — `postgres:16-alpine` + `agent-api`, both healthy.
- **PostgreSQL is private**: on an `internal: true` Docker network (no
  outbound), `expose` only, **not published** — confirmed unreachable from
  the host and absent from `ss -tulpn`.
- **Fixed what the deploy surfaced** (committed):
  - Postgres needs `CHOWN/DAC_OVERRIDE/FOWNER/SETGID/SETUID` added back on
    top of `cap_drop: ALL` (official image drops root→postgres via gosu).
  - `store.ping()` — a non-memoised `SELECT 1`; `/api/chat/health` now
    returns **503 when the DB drops after startup** instead of a stale
    `ok` (verified: stop postgres → 503, start → 200).
  - Container `HEALTHCHECK` moved to `GET /` (liveness) so a DB blip does
    not flap the container; `/api/chat/health` stays the readiness signal.
  - `maintenance.sh` (new) runs the retention/handoff-retry cron **inside
    the container over loopback** — works before DNS exists.
  - Backup/restore/maintenance scripts no longer pass `POSTGRES_PASSWORD` /
    `CRON_SECRET` on the host command line (they were landing in the sudo
    journal); the container's own shell expands them now. **Journal
    re-scanned: 0 occurrences of either secret.**
- **Secrets**: generated on-server (`openssl rand`), `.env` mode 600,
  gitignored. `AGENT_API_SECRET` / `CHAT_AGENT_ADMIN_TOKEN` / `CRON_SECRET`
  rotated at the end of the session (interactive test calls had logged the
  shared secret to the root-only journal). No secret is in the repo, the
  image, or client-reachable config.
- **Backups**: `backup.sh` runs (`pg_dump | gzip`, daily+weekly rotation);
  `restore.sh` verified — restores a real dump into a throwaway DB, prints
  row counts, drops it. Both systemd timers installed and **enabled**
  (`digitalwerk-backup.timer` 04:15 UTC, `digitalwerk-maintenance.timer`
  03:30 UTC); each `.service` ran once by hand and succeeded.
- **Regression**: 115/115 tests, `tsc` (root + server), ESLint, `next build`
  (54 routes) all green. PDF Wandler: 4 containers healthy, all 3 external
  endpoints 200, unchanged. Combined new footprint ≈ 105 MB RSS
  (limits 384 + 256 MB); box still has ~2.5 GB RAM free.

## Verified

| Check | Result |
|---|---|
| Tests | **115 / 115** |
| TypeScript (root + `server`) | **PASS** |
| ESLint | **PASS** (0 / 0) |
| `next build` | **PASS** (54 routes; `/api/chat/*` dynamic) |
| Hetzner deploy | **PASS** — compose up, both containers healthy |
| PostgreSQL | **PASS** — private, persisted a full session→lead→handoff→events set, restore test OK |
| Agent API | **PASS** — session, grounded pricing reply, qualification, handoff-queued, admin (401→200), health |
| Security | **PASS** — X-Agent-Auth gate (403), prompt-injection refused without hitting the model, oversized input 400, per-IP rate-limit 429, CORS rejects unknown origin, no `NEXT_PUBLIC_`/secret in the container env, no secret in the journal |
| Failure modes | **PASS** — DB down → `/health` 503 + safe 500 on writes, recovers on restart; OmniRoute absent → deterministic mock reply; Resend absent → handoff recorded `dispatched:false` with `lastDispatchError`, no crash |
| OmniRoute | **BLOCKED** — no credentials; runs on the mock provider |
| Resend | **BLOCKED** — no API key / verified domain |
| DNS (`agent.digitalwerkk.de`) | **BLOCKED** — record not created |
| HTTPS / Caddy vhost | **BLOCKED** — depends on DNS; shared Caddy deliberately untouched |
| Off-server backup | **BLOCKED** — no `BACKUP_RCLONE_REMOTE` destination |
| E2E through the public domain | **BLOCKED** — depends on DNS + Caddy + Vercel `AGENT_API_URL` |

## Current request flow (today)

```
browser → Vercel /api/chat/* (in-process agent, memory store) → mock LLM
```

`AGENT_API_URL` is **not** set on Vercel, so the Next routes run the agent
in-process. Postgres is never involved on Vercel. Switching to the
production flow (`… → Hetzner Agent API → private Postgres`) is three steps:
DNS record → Caddy vhost + `docker network connect` → set `AGENT_API_URL` +
`AGENT_API_SECRET` on Vercel. No code change.

## Correction to the Phase 3 report

The `digitalwerkk.de` DNS zone is hosted at **IONOS** (`ns10xx.ui-dns.*`),
not Vercel — Vercel's apex/`www` records live inside that IONOS zone. The
`agent` A-record is added in the **IONOS DNS panel**. This is a free change.

---

## Remaining blockers

```
✅ DONE 2026-09-07 — DNS record (A agent → 2.28.53.174, IONOS panel).
✅ DONE 2026-09-07 — HTTPS vhost on the shared Caddy (agent.digitalwerkk.de,
   Let's Encrypt, PDF Wandler untouched — apply-caddy-vhost.sh).
✅ DONE 2026-09-07 — Vercel wiring (AGENT_API_URL + AGENT_API_SECRET on the
   digitalwerk project, all environments; preview + production redeployed;
   full public E2E verified against the preview → Hetzner Postgres).

1. BLOCKER — OmniRoute credentials
   Owner:  DigitalWerk / account owner
   Exact action:  Obtain an OmniRoute instance + API key. On the server, in
   /opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk/.env set
   LLM_PROVIDER=omniroute, LLM_BASE_URL=https://<host>/v1, LLM_API_KEY=<key>,
   LLM_MODEL=<provider/model-id>; then `sudo docker compose up -d agent-api`.
   Verify: health shows llm.provider "omniroute", configured, live:true.

2. BLOCKER — PR #1 merge (agent → production)
   Owner:  DigitalWerk (after legal sign-off, #5)
   Exact action:  Merge feat/chat-agent-foundation to main. Vercel then
   auto-deploys main to production WITH the AGENT_API_URL / AGENT_API_SECRET
   already set, and www.digitalwerkk.de/api/chat/* starts proxying to
   Hetzner. Until then production serves the pre-agent site.

3. BLOCKER — Resend
   Owner:  DigitalWerk
   Exact action:  Create a Resend API key, verify a sending domain
   (e.g. mail.digitalwerkk.de). In the server .env set
   CHAT_AGENT_HANDOFF_CHANNEL=resend, RESEND_API_KEY=<key>,
   CHAT_AGENT_NOTIFY_FROM=<verified address>, CHAT_AGENT_NOTIFY_TO=<inbox>;
   `docker compose up -d agent-api`. Queued handoffs deliver on the next
   maintenance run (or `POST /api/chat/admin/handoffs`).

4. BLOCKER — Off-server backups
   Owner:  ops
   Exact action:  `rclone config` a remote (Cloudflare R2 / Backblaze B2
   free tier, or a Hetzner Storage Box). Set BACKUP_RCLONE_REMOTE (and
   optionally a healthchecks.io URL as BACKUP_HEALTHCHECK_URL) in the
   server .env. Also enable Hetzner Cloud Backups on the CX23 (~€1/mo — a
   paid item, flagged not purchased).

5. BLOCKER — Legal / business sign-off
   Owner:  DigitalWerk + counsel
   Exact action:  Verify the `provisional` pricing entries; name the
   sub-processors (OmniRoute + upstream model provider, Hetzner, Resend) in
   /datenschutz and /en/privacy-policy; confirm legal bases + third-country
   transfer; DPAs; AI Act transparency assessment. Then merge PR #1 (#2).

6. BLOCKER — Vercel plan (commercial use)
   Owner:  Vercel account owner
   Exact action:  Vercel team is on Hobby, which prohibits commercial use;
   www.digitalwerkk.de is commercial. Upgrade to Pro (a paid item — not
   done). Moving the agent to Hetzner does not by itself resolve this.
```

## Next action (requires you)

**Provide an OmniRoute instance + API key** (blocker #1). Set the four
`LLM_*` values in `/opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk/.env`
on the server and `sudo docker compose up -d agent-api` — the agent switches
off the mock provider with no code change. Everything else is a credential,
a paid upgrade, or a legal/merge decision only you can make.
