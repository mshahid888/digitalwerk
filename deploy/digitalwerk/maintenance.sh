#!/usr/bin/env bash
# DigitalWerk agent maintenance — retention purge + pending-handoff retry.
# Runs from a systemd timer (03:30 UTC). Calls the cron endpoint *inside*
# the container over loopback, so it works before DNS / the public
# agent.digitalwerkk.de vhost exists.
#
#   purge: nulls transcripts older than CHAT_AGENT_TRANSCRIPT_RETENTION_DAYS
#          (hard cap 30), deletes old events; keeps session + lead records.
#   retry: re-sends handoff notifications that previously failed (no-op when
#          no channel is configured).
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
set -a; [ -f .env ] && . ./.env; set +a

CONTAINER="${AGENT_API_CONTAINER:-digitalwerk-agent-api-1}"
AUTH=()
[ -n "${CRON_SECRET:-}" ] && AUTH=(--header="Authorization: Bearer ${CRON_SECRET}")

log() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*"; }

log "maintenance start -> ${CONTAINER}"
OUT="$(sudo docker exec "$CONTAINER" wget -q -O - "${AUTH[@]}" \
  --post-data='' http://127.0.0.1:8080/api/cron/purge-transcripts)"
log "maintenance result: ${OUT}"

case "$OUT" in
  *'"ok":true'*) log "maintenance ok"; exit 0 ;;
  *) log "maintenance FAILED"; exit 1 ;;
esac
