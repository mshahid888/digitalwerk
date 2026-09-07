# Chat Agent — Operations & Incident Runbook

For an engineer operating the deployed system. Architecture: `ARCHITECTURE.md`.
Deploy steps: `deploy/digitalwerk/README.md`. Env vars: `ENVIRONMENT.md`.

```
visitor → chat widget (Vercel, www.digitalwerkk.de)
        → /api/chat/*  (Vercel route; proxies when AGENT_API_URL is set)
        → https://agent.digitalwerkk.de   (host Caddy on Hetzner 2.28.53.174)
        → digitalwerk-agent-api-1:8080    (Hono, tsx, restart: unless-stopped)
        → digitalwerk-postgres-1:5432     (private internal Docker network)
        → OmniRoute / OpenAI-compatible gateway   (outbound; mock until keyed)
        → Resend   (outbound; disabled until keyed)
```

Everything DigitalWerk-agent lives in the isolated compose project
`digitalwerk` under `/opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk/`.
`ssh deploy@2.28.53.174` (key-only, passwordless `sudo`).

---

## 1. Is it healthy? (30-second check)

```bash
# public, end to end
curl -s https://agent.digitalwerkk.de/api/chat/health | jq '{status,database,llm:.llm.provider,notifications:.notifications.configured}'
#   expected: {"status":"ok","database":"ok","llm":"mock|omniroute","notifications":"unconfigured|configured"}
#   status:"degraded" → HTTP 503; see §3/§4

# on the box
ssh deploy@2.28.53.174
sudo docker compose -f /opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk/compose.yml ps   # both "healthy"
systemctl --failed | grep digitalwerk        # nothing = good
cat /opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk/backups/.last-run   # "OK <ts> <file>"
```

PDF Wandler cross-check (must stay green — see §8):
`curl -s -o /dev/null -w '%{http_code}\n' https://www.pdfwandler.de/health`

---

## 2. Agent API down / unhealthy

Symptom: `curl …/api/chat/health` → 502 (Caddy can't reach it) or the
container is not `healthy`.

```bash
cd /opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk
sudo docker compose ps
sudo docker logs --tail 50 digitalwerk-agent-api-1
sudo docker compose up -d --no-build      # recreates a crashed/missing container
```

- A real process crash auto-restarts (`restart: unless-stopped`, ~4 s). A
  container killed with `docker kill`/`docker stop` does **not** auto-restart
  (by design) — `docker compose up -d` brings it back.
- `502` through Caddy but the container is `healthy`: Caddy lost the
  `pdfwandler_edge` route. `sudo docker exec pdfwandler-caddy-1 wget -qO-
  http://digitalwerk-agent-api-1:8080/` — if that fails, the agent-api
  container is not on `pdfwandler_edge`; `sudo docker compose up -d` re-adds
  it (it is `external: true` in compose.yml).
- OOM (`sudo docker inspect digitalwerk-agent-api-1 --format '{{.State.OOMKilled}}'`
  = true): raise `mem_limit` in `compose.yml` (currently 256m; idle RSS ~65m).

### Rollback to a previous image

```bash
sudo docker images digitalwerk-agent-api          # pick a prior <sha> tag
cd /opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk
sed -i 's/^AGENT_IMAGE_TAG=.*/AGENT_IMAGE_TAG=<prev-sha>/' .env
sudo docker compose up -d --no-build agent-api
```

Keep the last 2–3 image tags; `sudo docker rmi digitalwerk-agent-api:<old>`
prunes the rest (never the running tag).

---

## 3. PostgreSQL down / `database:"unavailable"`

`/api/chat/health` shows `status:"degraded"`, `database:"unavailable"`, and
`POST /api/chat/session|message` returns 500 (the agent has no memory
fallback once running).

```bash
sudo docker compose ps postgres
sudo docker logs --tail 50 digitalwerk-postgres-1
sudo docker compose up -d postgres        # data is on the digitalwerk_pgdata volume — safe
```

- Volume intact but won't start: `sudo docker volume inspect digitalwerk_pgdata`.
- Corruption / need to recover: restore the newest dump — see §6.
- **Never publish 5432.** It stays on the `internal: true` network. Verify:
  `sudo ss -tlpn | grep 5432` → nothing.

---

## 4. Caddy / HTTPS / certificate

The agent vhost is one block appended to the **pdfwandler** Caddyfile
(`/opt/apps/pdfwandler/pdfwandler-backend2/deploy/Caddyfile`, +31 lines).
Caddy auto-renews the Let's Encrypt cert (~60 days before expiry) into the
`caddy_data` volume.

```bash
echo | openssl s_client -servername agent.digitalwerkk.de -connect agent.digitalwerkk.de:443 2>/dev/null | openssl x509 -noout -enddate
sudo docker logs --tail 30 pdfwandler-caddy-1 | grep -i "agent.digitalwerkk\|certificate\|acme"
sudo docker exec pdfwandler-caddy-1 caddy validate --config /etc/caddy/Caddyfile
sudo docker exec pdfwandler-caddy-1 caddy reload --config /etc/caddy/Caddyfile
```

- Cert won't issue: check `agent.digitalwerkk.de` still resolves to
  `2.28.53.174` (IONOS DNS) and port 80 is reachable.
- Appended vhost not taking effect after an edit: the Caddyfile is a
  single-file bind mount — a changed inode isn't seen by the running
  container. `cd /opt/apps/pdfwandler/pdfwandler-backend2/deploy && sudo
  docker compose up -d --force-recreate --no-deps caddy` (certs persist,
  ~2 s; PDF Wandler blips once).
- Re-apply the vhost from scratch: `deploy/digitalwerk/apply-caddy-vhost.sh`
  (idempotent, timestamped backup, auto-rollback). Backups are in
  `/opt/apps/digitalwerk/caddyfile-backups/`.

---

## 5. Chat replies are unhelpful / generic

`/api/chat/health` → `llm.provider`:

- `"mock"` — no real model. Expected until an OmniRoute key is set. Replies
  are the deterministic composed answers (still grounded, just not
  rephrased). Set `LLM_PROVIDER` / `LLM_BASE_URL` / `LLM_API_KEY` /
  `LLM_MODEL` in `.env`, `sudo docker compose up -d agent-api`. See
  `PROVIDER-SETUP.md`.
- `"omniroute"` but replies still look deterministic: the gateway is
  erroring and the orchestrator is falling back. `sudo docker logs
  digitalwerk-agent-api-1 | grep -i "llm\|omniroute\|LlmProviderUnavailable"`.
  Check `llm.live` in `/health` and the gateway's own status.

The system prompt and knowledge base carry **no secrets and no prices**
(prices are data, retrieved per turn). `checkOutput()` replaces any reply
that leaks a key shape, an env-var name, a `postgres://` string or the
system prompt.

---

## 6. Backups & restore

Nightly `digitalwerk-backup.timer` (04:15 UTC) → `backup.sh` →
`pg_dump | gzip` into `deploy/digitalwerk/backups/` (7 daily + 4 weekly),
verified with `gzip -t`. Status: `backups/.last-run` (`OK|WARN|FAIL`).

- `.last-run` = `FAIL` or `systemctl --failed` lists the service:
  `sudo journalctl -u digitalwerk-backup.service -n 30`. A failed **dump**
  exits non-zero; a good dump with a failed rotation/off-server copy is a
  `WARN` (the backup exists).
- **Restore test** (do quarterly; non-destructive — throwaway DB):
  ```bash
  cd /opt/apps/digitalwerk/digitalwerk/deploy/digitalwerk
  ./restore.sh "backups/$(ls -1t backups/digitalwerk-*.sql.gz | head -1 | xargs basename)"
  ```
- **Real recovery** (overwrites the live DB, prompts, 5 s to abort):
  `./restore.sh backups/<dump>.sql.gz --into-prod`
- **Off-server copy is not configured** — local-only backups do not survive
  a disk/host loss. Free options (no card): `BACKUP_RCLONE_REMOTE` →
  Cloudflare R2 / Backblaze B2; `BACKUP_HEALTHCHECK_URL` → healthchecks.io.
  See `deploy/digitalwerk/README.md`.

---

## 7. Retention / purge not running

`digitalwerk-maintenance.timer` (03:30 UTC) → `maintenance.sh` calls
`POST /api/cron/purge-transcripts` **inside** the container (works without
the public host). Also wired as a Vercel Cron in `vercel.json` (fires only
on a production deployment).

```bash
sudo systemctl start digitalwerk-maintenance.service
sudo journalctl -u digitalwerk-maintenance.service -n 10   # expect {"ok":true,"purge":{...}}
```

Manual purge: `POST /api/chat/admin/purge` with
`Authorization: Bearer <CHAT_AGENT_ADMIN_TOKEN>`. Purge is idempotent — it
nulls transcripts older than `CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS` (default
+ hard cap 30) and deletes old events; the lead record is kept.

---

## 8. PDF Wandler coexistence — what is shared, what NOT to touch

Shared, and the **only** contact points:

| Shared resource | DigitalWerk's use |
|---|---|
| host Caddy (`pdfwandler-caddy-1`) | one appended vhost `agent.digitalwerkk.de` (+31 lines in its Caddyfile) |
| `pdfwandler_edge` Docker network | `digitalwerk-agent-api-1` joins it (`external: true`) so Caddy can reach it |
| the box (CPU/RAM/disk) | `mem_limit` 256m + 384m; measured idle ~105 MB total |

Do **not**: touch PDF Wandler containers, images (`pdfwandler-*`), volumes,
its compose project, or the non-agent parts of its Caddyfile. After any
Caddy or network change, verify **all** of:
`https://www.pdfwandler.de/health`, `https://staging.pdfwandler.de/health`,
`https://pdfwandler.de/` (301) → all `200`/`301`.

`digitalwerk-postgres-1` is on a **separate** `internal: true` network and
its own `digitalwerk_pgdata` volume — no overlap with PDF Wandler.

---

## 9. Where the data is / GDPR requests

- Sessions + raw transcript: `chat_sessions` (transcript nulled after ≤30 d).
- Permanent lead record: `chat_leads` (contact fields + a summary that
  includes a short verbatim excerpt).
- Handoffs: `chat_handoffs`. Analytics events: `chat_events` (≤30 d).
- Access / deletion request for one visitor: they have no login, so match on
  `email` in `chat_leads` / `chat_handoffs.lead_facts`, and `session_id`.
  `GET /api/chat/admin/leads` (bearer token) lists leads.
- Admin endpoints return **503 when `CHAT_AGENT_ADMIN_TOKEN` is unset**
  (they expose lead PII) — set it to enable them.

---

## 10. Known blockers (not operational — need the owner)

OmniRoute API key · Resend key + verified domain · off-server backup target
· Vercel plan (Hobby prohibits commercial use) · legal sign-off on the
privacy section · PR #1 merge. See `PHASE-4-REPORT.md`.
