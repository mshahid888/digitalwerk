# DigitalWerk — Existing Infrastructure Audit

**Date:** 2026-09-06 · **Type:** read-only audit · **Author:** Claude
**Nothing was provisioned, modified, restarted or reconfigured. No money was spent.**

---

## Important limitation — the live audit could not be completed

A direct read-only inspection of the Hetzner server (`ssh deploy@2.28.53.174`,
`docker ps`, `df -h`, `free -m`, `systemctl`, `ss -tlnp`, `ufw status`, …)
**was blocked by the environment's permission policy**, and no Hetzner Cloud
API token was available. This audit therefore reconstructs the Hetzner state
from **authoritative, recent, in-repo sources** rather than a live probe:

| Source | What it gave us |
|---|---|
| `github.com/mshahid888/pdfwandler-backend2` → `deploy/README.md`, `deploy/compose.yml`, `deploy/Caddyfile`, `deploy/.env.example` | The exact production stack, server spec, firewall, monitoring, backup config — the deploy dir is explicitly "reproducible from a clean Git checkout" and the README states "**Production is LIVE**" |
| `~/Documents/PHASE1_MASTER_PLAN.md` | Confirms PDF Wandler was the driver for the Hetzner build |
| `~/.ssh/known_hosts` | One host recorded: `2.28.53.174` (ed25519 + rsa + ecdsa host keys) — matches the deploy README |
| Vercel MCP (live) | Team plan, project list, deployment history, domains |
| `digitalwerk` repo @ `2041bc0` | `PostgresChatAgentStore` / `SqlClient` review |
| Vendor pricing pages + aggregators (Sept 2026) | Cost figures — all cited, none invented |

**Every "current usage" number in §4 is marked UNKNOWN with the exact
command to obtain it.** Run the block in §18 → "commands for the owner" and
paste the output to finalise this document.

---

## 1. Executive summary

- There **is** an existing Hetzner server: a **CX23** (`2.28.53.174`,
  Ubuntu, **2 vCPU / ~4 GB RAM / 40 GB disk / 2 GB swap**) running a
  hardened single-host Docker Compose stack for **PDF Wandler**: Caddy +
  two Next.js frontend containers + one FastAPI backend. `www.pdfwandler.de`
  is **live** on it. There is **no database, no Redis, no message queue** —
  by design (PDF processing is synchronous).
- **Committed container memory is ~3.0 GB of ~4 GB.** Real free RAM is
  unknown until measured, but the headroom on paper is ~1 GB + 2 GB swap.
- **The Hetzner box CAN host a small PostgreSQL for the DigitalWerk chat
  agent** (leads / handoffs / session metadata — low volume, tiny data)
  as one more hardened container, **if** current free RAM ≥ ~700 MB. It
  should be confirmed by measurement first, and it needs an **off-server
  backup** added (none exists today).
- It should **not** also take the DigitalWerk Next.js app yet — no RAM
  headroom, and it would couple two unrelated products on one un-replicated
  box. A one-size-up resize (**CX33: 4 vCPU / 8 GB / €8.49/mo**) removes
  that constraint and is the cheapest way to make "everything on Hetzner"
  comfortable.
- **The chat-agent code connects to a Hetzner-hosted Postgres with zero
  architectural change** — `SqlClient` takes any connection string; only
  two tuning values (`prepare`, `max`) would ideally become env-overridable.
- **Vercel finding:** the account is on the **Hobby** plan, whose terms
  **prohibit commercial use** — and `www.digitalwerkk.de` (advertising
  services for sale, built for payment) is commercial by Vercel's own
  definition. This is a **standing ToS exposure today**, independent of the
  chat agent. Moving DigitalWerk to the existing Hetzner box (as PDF
  Wandler already did) would remove it.
- **Backup / DR is the weakest area.** The only backup is a weekly local
  copy of Caddy certs + config to a directory **on the same disk**. If the
  CX23's disk fails, there is nothing off-site. Adding a database makes
  this urgent.
- **Recommendation:** **share the existing Hetzner server** for the
  DigitalWerk Postgres (Option A), after (a) measuring free RAM, (b) adding
  `pg_dump` → off-server backup (Hetzner Storage Box BX11, **€3.20/mo**, or
  a free object-storage tier). Keep the DigitalWerk **app on Vercel for
  now but move to Pro** (or plan the Hetzner move). Do **not** create Neon
  or Upstash.

---

## 2. Existing Hetzner infrastructure

> Reconstructed from `pdfwandler-backend2/deploy/`. Confirm live with §18.

### 2.1 Server

| Item | Value | Source | Live-confirmed? |
|---|---|---|---|
| Provider / product | Hetzner Cloud, **CX23** (shared vCPU, cost-optimised line) | `deploy/README.md`, `deploy/.env.example` ("CX23 = 2 vCPU") | ⬜ run `§18` |
| Public IP | `2.28.53.174` | `deploy/README.md`, `~/.ssh/known_hosts` | ✅ (in known_hosts) |
| vCPU | 2 (shared) | `deploy/README.md` | ⬜ `nproc` |
| RAM | ~4 GB | `deploy/README.md` | ⬜ `free -m` |
| Disk | 40 GB (NVMe SSD) | `deploy/README.md` | ⬜ `df -h /` |
| Swap | 2 GB | `deploy/README.md` | ⬜ `swapon --show` |
| OS | Ubuntu (version unstated) | `deploy/README.md` | ⬜ `cat /etc/os-release` |
| Region | not stated (TZ `Europe/Berlin`) | `deploy/.env.example` | ⬜ Hetzner console |
| Current CX23 price | **€5.49/mo** ex VAT, 20 TB traffic (EU) — *third-party aggregator, Sept 2026; confirm in the Hetzner invoice* | costgoat.com | ⬜ invoice |

> Note: `2.28.53.174` is not in a typical Hetzner Cloud IP block, but the
> deploy README states it explicitly and DNS A-records point there. Confirm
> in the Hetzner Cloud console that this is the CX23's primary IPv4 (it may
> have a floating IP or the range may be a newer allocation).

### 2.2 CPU / RAM / disk usage — **UNKNOWN (measure)**

Paper budget only, from `deploy/compose.yml` `mem_limit`:

| Container | mem_limit | pids_limit |
|---|---|---|
| `caddy` | 128 MB | 100 |
| `web` (staging FE) | 640 MB | 200 |
| `web-prod` (prod FE) | 640 MB | 200 |
| `api` (FastAPI) | 1600 MB | 200 |
| **Total committed** | **~3008 MB** | |
| Headroom vs ~4 GB | **~1 GB + 2 GB swap** | |

`mem_limit` is a ceiling, not a reservation — real RSS is likely lower for
the idle frontends and Caddy, higher for `api` under a 50-image PDF job.
**Actual free memory must be measured** (`free -m`, `docker stats --no-stream`).

### 2.3 Docker & containers

- **Docker 29.x, Compose v2** (`deploy/README.md`).
- Compose project `pdfwandler`, 4 services: `caddy`, `web`, `web-prod`,
  `api`. All `restart: unless-stopped`, all healthchecked.
- **Runtime hardening on every container:** `read_only: true` root FS,
  `security_opt: [no-new-privileges:true]`, `cap_drop: [ALL]` (caddy adds
  back only `NET_BIND_SERVICE`), `pids_limit`, `mem_limit`, json-file logs
  capped at 10 MB × 3. `api`/`web`/`web-prod` run as non-root.
- Images tagged with the **exact Git commit SHA**; `:latest` never used.
- Named volumes: `caddy_data` (TLS certs — must persist), `caddy_config`,
  `api_uploads`, `api_temp` (1-hour retention, in-app cleaner).
- The legacy `docker-compose.yml` (Redis + Celery worker + beat) in the
  backend repo is **explicitly superseded and not deployed**.

### 2.4 Existing PostgreSQL — **NONE**

No Postgres anywhere in the PDF Wandler stack. `deploy/.env.example`:
> "this app has none (no DB, no API keys, no auth)".

### 2.5 Existing Redis — **NONE**

The Celery/Redis design was dropped in favour of synchronous processing
(`celery_app.py` docstring; `docker-compose.yml` marked LEGACY).

### 2.6 PDF Wandler services (running)

| Service | Image | Purpose | Port (internal) |
|---|---|---|---|
| `caddy` | `caddy:2.8-alpine` | reverse proxy, auto-HTTPS (Let's Encrypt), HTTP/3, security headers | 80/443 published; admin 2019 internal |
| `web` | `pdfwandler-web:<sha>` | Next.js 16.3.4 (React 18, next-i18next), **staging** build (`staging.pdfwandler.de`) | 5000 |
| `web-prod` | `pdfwandler-web-prod:<sha>` | same source, **production** build (`www.pdfwandler.de`) — separate image because `NEXT_PUBLIC_API_URL` is build-time-inlined | 5000 |
| `api` | `pdfwandler-api:<sha>` | FastAPI + Gunicorn/UvicornWorker, Python 3.11; `POST /api/image-to-pdf`, `/api/merge-pdf`, `/api/compress-pdf`, `GET /health` | 8000 |

### 2.7 DigitalWerk services on Hetzner — **NONE**

DigitalWerk is entirely on Vercel (see §11). The Hetzner box has no
DigitalWerk code, containers or data.

### 2.8 Reverse proxy

**Caddy 2.8-alpine**, config in `deploy/Caddyfile`:
- `staging.pdfwandler.de` → `web:5000`; `/api/*` `/health` → `api:8000`
- `www.pdfwandler.de` → `web-prod:5000`; `/api/*` `/health` → `api:8000`
  (320 s response-header timeout for long PDF jobs)
- `pdfwandler.de` → 301 → `www`
- Automatic HTTPS (Let's Encrypt), `encode zstd gzip`, HTTP/3
- Edge upload cap `request_body max_size` (100 MB), kept in sync with the
  backend
- Security headers: HSTS (1 yr, includeSubDomains), `X-Content-Type-Options`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`
  (camera/mic/geo/topics denied), a **full enforced CSP** (`script-src
  'self'`, no nonce), `Server` and `X-Powered-By` stripped

### 2.9 Firewall / open ports

- **Hetzner Cloud Firewall = the authoritative perimeter.** Inbound open:
  **22/tcp, 80/tcp, 443/tcp, 443/udp** only (`deploy/README.md` →
  "Network perimeter").
- Host **UFW deliberately disabled** — documented rationale: Docker's DNAT
  bypasses UFW's INPUT chain for published ports, so UFW would add risk
  without benefit.
- Caddy admin (`:2019`), `api` (`:8000`), frontends (`:5000`) are
  **container-internal only** (not published).
- ⬜ Confirm the Hetzner Cloud Firewall rule set in the console
  (source-IP restriction on 22? it should be your IP only).

### 2.10 Domains / DNS / TLS

| Domain | Points to | DNS managed by | TLS |
|---|---|---|---|
| `www.pdfwandler.de` | A → `2.28.53.174` | **Vercel** (`deploy/README.md`) | Caddy / Let's Encrypt on the host |
| `pdfwandler.de` | A → `2.28.53.174` (301 → www) | Vercel | Caddy / LE |
| `staging.pdfwandler.de` | A → `2.28.53.174` | Vercel | Caddy / LE |
| `pdfwandler-frontend2.vercel.app` | Vercel (kept as **rollback path only**, `live: false`) | — | Vercel |
| `www.digitalwerkk.de`, `digitalwerkk.de` | **Vercel** (production) | Vercel | Vercel |

Certs live in the `caddy_data` volume; re-issuable if lost (subject to LE
rate limits) — **so this volume must be in the backup set** (it is).

### 2.11 Backups — see §7 (weakest area)

### 2.12 Monitoring

- **`healthcheck_monitor.sh`**, cron `*/5 * * * *`: checks all 4 containers
  (health + restart-count deltas), disk (80 % / 90 % thresholds), **TLS
  expiry (14-day warning)**, `/health` for staging **and** www; daily
  heartbeat. `monitor.log` self-trims to 2000 lines.
- **No external / paid monitoring** (no UptimeRobot, no Grafana, no
  Sentry) — a cron script writing a local log.
- No alerting channel is documented — ⬜ confirm whether `monitor.log`
  failures notify anyone (email? none visible).

### 2.13 Security configuration — see §6

### 2.14 Available capacity — see §4 / §9 (must be measured)

---

## 3. Current applications

| App | Where | Status | Repo(s) | Notes |
|---|---|---|---|---|
| **PDF Wandler** frontend + API | Hetzner CX23 (`2.28.53.174`) | **LIVE** (`www.pdfwandler.de`) | `mshahid888/pdfwandler-backend2` (SSH deploy key), `mshahid888/pdfwandler-frontend2` (HTTPS, no key yet) | Caddy + 2×Next.js + FastAPI, synchronous, no DB/Redis |
| PDF Wandler frontend (Vercel) | Vercel project `pdfwandler-frontend2` | **rollback only**, `live:false`, no custom domain | `mshahid888/pdfwandler-frontend2` | superseded by the Hetzner deploy |
| `finalupdatedpdfwandler` | Vercel project | present, `habibcommits/finalupdatedpdfwandler` | — | ⬜ purpose unclear — likely an older PDF Wandler iteration; confirm and archive if dead |
| **DigitalWerk** website | Vercel project `digitalwerk` | **LIVE** (`www.digitalwerkk.de`) | `mshahid888/digitalwerk` | Next.js 16, static; chat agent on branch `feat/chat-agent-foundation` (PR #1, not merged) |

All three Vercel projects sit on **one Hobby team** (`team_EwwNdZIln6OXGj5AoHDoGyAs`, "Muhammad Shahid 's projects").

---

## 4. Current resource capacity — **MUST BE MEASURED**

| Metric | Paper figure | Live figure | Command |
|---|---|---|---|
| vCPU | 2 | ⬜ | `nproc` |
| RAM total | ~4 GB | ⬜ | `free -m` |
| RAM used / free | — | ⬜ | `free -m`, `docker stats --no-stream` |
| Swap used | 2 GB total | ⬜ | `free -m`, `swapon --show` |
| Disk total / used / free | 40 GB | ⬜ | `df -h /` |
| Docker disk (images/volumes/build cache) | — | ⬜ | `docker system df` |
| Load average | — | ⬜ | `uptime` |
| Container RSS (each) | limits in §2.2 | ⬜ | `docker stats --no-stream` |
| Largest volume | `caddy_data` + `api_*` | ⬜ | `docker system df -v` |

**Working assumption pending measurement:** an idle CX23 running this stack
uses roughly **1.5–2.5 GB RAM** (Caddy ~30 MB, two idle `next start` ~150–250
MB each, FastAPI/Gunicorn 2 workers ~250–450 MB), leaving **~1.5–2.5 GB
free** — enough for a tuned PostgreSQL (256–512 MB `shared_buffers`-class
footprint). **Under a large PDF job the `api` container can spike toward its
1.6 GB limit**, so a co-tenant Postgres must have a firm `mem_limit` and the
host must not be allowed to OOM-kill it.

---

## 5. Database assessment

### 5.1 Today

**No database exists on any owned infrastructure.** DigitalWerk is static;
PDF Wandler is stateless; the chat agent (PR #1) currently uses an
in-memory store.

### 5.2 What the DigitalWerk chat agent needs

| Data | Volume estimate | Access pattern |
|---|---|---|
| `chat_sessions` (metadata + transcript, transcript purged ≤30 d) | tens–hundreds of rows/day, KB each | write-heavy per turn, rarely re-read |
| `chat_leads` (permanent, minimum fields) | a few–dozens/day, ~1 KB each | write on capture, read by team |
| `chat_handoffs` | a handful/day | write + delivery-state updates |
| `chat_events` (purged ≤30 d) | hundreds/day, tiny | append-only |

**Total steady-state data: well under 1 GB even after a year.** Query load:
a few writes per chat message, occasional admin `SELECT … LIMIT 100`. This
is a **tiny** Postgres workload — comfortably within a 256 MB container on
the CX23.

### 5.3 Can the chat-agent code use a Hetzner Postgres unchanged?

**Yes — no architectural change.** Reviewed at `2041bc0`:

- `lib/chat-agent/persistence/postgres/client.ts` → `createPgClient(connectionString)`
  accepts **any** Postgres URL (`postgresql://user:pass@2.28.53.174:5432/digitalwerk?sslmode=require`).
- `lib/chat-agent/config.ts` reads the URL from
  `CHAT_AGENT_DATABASE_URL` / `DATABASE_URL` / `POSTGRES_URL` / `POSTGRES_PRISMA_URL`.
- `SqlClient` is a 2-method interface (`query`, `end`) — driver-agnostic.
- Schema self-applies (`CREATE TABLE IF NOT EXISTS`) on first use.

Two **tuning** values were chosen for Neon's serverless pooler and should
become env-overridable (a ~5-line change, not architecture) for a direct
Hetzner connection:

| Setting | Now | For direct Hetzner Postgres |
|---|---|---|
| `prepare: false` | required for PgBouncer transaction pooling | `true` is fine and slightly faster (no pooler) |
| `max: 1` | correct for Vercel serverless (1 conn/instance) | keep `1` if the app stays on Vercel; raise to ~10 if the app moves to Hetzner (long-lived process) |

### 5.4 Networking — the real question

If the DigitalWerk app **stays on Vercel** and talks to a **Hetzner**
Postgres, the connection crosses the public internet. Options, best first:

1. **Move the DigitalWerk app to the same Hetzner host / private network**
   → Postgres never leaves `localhost` / the Docker network. Cleanest,
   also fixes the Vercel commercial-use issue (§11). This is the PDF
   Wandler pattern.
2. **WireGuard / Tailscale tunnel** Vercel-function → Hetzner. Adds a
   moving part; Vercel functions are ephemeral so the tunnel client must
   init per invocation.
3. **Expose Postgres on 5432 to the internet, `sslmode=require` + strong
   creds + Hetzner Cloud Firewall source-IP allow-list.** Vercel does
   **not** publish stable egress IPs on Hobby/Pro without a paid add-on, so
   the allow-list can't be tight — **not recommended**.

**Conclusion:** a Hetzner Postgres is only clean if the DigitalWerk app is
(or moves) co-located. Otherwise a managed Postgres reachable over TLS from
Vercel is operationally simpler — which is the tension this audit has to
resolve (see §12).

---

## 6. Security assessment

**Strong for what exists:**

| Control | State |
|---|---|
| Perimeter firewall | Hetzner Cloud Firewall, 22/80/443 only |
| Container hardening | read-only FS, `cap_drop ALL`, `no-new-privileges`, non-root, `pids_limit`, `mem_limit` on every container |
| TLS | Caddy auto-HTTPS, HSTS 1 yr, HTTP/3 |
| HTTP security headers | full set incl. enforced CSP; fingerprint headers stripped |
| Secrets | **none exist** — PDF Wandler has no DB/keys/auth; `.env` is config only, mode 600, gitignored |
| Image supply chain | pinned base images, SHA-tagged app images, no `:latest` |
| Upload safety | edge + in-app size caps; 1-hour file retention; per-request cleanup |

**Gaps / unknowns (⬜ confirm):**

- SSH: is password auth disabled (`PasswordAuthentication no`)? is root
  login disabled? is 22 restricted to your IP in the Cloud Firewall?
- Is there `fail2ban` or equivalent on SSH?
- Unattended security upgrades enabled (`unattended-upgrades`)?
- Docker daemon rootless? (likely not — `sudo docker` throughout) — a
  root Docker daemon means container escape ⇒ host root. Acceptable for a
  single-tenant box, worth noting.
- No WAF / rate-limiting in front of the API (Caddy has none configured;
  no Cloudflare). A PDF endpoint that does CPU-heavy work with no auth and
  no rate limit is a **DoS surface**.
- No intrusion detection / audit logging beyond container logs.
- `monitor.log` has **no alerting path** documented — a silent failure
  stays silent.

**If a DigitalWerk Postgres is added**, new controls needed: a dedicated
DB user per app (least privilege), `pg_hba.conf` restricted to the Docker
network, a firm `mem_limit`, and the DB **must** be in a real backup set
(§7). Lead data is **PII** — losing it or leaking it is a GDPR incident.

---

## 7. Backup / disaster-recovery assessment — **WEAKEST AREA**

### 7.1 What exists

- **`backup_state.sh`**, cron **weekly (Sun 04:30 UTC)** → `backups/` on
  the host. Backs up: `caddy_data` (certs) + `caddy_config` + `.env` +
  image manifest. **7 kept.**
- `/tmp/rollback-snapshot/` — `.env` + `Caddyfile` + `compose.yml` copied
  before each production change.
- Git history on both repos; the old Vercel deployment as a rollback path.

### 7.2 What this means

| Question | Answer |
|---|---|
| Existing DB backup? | **N/A — no database exists** |
| Are backups off the main server? | **No.** `backups/` is a directory on the same 40 GB disk. |
| Is there a Hetzner snapshot / the Cloud Backups add-on? | ⬜ **UNKNOWN — check the Hetzner console.** The Cloud "Backups" feature (automatic weekly server-image snapshots) costs **+20 % of the server price** (~€1.10/mo on a CX23) and is the single highest-value fix. |
| What happens if the CX23's disk fails right now? | PDF Wandler is **down**. Recovery = new server + `git clone` + `docker compose build` + `docker compose up` + re-issue TLS certs + re-point DNS. Frontend rebuild currently needs a **manual `tar | ssh`** (no deploy key). Realistic RTO: **hours**, RPO: last git push + ≤1 week for certs (re-issuable anyway). Tolerable *only because there is no stateful data*. |
| What happens once a DigitalWerk DB is on it? | A disk failure now = **permanent loss of every lead / handoff** since the last backup. Unacceptable without off-server DB backups. |

### 7.3 Recommended DR additions (in priority order)

1. **Enable Hetzner Cloud Backups** on the CX23 (~€1.10/mo, +20 %) — weekly
   full-server image snapshots, one click, no scripting. Do this regardless
   of the DB decision.
2. **If a Postgres is added:** nightly `pg_dump` (gzip) → **off-server**:
   - Hetzner **Storage Box BX11**, 1 TB, **€3.20/mo** (SFTP/rsync/BorgBackup;
     same provider, different failure domain), **or**
   - a free object-storage tier (Cloudflare R2 free 10 GB, Backblaze B2
     first 10 GB free) via `rclone`.
   - Keep 7 daily + 4 weekly. Test a restore quarterly.
3. **Register a frontend deploy key** so a rebuild doesn't need a laptop.
4. **Document the recovery runbook** (it's implicit in `deploy/README.md`
   today; make it a checklist with timings).

---

## 8. Monitoring assessment

| Have | Missing |
|---|---|
| container health + restart deltas (cron */5) | external uptime check (independent of the box) |
| disk 80/90 % thresholds | RAM / swap / load alerting |
| TLS 14-day expiry warning | Postgres metrics (once added): connections, slow queries, bloat, replication lag |
| `/health` for staging + www | an actual **alert channel** — `monitor.log` is not watched by anything |
| daily heartbeat | error tracking (no Sentry/GlitchTip) |
| | request/latency metrics (no access-log aggregation) |

**Cheapest meaningful upgrade:** a free external uptime monitor
(UptimeRobot free = 50 monitors / 5-min; BetterStack free tier) hitting
`https://www.pdfwandler.de/health` and (later) `https://www.digitalwerkk.de/api/chat/health`,
with email/Telegram alerts. **€0.** Add a `monitor.sh` line that emails on
failure (msmtp + the existing infra).

---

## 9. DigitalWerk capacity on the existing Hetzner server

**Can the CX23 safely support:**

| Need | On the existing CX23? | Condition |
|---|---|---|
| DigitalWerk **PostgreSQL** | **Yes, probably** | free RAM ≥ ~700 MB (measure first); firm `mem_limit: 512m`; dedicated DB user; in the backup set |
| Chat-agent **persistence** (leads/handoffs/sessions/summaries) | **Yes** | it's just rows in that Postgres — tiny |
| **Chat sessions** | **Yes** | same Postgres (`chat_sessions`); a separate Redis is **not** needed and is explicitly out of scope |
| **Lead / handoff storage** | **Yes** | same Postgres |
| **Background jobs / cron** | **Yes** | host `cron` already runs the monitor + backup; add the retention purge + handoff-retry as a `cron` line calling the app, or a tiny `ofelia`/`systemd timer`. (The chat agent's `vercel.json` cron only fires while the app is on Vercel — if the app moves, replace it with host cron.) |
| **Future Redis** (only if actually required) | **Yes, if RAM allows** | a 64–128 MB `redis:7-alpine` container. Not needed for anything currently planned. Decide only when a concrete need appears (e.g. cross-instance rate-limiting, session cache at high traffic). |
| **Future DigitalWerk backend services** | **Only after a resize** | the DigitalWerk Next.js app (~400–640 MB) does **not** fit alongside PDF Wandler + Postgres on 4 GB. **CX33 (8 GB, €8.49/mo)** or **CX43 (16 GB, €15.99/mo)** makes it comfortable. |

**Bottom line:** the existing box is **suitable for the DigitalWerk
database and chat-agent persistence** (pending a RAM measurement and a
backup fix). It is **not** currently suitable for also hosting the
DigitalWerk web app without a one-step resize.

---

## 10. PDF Wandler impact

Adding a DigitalWerk Postgres container to the CX23 affects PDF Wandler:

| Risk | Severity | Mitigation |
|---|---|---|
| RAM contention — a big PDF job spikes `api` toward 1.6 GB while Postgres holds 300–500 MB → host pressure / swap / OOM-kill | **Medium** | measure headroom first; `mem_limit: 384m` on Postgres; `oom_score_adj` so Postgres is killed before `api` is *not* what you want — actually protect Postgres and let a runaway `api` job be the one capped (it already is, at 1.6 GB). Add 2–4 GB more swap if needed. |
| CPU contention — 2 shared vCPUs; PDF processing is CPU-bound | **Low–Medium** | DigitalWerk DB load is trivial; a PDF job briefly slowing a chat reply is acceptable |
| Disk — Postgres data + WAL + nightly dumps on the same 40 GB | **Low** | tiny data; monitor `df`; dumps go **off-server** |
| Blast radius — one `docker compose` file, one host; a mistake on the DigitalWerk service could disrupt PDF Wandler | **Medium** | put DigitalWerk in its **own** compose project (`/opt/apps/digitalwerk/`, separate `compose.yml`, separate Docker network), not in the `pdfwandler` project. Only Caddy would be shared (or run a second Caddy). |
| Deploy coupling — recreating shared Caddy interrupts both | **Low** | already true for PDF Wandler staging/prod; schedule changes |
| Security surface — one more internet-adjacent service | **Low** | Postgres stays container-internal; not published |

**A resize to CX33 removes most of the RAM/CPU contention risk for
€3/mo.** If PDF Wandler is or becomes revenue-critical, that €3 is cheap
insurance and is the recommended path if DigitalWerk shares the box.

---

## 11. Vercel assessment

| Item | Finding |
|---|---|
| Plan | **Hobby** (team `team_EwwNdZIln6OXGj5AoHDoGyAs`) |
| Projects on it | `digitalwerk` (live, `www.digitalwerkk.de`), `pdfwandler-frontend2` (rollback only), `finalupdatedpdfwandler` |
| **Commercial-use rule** | Vercel Fair Use (last updated 2026-07-29): *"**Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan.**"* Commercial = *"any Deployment used for the purpose of financial gain of **anyone** involved in **any part of the production** … including a paid employee or consultant writing the code"*, explicitly including *"advertising the sale of a product or service"*. |
| **Does DigitalWerk violate it?** | **Yes, unambiguously.** `www.digitalwerkk.de` advertises services for sale and is built for payment. It is commercial by Vercel's own definition and is **on Hobby today**. Vercel can pause the account (they say they usually warn first). This exposure **predates the chat agent**. |
| Hobby usage limits (guideline) | 100 GB transfer, 4 CPU-hrs, 360 GB-hrs memory, **1M function invocations**/mo. The chat agent adds ~1 invocation per message — at 500 conversations × 6 msgs = 3k/mo, trivially within limits. The **binding constraint is the commercial-use clause, not the numbers.** |
| Pro | $20/user/mo base, then pay-as-you-go (Active CPU $0.128/hr, Memory $0.0106/GB-hr, Invocations $0.60/1M). For a low-traffic marketing site + chat agent, Pro's included credit likely covers usage → **~$20/mo effective**. |

**Options for the DigitalWerk app:**

- **Stay on Vercel → move to Pro.** Simplest; keeps preview deploys, edge
  CDN, zero ops. ~$20/mo. Removes the ToS exposure. A Vercel function →
  Hetzner Postgres still needs the networking answer in §5.4.
- **Move the app to the existing Hetzner box (like PDF Wandler).** Removes
  the Vercel bill and the ToS issue; Postgres becomes `localhost`. Needs a
  CX33 resize (RAM), a Dockerfile + compose service, host cron for the chat
  crons, and you lose Vercel's preview deploys / global CDN / image
  optimisation (Caddy + a CDN like Cloudflare free can replace most).
- **Hybrid:** app on Vercel Pro, Postgres on Hetzner over a tunnel. Most
  moving parts; hardest to operate. Not recommended.

**Recommendation:** **Pro now** (fast, removes the ToS risk), and treat a
Hetzner move as a *considered Phase-later project*, not an emergency — do
it when there's a reason beyond cost (data residency, killing the Vercel
bill, consolidating ops).

---

## 12. Recommended architecture

**Near term (next 1–2 phases), lowest risk, prefers existing infra where safe:**

```
                 ┌───────────────────────── Vercel (Pro) ─────────────────────────┐
   visitors ───▶ │  www.digitalwerkk.de   Next.js 16 (static) + chat-agent API    │
                 │  /api/chat/*  ── TLS ──▶ Hetzner Postgres                       │
                 │  /api/cron/*  (Vercel Cron: retention purge, handoff retry)     │
                 └───────────────────────────────┬───────────────────────────────┘
                                                 │  postgresql://…?sslmode=require
                                                 │  (or: move app to Hetzner → localhost)
   ┌───────────────────────── Hetzner CX23 → resize CX33 ──────────────────────────┐
   │  Hetzner Cloud Firewall (22 [your IP] / 80 / 443)                             │
   │  Caddy ─┬─ www.pdfwandler.de     → pdfwandler web-prod + api                  │
   │         └─ (later) www.digitalwerkk.de if the app moves here                  │
   │                                                                               │
   │  NEW: digitalwerk compose project (own network, own dir):                     │
   │    postgres:16-alpine  mem_limit 384–512m  volume pg_data  (internal only)    │
   │    cron: nightly pg_dump ──▶ OFF-SERVER (Storage Box BX11 €3.20/mo | R2 free) │
   │                                                                               │
   │  Hetzner Cloud Backups add-on (+~€1.10/mo) — weekly full-server snapshot      │
   └──────────────────────────────────────────────────────────────────────────────┘

   Resend (email)  ── handoff/lead notifications, when RESEND_API_KEY is set
   Anthropic       ── reply generation, when ANTHROPIC_API_KEY is set
```

- **Postgres: on the existing Hetzner box** (Option A), as its own compose
  project. Confirm RAM headroom first; add off-server `pg_dump`.
- **App: Vercel Pro** for now. Function → Hetzner Postgres over TLS with a
  strong per-app DB user; accept that Vercel egress IPs aren't pinnable
  (mitigate with TLS + creds + `pg_hba` + a non-obvious port). **If** this
  networking is judged unacceptable, the fallback is to move the app to
  Hetzner in the same phase (needs the CX33 resize).
- **No Neon. No Upstash. No new provider.**
- **Redis: not introduced.** Revisit only against a concrete need.
- **Cron:** keep the chat agent's `vercel.json` cron while the app is on
  Vercel; switch to host `cron` if/when it moves.

---

## 13. Alternative architectures

| # | Shape | Pros | Cons | When it's right |
|---|---|---|---|---|
| **A. Share the CX23** (recommended) | Postgres on the existing box; app on Vercel Pro | cheapest; one server; uses paid-for capacity; keeps Vercel DX | RAM headroom tight (measure); Vercel→Hetzner DB link over internet; blast radius shared with PDF Wandler | now — low volume, cost-sensitive |
| **B. Separate Hetzner CX22 for DigitalWerk** | new €5.49/mo box; Postgres + (optionally) the app | clean isolation from PDF Wandler; room to grow; still all-Hetzner | +€5.49/mo; second box to patch/monitor/back up; still need the app↔DB story unless the app also moves | if PDF Wandler is revenue-critical and you won't risk co-tenancy, or you're about to move the app too |
| **C. Move the Next.js app to Hetzner** (resize CX33) | app + Postgres co-located on `2.28.53.174` | Postgres never leaves localhost; **kills the Vercel bill and the ToS issue**; full control | lose Vercel preview deploys / global CDN / image opt (replace with Caddy + Cloudflare free); more ops; a bad deploy can hit PDF Wandler if Caddy is shared | when there's a real driver (cost, data residency, ops consolidation) — a deliberate project, not now |
| D. Managed Postgres (Neon/Supabase/Hetzner-managed-if-it-existed) + app on Vercel | zero DB ops; TLS-native from Vercel; PITR included | **contradicts the "use Hetzner first" directive**; recurring cost once past free tier; another sub-processor (GDPR); vendor lock-in on the DB | only if §A/§B/§C are all rejected for operational reasons |
| E. Everything stays as-is (in-memory store) | €0; nothing to do | **no durable leads** — every redeploy loses them; not viable for production | never, for launch |

---

## 14. External-service dependency matrix

For each: **why · Hetzner-replaceable? · external preferable? · free option · paid cost · when payment triggers · GDPR · lock-in · recommendation.**

### Hetzner (Cloud server + Firewall + optional Backups/Storage Box)
- **Why:** already the production host for PDF Wandler; the "prefer this" default.
- **Hetzner-replaceable:** it *is* Hetzner.
- **External preferable:** no, for compute/DB co-location.
- **Free option:** none (it's IaaS) — but capacity is already paid for.
- **Paid cost:** CX23 ~**€5.49/mo** (aggregator, Sept 2026 — confirm on invoice); CX33 **€8.49**, CX43 **€15.99**. Cloud Backups **+~20 %** (~€1.10 on CX23). Storage Box BX11 (1 TB) **€3.20/mo**, BX21 (5 TB) **€10.90/mo**. All ex VAT.
- **Payment trigger:** already paying. A **resize** triggers a higher line when DigitalWerk's app or DB needs more than the CX23's ~1 GB free RAM.
- **GDPR:** German company, EU data centres, standard DPA — the **best** position of any option here.
- **Lock-in:** low — plain Docker + Postgres, portable to any VPS.
- **Recommendation:** **primary infrastructure.** Add Cloud Backups now. Resize to CX33 if the app moves or a second heavy service lands.

### Vercel
- **Why:** current host of `www.digitalwerkk.de`; excellent Next.js DX, preview deploys, global CDN.
- **Hetzner-replaceable:** yes (Caddy + `next start` container + Cloudflare free CDN) — loses preview deploys and image optimisation.
- **External preferable:** yes *for developer velocity* while the team is small; no *for cost/control/ToS*.
- **Free option:** Hobby — **but non-commercial only; DigitalWerk violates this today.**
- **Paid cost:** Pro **$20/user/mo** + pay-as-you-go (Active CPU $0.128/hr, Provisioned Memory $0.0106/GB-hr, Invocations $0.60/1M, Fast Data Transfer regional). Low-traffic marketing site ≈ **$20/mo effective**.
- **Payment trigger:** **immediately** — commercial use requires Pro. This is the **first service that must be paid for**, and it's already overdue.
- **GDPR:** US company; EU data regions available; DPA + SCCs. An extra processor vs. self-hosting.
- **Lock-in:** medium — Next.js is portable, but ISR/Image/Cron/Edge Middleware behaviours and preview-deploy workflow are Vercel-shaped.
- **Recommendation:** **move to Pro now** to end the ToS exposure. Keep it unless/until a deliberate decision moves the app to Hetzner.

### Neon (serverless Postgres)
- **Why:** was chosen in PR #1's Phase 2 as the managed Postgres; TLS-native from Vercel; branching; scale-to-zero.
- **Hetzner-replaceable:** **yes** — a `postgres:16-alpine` container on the existing box does everything the chat agent needs.
- **External preferable:** only if the app stays on Vercel **and** the Vercel→Hetzner network link is judged unacceptable (§5.4). Neon's HTTP driver + native TLS make the Vercel path frictionless.
- **Free option:** yes — 0.5 GB storage, 100 compute-hours/project/month (permanent).
- **Paid cost:** Launch **~$0.106/CU-hr** compute, 10 GB storage included, +$0.35/GB-mo, **no monthly minimum** (the $5 floor was removed). Scale $69/mo.
- **Payment trigger:** exceeding 0.5 GB storage **or** 100 compute-hours/mo. For this workload, storage stays tiny; compute-hours depend on how aggressively it scales to zero. Realistically **free for a long time**, then a few $/mo.
- **GDPR:** owned by Databricks (US); EU (Frankfurt) region available; DPA. **Another sub-processor to name.**
- **Lock-in:** low-ish (it's Postgres) but branching/autoscaling/console workflows are Neon-shaped; the `SqlClient` seam keeps the code portable.
- **Recommendation:** **do NOT provision.** Use the Hetzner Postgres. Keep Neon as the *fallback* if §5.4 networking is rejected — the code already supports it via env var.

### Upstash (serverless Redis)
- **Why:** was mentioned as a possible session store.
- **Hetzner-replaceable:** **yes** — `redis:7-alpine` container.
- **External preferable:** no.
- **Free option:** 256 MB, 500k commands/mo (permanent); pay-as-you-go $0.20/100k commands, idle = $0.
- **Paid cost:** as above; fixed plans $10–1500/mo.
- **Payment trigger:** >500k commands/mo.
- **GDPR:** US company; EU region; DPA. Another sub-processor.
- **Lock-in:** low (Redis protocol) but the serverless REST API is Upstash-specific.
- **Recommendation:** **do NOT provision. Redis is not needed** for anything currently planned. If a real need appears, host it on Hetzner.

### Resend (transactional email)
- **Why:** handoff + lead notifications to the DigitalWerk team; the code's only notification adapter (safe no-op until keyed).
- **Hetzner-replaceable:** **partially** — you could run Postfix/`msmtp` on the box, but **deliverability** (SPF/DKIM/DMARC, IP reputation, not being blocklisted) is the hard part and is exactly what Resend provides. Self-hosted SMTP to real inboxes is a support burden.
- **External preferable:** **yes** — deliverability is a genuine technical reason.
- **Free option:** 3,000 emails/mo, 100/day (permanent, no card).
- **Paid cost:** Pro $20/mo (higher volume, more domains); pay-as-you-go overage since Dec 2025.
- **Payment trigger:** >3,000 emails/mo or >100/day. Team notifications will be **dozens/month** — free tier is ample for a long time.
- **GDPR:** US company (AWS eu-west-1 available); DPA. Sub-processor — **name it in the privacy notice** (already flagged in PR #1).
- **Lock-in:** low — swap for Postmark/SES/Brevo behind the existing `NotificationChannel` interface.
- **Recommendation:** **use Resend** (free tier), when the key is provided. Verify a `@digitalwerkk.de` sending domain. Only real cost driver later is if lead volume explodes.

### Anthropic (Claude API)
- **Why:** generates the chat replies; no substitute for a quality LLM.
- **Hetzner-replaceable:** **no** — self-hosting a comparable model needs GPUs the CX23 doesn't have and wouldn't match quality/cost. A small local model (llama.cpp on CPU) would be far worse and still slow.
- **External preferable:** **yes** — unavoidable.
- **Free option:** none for the API (there's a console trial credit only).
- **Paid cost:** **Claude Sonnet 5 $2 / $10 per million input/output tokens; Haiku 4.5 $1 / $5** (Sept 2026). Prompt caching −90 % on cached input; batch −50 %.
- **Estimate for this agent:** ~4k input + ~0.3k output per turn, ~5 turns/conversation → ~$0.05/conversation before caching. **500 conversations/mo ≈ $25; 2,000/mo ≈ $100.** Prompt-caching the static system prompt cuts input materially.
- **Payment trigger:** the **first real conversation** once a key is set — this is a **metered cost from message one**, unlike the others.
- **GDPR:** US company; EU inference options emerging; commercial terms + DPA; data not trained on by default for API. **Name it as a sub-processor + address the US transfer** (flagged in PR #1's privacy notes).
- **Lock-in:** medium — the `LlmProvider` interface keeps the code swappable (OpenAI/Mistral/local), but prompt tuning is model-specific.
- **Recommendation:** **use Anthropic** (it's the point). Turn on prompt caching. Consider Haiku 4.5 for the reply step if quality is acceptable (½ the cost). Set a **monthly spend cap** in the Anthropic console. This is the service to watch on cost.

### Cloudflare
- **Why:** optional — free DNS, DDoS protection, WAF, CDN cache, and (R2) free object storage for backups, in front of the Hetzner box.
- **Hetzner-replaceable:** DNS is currently on Vercel; Cloudflare would *replace Vercel DNS*, not Hetzner.
- **External preferable:** **yes** for DDoS/WAF in front of an unauthenticated, CPU-heavy PDF API on a 2-vCPU box — that's a real gap today.
- **Free option:** **generous** — unlimited DNS, DDoS mitigation, basic WAF, CDN, SSL, and **R2 free 10 GB storage + free egress** (good for `pg_dump` off-site).
- **Paid cost:** Pro $20/mo/domain (better WAF, image resizing) — not needed initially.
- **Payment trigger:** WAF beyond the free managed rules; R2 >10 GB; serving large media through the CDN proxy (ToS §2.8 — not relevant here).
- **GDPR:** US company; EU data localisation add-on (paid); DPA. Adds a processor for traffic metadata — weigh against the DDoS protection benefit.
- **Lock-in:** low for DNS/CDN; higher if you adopt Workers/Pages.
- **Recommendation:** **strongly consider** moving DNS to Cloudflare (free) for DDoS + WAF in front of the Hetzner box, and use **R2 free tier** as the off-server `pg_dump` target. No cost. Do it as its own small task, not blocking.

### Managed PostgreSQL (generic — RDS / Supabase / Crunchy / Hetzner-managed)
- Hetzner does **not** currently offer a managed Postgres product (as of this audit — ⬜ re-check). Options are AWS RDS, Supabase, Crunchy Bridge, DigitalOcean, Neon (above).
- **Hetzner-replaceable:** yes — self-managed `postgres` container.
- **Free option:** Supabase free (0.5 GB, pauses after 1 week idle); others none.
- **Paid cost:** RDS smallest ~$15–30/mo; Supabase Pro $25/mo; Crunchy ~$10/mo.
- **Recommendation:** **not now.** Self-host on Hetzner. Revisit a managed Postgres only if operating it (backups, upgrades, PITR) becomes a real burden — realistically only past meaningful scale.

### Managed Redis — see Upstash. **Not needed. Do not provision.**

### Vector database (Pinecone / Weaviate / pgvector / Qdrant)
- **Why:** *only if* the chat agent's retrieval outgrows the current lexical retriever (it currently does not — the knowledge base is ~93 entries and a dependency-free token scorer is sufficient).
- **Hetzner-replaceable:** **yes** — `pgvector` extension in the same Postgres, or a Qdrant container.
- **External preferable:** no, at this scale.
- **Free option:** pgvector (free, in Postgres); Qdrant self-host (free); Pinecone free tier (1 index).
- **Paid cost:** Pinecone ~$50/mo+; not relevant.
- **Recommendation:** **do not provision.** If retrieval ever needs embeddings, add **`pgvector` to the Hetzner Postgres** — zero new infra.

### CRM (HubSpot / Pipedrive / Attio / …)
- **Why:** *eventually* — to manage the leads the chat agent + contact form produce, beyond the admin JSON endpoint.
- **Hetzner-replaceable:** partially (self-host a CRM like Twenty/EspoCRM) — but a hosted CRM is usually the right call for a sales team.
- **External preferable:** yes, once there's a real sales pipeline.
- **Free option:** HubSpot free CRM (generous); Pipedrive trial only; Attio free tier.
- **Paid cost:** Pipedrive ~€15/user/mo; HubSpot paid tiers steep.
- **Payment trigger:** when the team needs pipeline stages / sequences / reporting beyond a list.
- **GDPR:** all US-based (HubSpot has EU hosting on paid); DPA + sub-processor.
- **Lock-in:** **high** — CRM migrations are painful.
- **Recommendation:** **not now.** The chat agent already writes a structured lead record + emails the team. Add a CRM when the sales process demands it; start with HubSpot free or self-hosted Twenty on Hetzner. The `NotificationChannel` interface can gain a `crm` adapter later.

### Slack
- **Why:** optional second handoff channel (team notification).
- **Hetzner-replaceable:** n/a (it's a comms tool).
- **External preferable:** yes if the team lives in Slack.
- **Free option:** Slack free (90-day history); incoming webhooks are free.
- **Paid cost:** Slack Pro ~€7/user/mo — not needed for a webhook.
- **Recommendation:** **not now.** Email (Resend) is the approved first channel. Add a Slack adapter behind `NotificationChannel` only if asked. **Do not provision.**

### WhatsApp providers (Twilio / Meta Cloud API / 360dialog / MessageBird)
- **Why:** DigitalWerk already offers WhatsApp contact; a future chat-agent channel.
- **Hetzner-replaceable:** no — WhatsApp Business API requires an approved BSP.
- **External preferable:** unavoidable.
- **Free option:** Meta Cloud API has a free service-conversation tier; per-conversation pricing after.
- **Paid cost:** Meta: per 24-h conversation, ~€0.03–0.09 (marketing/utility, DE); Twilio adds a platform fee (~$0.005/msg). BSP onboarding + a verified business.
- **Payment trigger:** first conversations past the free tier; BSP setup.
- **GDPR:** Meta (US/Ireland); heavyweight DPA; a significant sub-processor.
- **Lock-in:** medium (BSP-specific APIs; the WABA is portable).
- **Recommendation:** **out of scope for now.** MVP is web chat. Revisit as a dedicated project (spec 11 "later capabilities").

### Monitoring (UptimeRobot / BetterStack / Grafana Cloud / Sentry / GlitchTip)
- **Why:** the current cron-script monitor has no independent uptime check and no alert channel; once there's a DB, you want DB metrics + error tracking.
- **Hetzner-replaceable:** **partially** — self-host Uptime Kuma + a Grafana/Prometheus/Loki stack + GlitchTip (Sentry-compatible) on Hetzner. That's ~500 MB–1 GB RAM of monitoring, which the CX23 can't spare but a CX33 could.
- **External preferable:** for the **independent uptime check**, yes (must be off the monitored box). For metrics/errors, either works.
- **Free option:** UptimeRobot free (50 monitors, 5-min, email/Telegram alerts); BetterStack free tier; Sentry free (5k errors/mo); Grafana Cloud free tier; **Uptime Kuma / GlitchTip self-hosted = free**.
- **Paid cost:** BetterStack ~$25/mo; Sentry Team $26/mo; Grafana Cloud Pro ~$19/mo.
- **Payment trigger:** past the free monitor/error/metric limits — unlikely soon.
- **GDPR:** varies; an external uptime pinger sees only your public URLs (low sensitivity).
- **Recommendation:** **now, free:** UptimeRobot (or BetterStack free) on `www.pdfwandler.de/health` + email alert; add a `mail`-on-failure line to `healthcheck_monitor.sh`. **Later:** self-host Uptime Kuma + GlitchTip on the CX33 once resized, or Grafana Cloud free.

### Object storage (Hetzner Storage Box / Cloudflare R2 / Backblaze B2 / S3 / MinIO)
- **Why:** off-server destination for `pg_dump` backups; possibly future file storage (the chat agent stores none today).
- **Hetzner-replaceable:** self-host MinIO on the box — but that defeats the "off-server" purpose for backups.
- **External preferable:** **yes for backups** — must be a different failure domain.
- **Free option:** **Cloudflare R2 (10 GB storage + free egress)**, **Backblaze B2 (first 10 GB free)**.
- **Paid cost:** Hetzner **Storage Box BX11 1 TB €3.20/mo** (SFTP/BorgBackup, same provider ≠ same server), BX21 5 TB €10.90/mo; R2 $0.015/GB-mo past free; B2 $0.006/GB-mo.
- **Payment trigger:** backup set >10 GB (won't happen soon — DB dumps are MB) → then a few cents.
- **GDPR:** Hetzner Storage Box = EU, best position; R2/B2 = US company, EU regions.
- **Recommendation:** **Cloudflare R2 free tier** (or Backblaze B2) for `pg_dump` via `rclone` — **€0**. If you prefer everything under one invoice and want BorgBackup, **Hetzner Storage Box BX11 €3.20/mo**.

### Backup services (dedicated — SimpleBackups / SnapShooter / pgBackRest+cron)
- **Why:** managed, monitored, tested Postgres backups with PITR.
- **Hetzner-replaceable:** **yes** — `pg_dump`/`pgBackRest` + `rclone` + a cron line + a heartbeat check. That's the recommended MVP.
- **External preferable:** only at scale / when you need point-in-time recovery and don't want to operate pgBackRest.
- **Free option:** the DIY script approach is free.
- **Paid cost:** SnapShooter ~$5/mo; SimpleBackups ~$10/mo.
- **Recommendation:** **DIY** nightly `pg_dump` → R2/Storage Box + a dead-man's-switch (healthchecks.io free) for now. A managed backup service only if the DB becomes business-critical and PITR is required.

---

## 15. Cost scenarios

> All figures ex VAT. Hetzner CX prices are a **third-party aggregator
> (costgoat.com, Sept 2026)** — **confirm against the actual Hetzner
> invoice.** Everything else is from vendor pricing pages (Sept 2026).

### Scenario 1 — Minimum cost (use existing Hetzner wherever practical)

| Line | Monthly |
|---|---|
| Hetzner CX23 (existing, shared with PDF Wandler) | ~€5.49 *(already paid)* |
| Hetzner Cloud Backups add-on (+~20 %) | ~€1.10 |
| Off-server `pg_dump` → Cloudflare R2 free tier | €0 |
| PostgreSQL container (on the CX23) | €0 |
| DNS + DDoS/WAF → Cloudflare free | €0 |
| Uptime monitoring → UptimeRobot free | €0 |
| Vercel → **still required to move to Pro** (commercial use) | **$20** (~€18) |
| Resend | €0 (free tier) |
| Anthropic API | **metered** — ~€20–25 at ~500 conversations/mo |
| **Infra subtotal** | **~€1.10 new + ~€18 Vercel Pro** |
| **External API** | **~€20–25 Anthropic** (+ €0 Resend) |
| **Total** | **~€40/mo**, of which ~€1 is *new infrastructure* |

- **First service to require payment:** **Vercel Pro** — *already* required
  (commercial-use ToS), triggered the moment `www.digitalwerkk.de` went
  live as a business site. Independent of the chat agent.
- **What triggers it:** the site advertising services for sale + being
  built for payment.
- **Next likely paid service:** **Anthropic API** — metered from the first
  real conversation once a key is added.
- **Scaling trigger:** CX23 free RAM < ~700 MB (measured) → resize to CX33
  (+~€3/mo); or lead-email volume > 3,000/mo → Resend Pro.

### Scenario 2 — Recommended production (reliability / security / cost balance)

| Line | Monthly |
|---|---|
| Hetzner **CX33** (4 vCPU / 8 GB) — resize for real headroom | ~€8.49 |
| Hetzner Cloud Backups add-on | ~€1.70 |
| Hetzner **Storage Box BX11** (1 TB, BorgBackup, EU) for `pg_dump` + Caddy state | €3.20 |
| PostgreSQL container (pgvector-ready) | €0 |
| Cloudflare free (DNS + DDoS + WAF managed rules) | €0 |
| UptimeRobot free + `mail`-on-failure | €0 |
| Vercel **Pro** (app stays on Vercel; ~$20 effective at low traffic) | ~€18 |
| Resend (free tier; verified domain) | €0 |
| Anthropic API (prompt caching on; ~1,000 conversations/mo) | ~€40–50 |
| Sentry-compatible error tracking → **self-hosted GlitchTip on the CX33** | €0 |
| **Infra subtotal** | **~€13.4/mo new** (CX33 delta + Backups + Storage Box) |
| **External API** | **~€40–50 Anthropic**, €0 Resend |
| **Vercel** | ~€18 |
| **Total** | **~€70–80/mo** |

- **First service to require payment:** Vercel Pro (as above) — then the
  CX33 resize and the Storage Box.
- **What triggers the CX33:** adding Postgres + wanting comfortable
  headroom, or the DigitalWerk app moving to Hetzner.
- **Next likely paid service:** Anthropic scaling with conversation volume;
  then Resend Pro if lead emails exceed the free tier.
- **Scaling trigger:** sustained CX33 CPU > ~70 % or RAM pressure → CX43
  (16 GB, ~€16/mo) or split DigitalWerk onto its own box.

### Scenario 3 — Growth (DigitalWerk significantly larger)

| Line | Monthly (indicative) |
|---|---|
| Hetzner **CX43 or CPX32** dedicated to DigitalWerk (app + Postgres + Redis) | ~€16–35 |
| PDF Wandler stays on its own CX23/CX33 | ~€5.5–8.5 |
| Managed Postgres **or** a Hetzner Postgres with a hot standby (second box + streaming replication) | +€8–30 |
| Redis container (rate-limiting, session cache, queues) | €0 (self-host) |
| Cloudflare **Pro** (image resizing, better WAF, analytics) — per domain | ~€18 |
| Off-server backups (Storage Box BX21 5 TB) + PITR (pgBackRest) | ~€11 |
| Monitoring: Grafana Cloud free → paid, or self-hosted Prometheus/Loki/Grafana on a small box | €0–19 |
| Vercel Pro (if still hybrid) **or** €0 (fully on Hetzner) | €0–18+ |
| Resend Pro (lead + marketing volume) | ~€18–80 |
| Anthropic API (5,000–20,000 conversations/mo) | ~€250–1,000 |
| CRM (HubSpot paid / Pipedrive, per seat) | ~€15–50/seat |
| **Total** | **~€350–1,300/mo**, dominated by the **Anthropic API** and the **CRM/email** as usage grows |

- **First service to require payment:** already Vercel Pro; in growth the
  **Anthropic bill becomes the dominant line** and the first to need active
  cost management (caching, Haiku for cheap steps, per-session token caps —
  all already in the code).
- **Scaling trigger:** Anthropic > ~€200/mo → evaluate Haiku-only for
  replies, tighter caching, or a cheaper model for classification;
  DigitalWerk traffic saturating a shared box → dedicated CX43+; sales team
  growth → CRM.

---

## 16. Future scaling triggers (summary)

| Trigger | Action |
|---|---|
| CX23 measured free RAM < ~700 MB | resize CX23 → CX33 (€8.49) before adding Postgres |
| DigitalWerk app moves off Vercel | resize to CX33 minimum; add app container + host cron; add Cloudflare CDN |
| Postgres data > a few GB **or** slow queries | tune Postgres; consider a dedicated DB box / managed Postgres |
| PDF Wandler + DigitalWerk contending for 2 vCPUs (load > ~1.7 sustained) | split onto separate boxes (Scenario 3) |
| Lead emails > 3,000/mo or > 100/day | Resend Pro ($20) |
| Anthropic API > ~€100/mo | prompt-cache audit; Haiku for reply step; per-session caps; spend alert |
| Chat conversations need cross-instance state (rate limiting at scale, shared cache) | add a Redis container on Hetzner |
| Retrieval quality needs embeddings | add `pgvector` to the Hetzner Postgres (no new infra) |
| Sales team needs a pipeline | CRM (HubSpot free → paid) |
| Single-server risk unacceptable for revenue | Postgres hot standby (second Hetzner box) + Cloud Backups + off-site dumps |

---

## 17. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Vercel pauses the account** for Hobby commercial-use violation | Medium | High — `www.digitalwerkk.de` **and** the PDF Wandler rollback project go down | Move to Vercel Pro now |
| R2 | **CX23 disk/host failure** with a DigitalWerk DB on it | Low-Medium | **Critical** — permanent loss of all leads since last backup | Cloud Backups add-on + nightly off-server `pg_dump` **before** the DB holds real data |
| R3 | RAM exhaustion — Postgres + a big PDF job OOM-kills a container | Medium (on CX23) / Low (on CX33) | High — PDF Wandler or the DB restarts mid-request | Measure first; firm `mem_limit`; resize to CX33; +swap |
| R4 | Vercel-function → public Hetzner Postgres — creds/port exposed, no tight IP allow-list | Medium | High — DB compromise, PII breach | Co-locate the app (no public DB), or tunnel; strong per-app user; `sslmode=require`; non-default port; `pg_hba` |
| R5 | **No alerting** — `monitor.log` failures are silent; a cert expiry or a down service goes unnoticed | Medium | Medium-High | UptimeRobot free + `mail`-on-failure in the monitor script |
| R6 | **Unauthenticated, CPU-heavy PDF API** with no rate limit on a 2-vCPU box | Medium | Medium — cheap DoS | Cloudflare free WAF/rate-limit in front; Caddy `rate_limit`; auth or a token for the API |
| R7 | Blast radius — DigitalWerk and PDF Wandler share one host / one Caddy | Medium | Medium | separate compose project + Docker network; consider a separate box (Option B) if PDF Wandler is revenue-critical |
| R8 | Frontend has **no deploy key** — a rebuild needs a laptop with the repo | Low | Medium — slower recovery | register a read-only deploy key on `pdfwandler-frontend2` |
| R9 | Anthropic bill runs away (bug, abuse, traffic spike) | Low-Medium | Medium | per-session message cap (already in code); Anthropic console spend limit; alert |
| R10 | Pricing assumptions wrong (Hetzner prices are third-party-sourced) | Medium | Low | confirm against the Hetzner invoice before committing to a scenario |
| R11 | Docker daemon runs as root — container escape ⇒ host root | Low | High | acceptable single-tenant; keep images pinned + updated; consider rootless later |
| R12 | `finalupdatedpdfwandler` Vercel project — unknown purpose, possible dead deploy under a different GitHub owner | Low | Low | identify and archive/delete if dead |

---

## 18. Required decisions

**For the owner (Shahid):**

1. **Vercel Pro — yes/now?** (Removes the ToS exposure. ~$20/mo. Independent of everything else.)
2. **Where does the DigitalWerk Postgres live:** A (share CX23), B (new CX22), or C (move the whole app to Hetzner)? — *audit recommends **A**, after a RAM measurement, with a resize to CX33 if it's tight.*
3. **If A/B: is a Vercel-function → Hetzner-Postgres link over TLS acceptable**, or must the app be co-located (→ C)?
4. **Resize the CX23 → CX33** (€8.49) as part of adding the DB? — *recommended if A.*
5. **Enable Hetzner Cloud Backups** on the server now (~€1.10/mo)? — *recommended regardless.*
6. **Off-server `pg_dump` target:** Cloudflare R2 free tier, or Hetzner Storage Box BX11 (€3.20/mo)?
7. **Move DNS to Cloudflare** (free) for DDoS/WAF in front of Hetzner? — *recommended, non-blocking.*
8. **Grant a read-only SSH audit** (or run §"commands for the owner" below) so the live figures in §2/§4/§6/§7 can be filled in and this document finalised.

**Commands for the owner (read-only, paste output back):**

```bash
ssh deploy@2.28.53.174 '
  echo "== host =="; cat /etc/os-release | grep PRETTY; uname -r; uptime
  echo "== cpu =="; nproc; lscpu | grep -E "Model name|MHz" | head -2
  echo "== mem =="; free -m; swapon --show
  echo "== disk =="; df -h /; echo; docker system df
  echo "== docker =="; docker --version; docker compose version
  echo "== containers =="; docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
  echo "== container stats =="; docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}"
  echo "== listening ports =="; sudo ss -tlnp | grep -vE "127.0.0.1|::1"
  echo "== ssh config =="; sudo grep -E "^(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)" /etc/ssh/sshd_config /etc/ssh/sshd_config.d/*.conf 2>/dev/null
  echo "== fail2ban =="; systemctl is-active fail2ban 2>/dev/null || echo "not installed"
  echo "== unattended-upgrades =="; systemctl is-active unattended-upgrades 2>/dev/null || echo "not active"
  echo "== cron =="; crontab -l 2>/dev/null; sudo ls -la /etc/cron.d/ 2>/dev/null
  echo "== backups dir =="; ls -la /opt/apps/pdfwandler/backups/ 2>/dev/null | tail -8; du -sh /opt/apps/pdfwandler/backups 2>/dev/null
  echo "== monitor log tail =="; tail -5 /opt/apps/pdfwandler/monitor.log 2>/dev/null
'
```
Also, in the **Hetzner Cloud console**: confirm the server type/plan, the
region, whether the **Backups** feature is enabled, the **Cloud Firewall**
rules (especially the source restriction on port 22), and whether a
**Storage Box** or **Volume** is attached.

---

## 19. Things we should NOT provision

- ❌ **Neon** — a Hetzner `postgres` container covers every current need. (Keep the code's Neon compatibility as a fallback only.)
- ❌ **Upstash / any Redis** — nothing planned needs it.
- ❌ **Managed PostgreSQL** (RDS / Supabase / Crunchy) — self-host on Hetzner.
- ❌ **A vector database** — use `pgvector` in the Hetzner Postgres if/when needed.
- ❌ **A second Vercel project** or a Vercel plan add-on beyond Pro.
- ❌ **A new Hetzner server** — unless decision #2 is Option B/C.
- ❌ **Slack / CRM / WhatsApp integrations** — out of scope for this phase.
- ❌ **Paid monitoring / paid backup SaaS** — free tiers + self-hosting suffice at this size.
- ❌ **Cloudflare Pro / any paid Cloudflare** — the free plan is enough.
- ❌ **Docker infrastructure changes on the Hetzner box** — the existing stack is well-built; only *add* an isolated DigitalWerk compose project.

---

## 20. Recommended next phase

**Phase 3 — "Persistence on existing infrastructure" (no new provider):**

1. **Owner:** run §18 commands; decide #1–#7.
2. **Owner:** move the Vercel team to **Pro** (fixes R1).
3. **Owner:** enable **Hetzner Cloud Backups** on the CX23 (fixes half of R2).
4. If free RAM is tight → **owner resizes CX23 → CX33** (one click, ~1 min downtime).
5. **Claude (with SSH granted, or owner-run):** create
   `/opt/apps/digitalwerk/` — a **separate** compose project on its own
   Docker network with a single `postgres:16-alpine` service
   (`mem_limit: 384m`, named volume, internal-only). Apply the chat-agent
   schema (`schema.sql`).
6. **Claude:** add a small env-config seam to `createPgClient` so `prepare`
   and `max` are env-overridable (the only code change — ~5 lines).
7. **Claude:** nightly `pg_dump | gzip | rclone` → R2/Storage Box + a
   healthchecks.io dead-man's-switch. Weekly restore test documented.
8. **Owner:** set `CHAT_AGENT_DATABASE_URL` in Vercel (Production) →
   `GET /api/chat/health` shows `persistence: postgres`. Run the
   integration smoke test that PR #1's TESTING.md flagged as pending.
9. **Owner:** provide `RESEND_API_KEY` + verified domain, and
   `ANTHROPIC_API_KEY` (with a console spend cap) — then Phase 2's blocked
   items complete and PR #1 can be considered for merge.
10. **Later / separate task:** move DNS to Cloudflare (free) for DDoS/WAF;
    add UptimeRobot; register the frontend deploy key.

**Do not** merge PR #1, provision anything, or touch Hetzner/production
until the owner has made decisions #1–#7.
