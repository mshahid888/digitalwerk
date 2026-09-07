#!/usr/bin/env bash
# Restore a DigitalWerk Postgres dump. Use for the quarterly restore test
# (into a throwaway database) or a real recovery.
#
#   ./restore.sh backups/digitalwerk-20260906T041500Z.sql.gz            # -> a test DB
#   ./restore.sh backups/digitalwerk-20260906T041500Z.sql.gz --into-prod # -> the live DB (DANGER)
#
# Postgres credentials are read from the container's own environment inside
# `docker exec` — never sourced onto the host or passed on a command line.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; cd "$DIR"

PG="${POSTGRES_CONTAINER:-digitalwerk-postgres-1}"
SRC="${1:?usage: restore.sh <dump.sql.gz> [--into-prod]}"
INTO_PROD="${2:-}"
[ -f "$SRC" ] || { echo "no such file: $SRC"; exit 1; }

# Run a shell snippet inside the postgres container with credentials from its
# own environment ($POSTGRES_USER/$POSTGRES_PASSWORD/$POSTGRES_DB, PGPASSWORD
# exported for libpq). Nothing secret touches the host command line.
in_pg() { sudo docker exec -i "$PG" sh -c 'export PGPASSWORD="$POSTGRES_PASSWORD"; '"$*"; }

if [ "$INTO_PROD" = "--into-prod" ]; then
  echo "!! restoring into the LIVE database in 5s — Ctrl-C to abort"; sleep 5
  TARGET='"$POSTGRES_DB"'
else
  STAMP="restore_test_$(date -u +%s)"
  echo "restoring into throwaway database '$STAMP'"
  in_pg 'createdb -U "$POSTGRES_USER" '"$STAMP"
  TARGET="$STAMP"
fi

gunzip -c "$SRC" | in_pg 'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d '"$TARGET"

echo "row counts in target database:"
printf '%s\n' \
  "SELECT 'chat_sessions' t, count(*) FROM chat_sessions" \
  "UNION ALL SELECT 'chat_leads', count(*) FROM chat_leads" \
  "UNION ALL SELECT 'chat_handoffs', count(*) FROM chat_handoffs" \
  "UNION ALL SELECT 'chat_events', count(*) FROM chat_events;" \
  | in_pg 'psql -U "$POSTGRES_USER" -d '"$TARGET"

if [ "$INTO_PROD" != "--into-prod" ]; then
  echo "dropping throwaway database '$STAMP'"
  in_pg 'dropdb -U "$POSTGRES_USER" '"$STAMP"
  echo "restore test OK"
fi
