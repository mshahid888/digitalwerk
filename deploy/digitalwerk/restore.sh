#!/usr/bin/env bash
# Restore a DigitalWerk Postgres dump. Use for the quarterly restore test
# (into a throwaway database) or a real recovery.
#
#   ./restore.sh backups/digitalwerk-20260906T041500Z.sql.gz            # -> a test DB
#   ./restore.sh backups/digitalwerk-20260906T041500Z.sql.gz --into-prod # -> the live DB (DANGER)
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; cd "$DIR"
set -a; . ./.env; set +a

SRC="${1:?usage: restore.sh <dump.sql.gz> [--into-prod]}"
INTO_PROD="${2:-}"
[ -f "$SRC" ] || { echo "no such file: $SRC"; exit 1; }

if [ "$INTO_PROD" = "--into-prod" ]; then
  TARGET_DB="$POSTGRES_DB"
  echo "!! restoring into the LIVE database '$TARGET_DB' in 5s — Ctrl-C to abort"; sleep 5
else
  TARGET_DB="restore_test_$(date -u +%s)"
  echo "restoring into throwaway database '$TARGET_DB'"
  sudo docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" digitalwerk-postgres-1 \
    createdb -U "$POSTGRES_USER" "$TARGET_DB"
fi

gunzip -c "$SRC" | sudo docker exec -i -e PGPASSWORD="$POSTGRES_PASSWORD" digitalwerk-postgres-1 \
  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$TARGET_DB"

echo "row counts in '$TARGET_DB':"
sudo docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" digitalwerk-postgres-1 \
  psql -U "$POSTGRES_USER" -d "$TARGET_DB" -c \
  "SELECT 'chat_sessions' t, count(*) FROM chat_sessions
   UNION ALL SELECT 'chat_leads', count(*) FROM chat_leads
   UNION ALL SELECT 'chat_handoffs', count(*) FROM chat_handoffs
   UNION ALL SELECT 'chat_events', count(*) FROM chat_events;"

if [ "$INTO_PROD" != "--into-prod" ]; then
  echo "dropping throwaway database '$TARGET_DB'"
  sudo docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" digitalwerk-postgres-1 \
    dropdb -U "$POSTGRES_USER" "$TARGET_DB"
  echo "restore test OK"
fi
