#!/usr/bin/env bash
# DigitalWerk Postgres backup — nightly pg_dump, compressed, rotated,
# optionally shipped off-server. Run from cron / a systemd timer (04:15 UTC).
#
#   - dumps the digitalwerk database from the `postgres` container
#   - verifies the dump is a valid, non-empty gzip before keeping it
#   - keeps 7 daily + 4 weekly locally  (deploy/digitalwerk/backups/)
#   - if BACKUP_RCLONE_REMOTE is set: copies the newest dump off-server
#   - if BACKUP_HEALTHCHECK_URL is set: pings it on success (dead-man's switch)
#
# Exit semantics: a FAILED DUMP exits non-zero (systemd marks the service
# failed — alert). A good dump with a failed rotation / off-server copy logs
# a WARN and still exits 0 — the backup exists.
#
# LOCAL-ONLY backups are corruption/fat-finger protection, NOT disaster
# recovery. Set BACKUP_RCLONE_REMOTE (Cloudflare R2 / Backblaze B2 free tier,
# or a Hetzner Storage Box) before real lead data is stored — see README.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
# Only the non-secret knobs are read from .env here (rclone / healthcheck).
# The Postgres credentials are NOT sourced onto the host — they are read from
# the container's own environment inside `docker exec` so they never appear
# in the host process list or the sudo/journal log.
set -a; [ -f .env ] && . ./.env; set +a

PG="${POSTGRES_CONTAINER:-digitalwerk-postgres-1}"
BACKUP_DIR="${DIR}/backups"
DAILY_KEEP=7
WEEKLY_KEEP=4
TS="$(date -u +%Y%m%dT%H%M%SZ)"
DOW="$(date -u +%u)"   # 1..7, 7 = Sunday
mkdir -p "$BACKUP_DIR"

DEST="${BACKUP_DIR}/digitalwerk-${TS}.sql.gz"
STATUS_FILE="${BACKUP_DIR}/.last-run"

log() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*"; }
warn() { log "WARN: $*"; }
# One-line machine-readable status a monitor (or a human) can grep without
# reading the journal:  `OK|WARN|FAIL <iso-ts> [detail]`.
status() { printf '%s %s %s\n' "$1" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "${2:-}" > "$STATUS_FILE" 2>/dev/null || true; }
# Any unexpected abort (set -e) records FAIL before exiting.
trap 'status FAIL "aborted (exit $?)"' ERR

# --- dump (critical: failure exits non-zero) ------------------------------
log "dump start -> $DEST"
set +e
sudo docker exec "$PG" sh -c '
  PGPASSWORD="$POSTGRES_PASSWORD" pg_dump --no-owner --no-privileges \
    -U "$POSTGRES_USER" -d "$POSTGRES_DB"
' | gzip -9 > "$DEST"
rc=${PIPESTATUS[0]}
set -e
if [ "$rc" -ne 0 ]; then
  rm -f "$DEST"
  log "ERROR: pg_dump failed (exit $rc) — no backup written"
  status FAIL "pg_dump exit $rc"
  exit 1
fi
if ! gzip -t "$DEST" 2>/dev/null || [ ! -s "$DEST" ]; then
  rm -f "$DEST"
  log "ERROR: dump is empty or not valid gzip — discarded"
  status FAIL "dump empty / not gzip"
  exit 1
fi
chmod 600 "$DEST"
log "dump ok ($(du -h "$DEST" | cut -f1))"

# --- everything below is best-effort; a failure here must not fail the run
FAIL_SOFT=0

# Weekly snapshot on Sundays.
if [ "$DOW" = "7" ]; then
  cp -p "$DEST" "${BACKUP_DIR}/weekly-digitalwerk-${TS}.sql.gz" || { warn "weekly copy failed"; FAIL_SOFT=1; }
fi

# Rotate — newest-first, delete past the keep count. Tolerates zero matches
# (that was the original bug: `ls <non-matching-glob>` exits 2 under
# `set -o pipefail` and killed the whole run after a good dump).
prune_old() {
  local keep="$1" pattern="$2"
  find "$BACKUP_DIR" -maxdepth 1 -type f -name "$pattern" -printf '%T@ %p\n' 2>/dev/null \
    | sort -rn | tail -n "+$((keep + 1))" | cut -d' ' -f2- \
    | while IFS= read -r f; do rm -f -- "$f"; done
}
prune_old "$DAILY_KEEP"  'digitalwerk-*.sql.gz'        || { warn "daily prune failed"; FAIL_SOFT=1; }
prune_old "$WEEKLY_KEEP" 'weekly-digitalwerk-*.sql.gz' || { warn "weekly prune failed"; FAIL_SOFT=1; }

# Off-server copy.
if [ -n "${BACKUP_RCLONE_REMOTE:-}" ]; then
  if command -v rclone >/dev/null 2>&1; then
    log "rclone copy -> ${BACKUP_RCLONE_REMOTE}"
    if rclone copy "$DEST" "${BACKUP_RCLONE_REMOTE}/" --no-traverse; then
      rclone delete "${BACKUP_RCLONE_REMOTE}/" --min-age "$((DAILY_KEEP * 24))h" \
        --include "digitalwerk-*.sql.gz" || true
      log "off-server copy ok"
    else
      warn "rclone copy FAILED — backup is local-only for this run"
      FAIL_SOFT=1
    fi
  else
    warn "BACKUP_RCLONE_REMOTE set but rclone is not installed — local-only backup"
    FAIL_SOFT=1
  fi
else
  warn "no BACKUP_RCLONE_REMOTE — backup is LOCAL-ONLY (not DR-safe). See README."
fi

# Dead-man's switch — only ping on a fully clean run.
if [ -n "${BACKUP_HEALTHCHECK_URL:-}" ] && [ "$FAIL_SOFT" -eq 0 ]; then
  curl -fsS -m 10 --retry 3 "${BACKUP_HEALTHCHECK_URL}" >/dev/null 2>&1 || warn "healthcheck ping failed"
fi

if [ "$FAIL_SOFT" -ne 0 ]; then
  log "backup complete WITH WARNINGS (dump is good; see WARN lines above)"
  status WARN "dump ok; $(basename "$DEST"); see journal for WARN lines"
else
  log "backup complete"
  status OK "$(basename "$DEST")"
fi
exit 0
