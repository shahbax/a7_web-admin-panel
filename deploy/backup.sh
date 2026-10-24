#!/usr/bin/env bash
# Nightly backup: pg_dump of the a7-website database + a tar of the uploads
# directory, with 14-day retention. Run by cron (see setup-server.sh).
set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-/opt/a7-website-backups}
DATA_DIR=${DATA_DIR:-/opt/a7-website-data/uploads}
DB_CONTAINER=${DB_CONTAINER:-a7-website-postgres}
DB_USER=${POSTGRES_USER:-a7_website}
DB_NAME=${POSTGRES_DB:-a7_website}
STAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "[backup] $STAMP database"
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_DIR/db-$STAMP.sql.gz"

echo "[backup] $STAMP uploads"
if [ -d "$DATA_DIR" ]; then
  tar -czf "$BACKUP_DIR/uploads-$STAMP.tar.gz" -C "$(dirname "$DATA_DIR")" "$(basename "$DATA_DIR")"
fi

echo "[backup] $STAMP lead attachments (CVs)"
LEAD_FILES_DIR=${LEAD_FILES_DIR:-$(dirname "$DATA_DIR")/lead-files}
if [ -d "$LEAD_FILES_DIR" ]; then
  tar -czf "$BACKUP_DIR/lead-files-$STAMP.tar.gz" -C "$(dirname "$LEAD_FILES_DIR")" "$(basename "$LEAD_FILES_DIR")"
fi

echo "[backup] pruning backups older than 14 days"
find "$BACKUP_DIR" -name 'db-*.sql.gz' -mtime +14 -delete
find "$BACKUP_DIR" -name 'uploads-*.tar.gz' -mtime +14 -delete
find "$BACKUP_DIR" -name 'lead-files-*.tar.gz' -mtime +14 -delete

echo "[backup] done"
