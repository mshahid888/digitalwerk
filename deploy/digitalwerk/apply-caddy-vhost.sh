#!/usr/bin/env bash
# Add the agent.digitalwerkk.de vhost to the shared pdfwandler Caddy — once,
# idempotently, with a hot reload (no restart; PDF Wandler is untouched).
#
#   - backs up the Caddyfile
#   - appends deploy/digitalwerk/caddy-vhost.conf if not already present
#   - `caddy validate` then `caddy reload` inside the running container
#   - rolls the Caddyfile back automatically if validate/reload fails
#
# Prereqs (the script checks them):
#   - agent.digitalwerkk.de resolves to this server
#   - the digitalwerk stack is up (agent-api joins pdfwandler_edge itself)
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CADDYFILE="${CADDYFILE:-/opt/apps/pdfwandler/pdfwandler-backend2/deploy/Caddyfile}"
CADDY_CTR="${CADDY_CONTAINER:-pdfwandler-caddy-1}"
VHOST="${DIR}/caddy-vhost.conf"
MARKER="agent.digitalwerkk.de {"

log() { echo "$(date -u +%H:%M:%SZ) $*"; }

[ -f "$VHOST" ] || { echo "missing $VHOST"; exit 1; }
[ -f "$CADDYFILE" ] || { echo "missing $CADDYFILE"; exit 1; }

# --- prereqs ---
if ! getent hosts agent.digitalwerkk.de >/dev/null 2>&1 \
   && ! nslookup agent.digitalwerkk.de >/dev/null 2>&1; then
  log "WARN: agent.digitalwerkk.de does not resolve yet — Caddy cannot get a cert until it does."
fi
# Reachability: the agent-api container joins pdfwandler_edge itself (see
# compose.yml), so Caddy — always on pdfwandler_edge — can resolve it. No
# `docker network connect` needed; warn if the container isn't up yet.
if ! sudo docker exec "$CADDY_CTR" sh -c 'wget -q -T3 -O- http://digitalwerk-agent-api-1:8080/ >/dev/null 2>&1'; then
  log "WARN: $CADDY_CTR cannot reach digitalwerk-agent-api-1:8080 yet — is the digitalwerk stack up (docker compose -f deploy/digitalwerk/compose.yml up -d)?"
fi

# --- already applied? ---
if sudo grep -qF "$MARKER" "$CADDYFILE"; then
  log "vhost already present in $CADDYFILE — reloading only"
  sudo docker exec "$CADDY_CTR" caddy reload --config /etc/caddy/Caddyfile
  log "done"
  exit 0
fi

# --- append with rollback ---
BACKUP="${CADDYFILE}.bak.$(date -u +%Y%m%dT%H%M%SZ)"
sudo cp -p "$CADDYFILE" "$BACKUP"
log "backed up -> $BACKUP"

sudo tee -a "$CADDYFILE" >/dev/null < <(printf '\n'; cat "$VHOST")
log "appended vhost"

rollback() { log "ROLLBACK -> restoring $BACKUP"; sudo cp -p "$BACKUP" "$CADDYFILE"; sudo docker exec "$CADDY_CTR" caddy reload --config /etc/caddy/Caddyfile || true; }

if ! sudo docker exec "$CADDY_CTR" caddy validate --config /etc/caddy/Caddyfile; then
  rollback; echo "caddy validate failed — rolled back"; exit 1
fi
if ! sudo docker exec "$CADDY_CTR" caddy reload --config /etc/caddy/Caddyfile; then
  rollback; echo "caddy reload failed — rolled back"; exit 1
fi

log "reload OK — Caddy will now obtain a certificate for agent.digitalwerkk.de"
log "watch: sudo docker logs -f $CADDY_CTR | grep -i agent.digitalwerkk"
