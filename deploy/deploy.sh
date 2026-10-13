#!/usr/bin/env bash
# Deploy the current main branch to the running pm2 app. Run on the VPS (the
# GitHub Actions deploy workflow calls this over SSH). Idempotent and safe:
# a failed build aborts before the app is reloaded.
set -euo pipefail

REPO_DIR=${REPO_DIR:-/opt/a7-website}
PM2_APP=${PM2_APP:-a7-website}
BRANCH=${DEPLOY_BRANCH:-main}

cd "$REPO_DIR"

echo "==> fetching $BRANCH"
git fetch origin "$BRANCH"
PREV=$(git rev-parse HEAD)
echo "  previous commit: $PREV"
git reset --hard "origin/$BRANCH"

echo "==> installing dependencies"
npm ci

echo "==> applying database migrations"
npx prisma migrate deploy

echo "==> building"
if ! npm run build; then
  echo "  BUILD FAILED — rolling back to $PREV and keeping the running app" >&2
  git reset --hard "$PREV"
  npm ci
  exit 1
fi

echo "==> reloading pm2 app ($PM2_APP)"
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 reload "$PM2_APP" --update-env
else
  pm2 start npm --name "$PM2_APP" -- start -- -p 3060
  pm2 save
fi

echo "==> deployed $(git rev-parse --short HEAD)"
