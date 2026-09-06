# DigitalWerk AI Chat Agent — Phase 4: Production Activation

Date: 2026-09-06
Branch: `feat/chat-agent-foundation` (PR #1, **not merged**)
Deployed commit on Hetzner: `5aa0df5`

---

## Status

```
Engineering:          ~96%
Production readiness:  ~70%
```

The full stack is **deployed and verified on the existing Hetzner box in
mock-LLM mode**. What remains is external: an OmniRoute key, one DNS record,
the Caddy vhost + Vercel env wiring, a Resend key, an off-server backup
target, the Vercel plan, and legal sign-off.

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
1. BLOCKER — OmniRoute credentials
   Owner:  DigitalWerk / account owner
   Exact action:  Obtain an OmniRoute instance + API key. On the server, in
   /opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk/.env set
   LLM_PROVIDER=omniroute, LLM_BASE_URL=https://<host>/v1, LLM_API_KEY=<key>,
   LLM_MODEL=<provider/model-id>; then `sudo docker compose up -d agent-api`.
   Verify: health shows llm.provider "omniroute", configured, live:true.

2. BLOCKER — DNS record
   Owner:  whoever holds the IONOS login for digitalwerkk.de
   Exact action:  Add  A  agent  → 2.28.53.174  (TTL 3600) in the IONOS DNS
   panel. Wait for it to resolve.

3. BLOCKER — HTTPS vhost on the shared Caddy  (do after #2)
   Owner:  ops (has server access)
   Exact action:  Add the `agent.digitalwerkk.de` block from
   deploy/digitalwerk/README.md to the pdfwandler Caddyfile, then
   `sudo docker network connect digitalwerk_edge pdfwandler-caddy-1` and
   `sudo docker exec pdfwandler-caddy-1 caddy reload --config /etc/caddy/Caddyfile`.
   Verify: `curl https://agent.digitalwerkk.de/api/chat/health` → 200.

4. BLOCKER — Vercel wiring  (do after #3)
   Owner:  Vercel account owner
   Exact action:  Set env vars on the `digitalwerk` project —
   AGENT_API_URL=https://agent.digitalwerkk.de and AGENT_API_SECRET=<the
   value from the server .env> — then redeploy. The Next routes start
   proxying to Hetzner.

5. BLOCKER — Resend
   Owner:  DigitalWerk
   Exact action:  Create a Resend API key, verify a sending domain
   (e.g. mail.digitalwerkk.de). In the server .env set
   CHAT_AGENT_HANDOFF_CHANNEL=resend, RESEND_API_KEY=<key>,
   CHAT_AGENT_NOTIFY_FROM=<verified address>, CHAT_AGENT_NOTIFY_TO=<inbox>;
   `docker compose up -d agent-api`. Queued handoffs deliver on the next
   maintenance run (or `POST /api/chat/admin/handoffs`).

6. BLOCKER — Off-server backups
   Owner:  ops
   Exact action:  `rclone config` a remote (Cloudflare R2 / Backblaze B2
   free tier, or a Hetzner Storage Box). Set BACKUP_RCLONE_REMOTE (and
   optionally a healthchecks.io URL as BACKUP_HEALTHCHECK_URL) in the
   server .env. Also enable Hetzner Cloud Backups on the CX23 (~€1/mo — a
   paid item, flagged not purchased).

7. BLOCKER — Vercel plan (commercial use)
   Owner:  Vercel account owner
   Exact action:  Vercel team is on Hobby, which prohibits commercial use;
   www.digitalwerkk.de is commercial. Upgrade to Pro (a paid item — not
   done). Moving the agent to Hetzner does not by itself resolve this.

8. BLOCKER — Legal / business sign-off
   Owner:  DigitalWerk + counsel
   Exact action:  Verify the `provisional` pricing entries; name the
   sub-processors (OmniRoute + upstream model provider, Hetzner, Resend) in
   /datenschutz and /en/privacy-policy; confirm legal bases + third-country
   transfer; DPAs; AI Act transparency assessment. Then merge PR #1.
```

## Next action (requires you)

**Add one DNS record** in the IONOS panel for `digitalwerkk.de`:
`A  agent  →  2.28.53.174`. That unblocks #3 and #4, which I can then do.
Everything else on the list is a credential or a paid upgrade only you can
authorise.
