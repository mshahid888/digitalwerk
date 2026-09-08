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
#
# The CRON_SECRET / AGENT_API_SECRET are expanded by the shell *inside* the
# container (both are already in its environment via compose.yml), so no
# secret is ever passed on the host command line or written to the journal.
set -euo pipefail

CONTAINER="${AGENT_API_CONTAINER:-digitalwerk-agent-api-1}"

log() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*"; }

log "maintenance start -> ${CONTAINER}"
OUT="$(sudo docker exec "$CONTAINER" sh -c '
  wget -q -O - \
    --header="Authorization: Bearer ${CRON_SECRET}" \
    --header="X-Agent-Auth: ${AGENT_API_SECRET}" \
    --post-data="" \
    http://127.0.0.1:8080/api/cron/purge-transcripts
')"
log "maintenance result: ${OUT}"

case "$OUT" in
  *'"ok":true'*) log "maintenance ok"; exit 0 ;;
  *) log "maintenance FAILED"; exit 1 ;;
esac
