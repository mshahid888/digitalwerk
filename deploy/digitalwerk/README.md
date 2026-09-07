# DigitalWerk — Hetzner deploy stack

Isolated single-host stack on the **existing** Hetzner CX23 (`2.28.53.174`,
Nuremberg), alongside — and **without touching** — the PDF Wandler stack.

```
Vercel (www.digitalwerkk.de, Next.js)
  └─ /api/chat/*  ──HTTPS──▶  the host Caddy  ──▶  digitalwerk-agent-api-1 :8080
                                                        │  (X-Agent-Auth shared secret)
                                                        ├─▶ digitalwerk-postgres-1 :5432   (internal-only network)
                                                        └─▶ OmniRoute / OpenAI-compatible gateway (outbound HTTPS)
```

- **Postgres is never published** and its network (`digitalwerk_internal`)
  has `internal: true` — it cannot even reach the internet.
- **agent-api** is only reachable from Caddy and never from the browser. It
  attaches to the pre-existing `pdfwandler_edge` network (declared
  `external: true`) so the shared host Caddy can resolve
  `digitalwerk-agent-api-1:8080` by name with no manual `docker network
  connect` — this survives a Caddy container recreate. The browser only
  ever calls the Vercel same-origin `/api/chat/*`, which proxies here.
- Separate compose project (`digitalwerk`), own internal network, own
  volume. The shared resources are the host Caddy and its `pdfwandler_edge`
  bridge — nothing else touches the pdfwandler stack.

## Layout on the server

```
/opt/apps/digitalwerk/
  digitalwerk/                 <- git clone of mshahid888/digitalwerk (branch: feat/chat-agent-foundation until merged)
    deploy/digitalwerk/
      compose.yml  .env (mode 600, gitignored)  backup.sh  restore.sh  systemd/
  backups/                     <- also created by backup.sh inside deploy/digitalwerk/backups/
```

## First deploy

```bash
sudo mkdir -p /opt/apps/digitalwerk && sudo chown deploy:deploy /opt/apps/digitalwerk
cd /opt/apps/digitalwerk
git clone https://github.com/mshahid888/digitalwerk.git
cd digitalwerk/deploy/digitalwerk
cp .env.example .env && chmod 600 .env
# fill .env — at minimum:
#   POSTGRES_PASSWORD   (openssl rand -base64 32)
#   AGENT_API_SECRET    (openssl rand -hex 32)   -- also set on Vercel as AGENT_API_SECRET
#   CHAT_AGENT_ADMIN_TOKEN, CRON_SECRET
#   LLM_* stay "mock" until OmniRoute creds exist (agent still fully works on the mock provider)

SHA=$(git -C /opt/apps/digitalwerk/digitalwerk rev-parse --short HEAD)
sudo docker build -f /opt/apps/digitalwerk/digitalwerk/server/Dockerfile \
  -t digitalwerk-agent-api:$SHA /opt/apps/digitalwerk/digitalwerk
sed -i "s/^AGENT_IMAGE_TAG=.*/AGENT_IMAGE_TAG=$SHA/" .env

sudo docker compose up -d --no-build

# The schema self-applies on the first request (CREATE TABLE IF NOT EXISTS —
# idempotent). To apply it explicitly, pipe it into psql *inside* the
# container so the password stays in the container's own environment and
# never lands on the host command line / sudo log:
sudo docker exec -i digitalwerk-postgres-1 sh -c \
  'PGPASSWORD="$POSTGRES_PASSWORD" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
  < ../../lib/chat-agent/persistence/postgres/schema.sql

# verify internally (no public route needed yet):
sudo docker exec digitalwerk-agent-api-1 wget -qO- http://127.0.0.1:8080/api/chat/health
```

## Wire the host Caddy (one added site block — the only PDF Wandler change)

`agent.digitalwerkk.de` must resolve to `2.28.53.174`. The `digitalwerkk.de`
zone is hosted at **IONOS** (authoritative NS `ns10xx.ui-dns.{org,com,de,biz}`;
the Vercel A/CNAME records for the apex + `www` live inside that IONOS zone),
so the record is added in the **IONOS DNS panel**, not Vercel:

```
Type  A
Host  agent
Value 2.28.53.174
TTL   3600
```
Then run the helper — it appends `deploy/digitalwerk/caddy-vhost.conf` to the
pdfwandler Caddyfile (timestamped backup), `caddy validate`s, hot-reloads,
and auto-rolls-back on failure:

```bash
deploy/digitalwerk/apply-caddy-vhost.sh
```

No `docker network connect` is needed: the agent-api container joins
`pdfwandler_edge` itself (`external: true` in compose.yml), so Caddy can
reach `digitalwerk-agent-api-1:8080` by name and it survives a Caddy
recreate.

> **Single-file bind-mount gotcha.** The pdfwandler Caddyfile is bind-mounted
> as a *file*. If the host file's inode changes after the Caddy container
> started (an editor writing via rename, etc.), the container keeps serving
> the *old* content and `caddy reload` reads that stale copy. If the appended
> vhost doesn't show up in `caddy adapt`, recreate just Caddy once to
> re-resolve the mount (certs persist in the `caddy_data` volume, ~2 s):
> `cd /opt/apps/pdfwandler/pdfwandler-backend2/deploy && sudo docker compose up -d --force-recreate --no-deps caddy`

(Reversible: revert the Caddyfile block + `apply-caddy-vhost.sh`'s backup,
`caddy reload`.)

Verify end to end: `deploy/digitalwerk/verify-https-endpoint.sh`.

Then on **Vercel** set `AGENT_API_URL=https://agent.digitalwerkk.de` and
`AGENT_API_SECRET=<same value>` — the Next `/api/chat/*` routes start
proxying here. Until then they run the agent in-process on Vercel (which is
the current behaviour and needs `CHAT_AGENT_DATABASE_URL` if you want
persistence there).

## Backups

`backup.sh` (systemd `digitalwerk-backup.timer`, 04:15 UTC): nightly
`pg_dump | gzip`, 7 daily + 4 weekly, into `deploy/digitalwerk/backups/`.

**Local-only is NOT disaster recovery.** Before real lead data:

1. Enable **Hetzner Cloud Backups** on the CX23 (Console → Servers → Backups;
   ~+20% of the server price, ~€1/mo). One click.
2. Set `BACKUP_RCLONE_REMOTE` in `.env` to an off-server target —
   Cloudflare R2 (10 GB free + free egress) or Backblaze B2 (first 10 GB
   free) via `rclone config`, or a Hetzner Storage Box BX11 (€3.20/mo).
3. Set `BACKUP_HEALTHCHECK_URL` (healthchecks.io free) so a silently failing
   backup is noticed.
4. Run `./restore.sh backups/<newest>.sql.gz` — restores into a throwaway
   DB and prints row counts. Do this quarterly.

Install the timers:

```bash
chmod +x backup.sh restore.sh maintenance.sh
sudo cp systemd/digitalwerk-*.{service,timer} /etc/systemd/system/
# edit the ExecStart paths in the .service files if the checkout path differs
sudo systemctl daemon-reload
sudo systemctl enable --now digitalwerk-backup.timer digitalwerk-maintenance.timer
```

`maintenance.sh` calls the retention/handoff-retry cron endpoint **inside**
the container over loopback, so it works before `agent.digitalwerkk.de` DNS
exists. `backup.sh` and `maintenance.sh` use passwordless `sudo docker` (the
`deploy` user already has it).

## Deploy an update

```bash
cd /opt/apps/digitalwerk/digitalwerk && git pull
SHA=$(git rev-parse --short HEAD)
sudo docker build -f server/Dockerfile -t digitalwerk-agent-api:$SHA .
cd deploy/digitalwerk
sed -i "s/^AGENT_IMAGE_TAG=.*/AGENT_IMAGE_TAG=$SHA/" .env
sudo docker compose up -d --no-build agent-api
sudo docker exec digitalwerk-agent-api-1 wget -qO- http://127.0.0.1:8080/api/chat/health
```

Rollback: set `AGENT_IMAGE_TAG` back to a previous SHA (keep old images) and
`docker compose up -d --no-build agent-api`.

## Resource footprint (measured baseline on this box)

`mem_limit`: postgres 384m, agent-api 256m. Actual idle RSS is far lower
(postgres ~30–60 MB, a tsx/Node process ~60–90 MB). The CX23 measured
~2.7 GB RAM available before this stack — comfortable headroom, PDF Wandler
unaffected. Watch `docker stats` after go-live.
