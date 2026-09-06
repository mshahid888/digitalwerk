#!/usr/bin/env bash
# DigitalWerk Postgres backup — nightly pg_dump, compressed, rotated,
# optionally shipped off-server. Run from cron / a systemd timer (04:15 UTC).
#
#   - dumps the digitalwerk database from the `postgres` container
#   - keeps 7 daily + 4 weekly locally  (~/opt/apps/digitalwerk/backups/)
#   - if BACKUP_RCLONE_REMOTE is set: copies the newest dump off-server
#   - if BACKUP_HEALTHCHECK_URL is set: pings it on success (dead-man's switch)
#
# LOCAL-ONLY backups are corruption/fat-finger protection, NOT disaster
# recovery. Set BACKUP_RCLONE_REMOTE (Cloudflare R2 / Backblaze B2 free tier,
# or a Hetzner Storage Box) before real lead data is stored — see README.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
# Only the non-secret knobs are read from .env here (rclone / healthcheck /
# retention). The Postgres credentials are NOT sourced onto the host — they
# are read from the container's own environment inside `docker exec` so they
# never appear in the host process list or the sudo/journal log.
set -a; [ -f .env ] && . ./.env; set +a

PG="${POSTGRES_CONTAINER:-digitalwerk-postgres-1}"
BACKUP_DIR="${DIR}/backups"
DAILY_KEEP=7
WEEKLY_KEEP=4
TS="$(date -u +%Y%m%dT%H%M%SZ)"
DOW="$(date -u +%u)"   # 1..7, 7 = Sunday
mkdir -p "$BACKUP_DIR"

DEST="${BACKUP_DIR}/digitalwerk-${TS}.sql.gz"

log() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*"; }

log "dump start -> $DEST"
sudo docker exec "$PG" sh -c '
  PGPASSWORD="$POSTGRES_PASSWORD" pg_dump --no-owner --no-privileges \
    -U "$POSTGRES_USER" -d "$POSTGRES_DB"
' | gzip -9 > "$DEST"
chmod 600 "$DEST"
SIZE="$(du -h "$DEST" | cut -f1)"
log "dump ok ($SIZE)"

# Weekly snapshot on Sundays.
if [ "$DOW" = "7" ]; then
  cp -p "$DEST" "${BACKUP_DIR}/weekly-digitalwerk-${TS}.sql.gz"
fi

# Rotate.
ls -1t "${BACKUP_DIR}"/digitalwerk-*.sql.gz 2>/dev/null | tail -n +$((DAILY_KEEP + 1)) | xargs -r rm -f
ls -1t "${BACKUP_DIR}"/weekly-digitalwerk-*.sql.gz 2>/dev/null | tail -n +$((WEEKLY_KEEP + 1)) | xargs -r rm -f

# Off-server copy.
if [ -n "${BACKUP_RCLONE_REMOTE:-}" ]; then
  if command -v rclone >/dev/null 2>&1; then
    log "rclone copy -> ${BACKUP_RCLONE_REMOTE}"
    rclone copy "$DEST" "${BACKUP_RCLONE_REMOTE}/" --no-traverse
    # Mirror the local retention off-server.
    rclone delete "${BACKUP_RCLONE_REMOTE}/" --min-age "$((DAILY_KEEP * 24))h" \
      --include "digitalwerk-*.sql.gz" || true
    log "off-server copy ok"
  else
    log "WARN: BACKUP_RCLONE_REMOTE set but rclone is not installed — local-only backup"
  fi
else
  log "WARN: no BACKUP_RCLONE_REMOTE — backup is LOCAL-ONLY (not DR-safe)"
fi

# Dead-man's switch.
if [ -n "${BACKUP_HEALTHCHECK_URL:-}" ]; then
  curl -fsS -m 10 --retry 3 "${BACKUP_HEALTHCHECK_URL}" >/dev/null 2>&1 || true
fi

log "backup complete"
