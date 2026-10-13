#!/usr/bin/env bash
# One-time (idempotent) server setup for the A7 website admin panel.
# Safe to re-run. Touches ONLY our own resources: the a7-website-db compose
# project, the uploads directory, and the backups directory. It never modifies
# other apps, containers, ports or nginx files.
set -euo pipefail

DB_DIR=/opt/a7-website-db
DATA_DIR=/opt/a7-website-data/uploads
BACKUP_DIR=/opt/a7-website-backups
DB_PORT=5440
REPO_DIR=/opt/a7-website

echo "==> A7 website server setup"

# 1. Check the DB port is free (unless our container already owns it).
if ss -ltn 2>/dev/null | grep -q ":${DB_PORT} "; then
  if docker ps --format '{{.Names}}' | grep -q '^a7-website-postgres$'; then
    echo "  port ${DB_PORT} is used by our a7-website-postgres (ok)"
  else
    echo "  ERROR: port ${DB_PORT} is already in use by something else. Aborting." >&2
    exit 1
  fi
fi

# 2. Database compose project.
mkdir -p "$DB_DIR"
cp "$(dirname "$0")/docker-compose.db.yml" "$DB_DIR/docker-compose.db.yml"
if [ ! -f "$DB_DIR/.env.db" ]; then
  echo "  creating $DB_DIR/.env.db — EDIT IT and set POSTGRES_PASSWORD, then re-run."
  cp "$(dirname "$0")/.env.db.example" "$DB_DIR/.env.db"
  echo "  (stopping so you can set the password)"
  exit 0
fi
echo "==> starting database container"
( cd "$DB_DIR" && docker compose --env-file .env.db -f docker-compose.db.yml up -d )

# 3. Data + backup directories.
mkdir -p "$DATA_DIR" "$BACKUP_DIR"
echo "  uploads dir:  $DATA_DIR"
echo "  backups dir:  $BACKUP_DIR"

# 4. Nightly backup cron (idempotent).
CRON_LINE="30 3 * * * $REPO_DIR/deploy/backup.sh >> $BACKUP_DIR/backup.log 2>&1"
( crontab -l 2>/dev/null | grep -v 'deploy/backup.sh' ; echo "$CRON_LINE" ) | crontab -
echo "  nightly backup scheduled at 03:30"

echo "==> done. Next: create $REPO_DIR/.env.production, run migrations and start pm2 (see docs/DEPLOYMENT.md)."
