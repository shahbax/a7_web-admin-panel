#!/usr/bin/env bash
# Reset an admin user's password (run on the server as root):
#   bash /opt/a7-website/scripts/reset-admin.sh
set -e
cd "$(dirname "$0")/.."
set -a; . ./.env.production; set +a
echo "Existing admin accounts:"
docker exec a7-website-postgres psql -U a7_website -d a7_website -Atc "select email, role from users;" || true
read -rp "Email to reset: " RESET_EMAIL
read -rsp "New password (min 12 chars, hidden): " RESET_PASSWORD; echo
read -rsp "Repeat password: " P2; echo
[ "$RESET_PASSWORD" = "$P2" ] || { echo "Passwords do not match."; exit 1; }
[ ${#RESET_PASSWORD} -ge 12 ] || { echo "Password too short (min 12)."; exit 1; }
export RESET_EMAIL RESET_PASSWORD
node scripts/reset-admin-password.cjs
