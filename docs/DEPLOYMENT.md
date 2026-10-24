# A7 website — deployment & operations runbook

The site is a single Next.js app served by **pm2** as `a7-website` on
`127.0.0.1:3060`, behind nginx, on the Hostinger VPS. The admin panel lives at
`https://a7grouprealestate.com/admin`. No DNS or subdomain change is needed —
nginx already proxies every path on the domain to the app.

> ⚠️ The VPS runs other production apps. Touch **only** our own resources:
> the `a7-website` pm2 app, the `a7-website-db` compose project, the
> `/opt/a7-website*` directories, and `/etc/nginx/conf.d/a7-website.conf`.
> Never run `docker system prune`, never `docker compose down` another project,
> and always run `nginx -t` before reloading.

---

## 1. First-time setup

### 1.1 Database (dedicated Postgres container, port 5440)

```bash
# On the VPS, as root:
cd /opt/a7-website                 # the git checkout (see 1.3)
bash deploy/setup-server.sh        # checks port 5440 is free, scaffolds /opt/a7-website-db
# Edit the generated password, then run again to start the container:
nano /opt/a7-website-db/.env.db    # set POSTGRES_PASSWORD
bash deploy/setup-server.sh        # starts a7-website-postgres + creates data/backup dirs + cron
```

This creates:
- `a7-website-postgres` container on `127.0.0.1:5440` with a named volume,
- `/opt/a7-website-data/uploads` (media),
- `/opt/a7-website-backups` + a nightly 03:30 backup cron (14-day retention).

### 1.2 Environment file

Create `/opt/a7-website/.env.production` (never committed). Use
`.env.example` as the template. Minimum:

```bash
NODE_ENV=production
DATABASE_URL="postgresql://a7_website:THE_DB_PASSWORD@127.0.0.1:5440/a7_website?schema=public"
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_URL="https://a7grouprealestate.com"
AUTH_TRUST_HOST=true
APP_ENCRYPTION_KEY="$(openssl rand -base64 32)"   # 32 bytes, base64
UPLOADS_DIR="/opt/a7-website-data/uploads"
OWNER_EMAIL="owner@a7group.com"
OWNER_PASSWORD="a-strong-password"
OWNER_NAME="A7 Owner"
```

Integration credentials (Property Finder, Bayut, Bitrix24) are **not** env
vars — they are entered in the admin panel later.

### 1.3 Convert /opt/a7-website to a git checkout

The repo is private (`github.com/shahbax/a7_web-admin-panel`, branch `main`).
Give the server a **read-only deploy key**:

```bash
# On the VPS:
ssh-keygen -t ed25519 -f ~/.ssh/a7_deploy -N "" -C "a7-website-deploy"
cat ~/.ssh/a7_deploy.pub
```

Add that public key in GitHub → repo **Settings → Deploy keys → Add deploy key**
(read-only, no write access needed). Then configure SSH and clone:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github-a7
  HostName github.com
  User git
  IdentityFile ~/.ssh/a7_deploy
  IdentitiesOnly yes
EOF

# Preserve the existing .env and any data, then replace the plain copy with a checkout:
cd /opt
mv a7-website a7-website.bak
git clone git@github-a7:shahbax/a7_web-admin-panel.git a7-website
cp a7-website.bak/.env.production a7-website/.env.production   # keep secrets
```

### 1.4 First build, migrate, seed, start

```bash
cd /opt/a7-website
npm ci
npx prisma migrate deploy
npm run db:seed            # creates the first owner from OWNER_* env
npm run build
pm2 start deploy/ecosystem.config.cjs   # or: pm2 start npm --name a7-website -- start -- -p 3060
pm2 save
```

### 1.5 nginx

Merge `deploy/nginx/a7-website.conf` into `/etc/nginx/conf.d/a7-website.conf`
(keep your certbot-managed TLS lines). Key additions: allow `/admin`, serve
`/uploads/` from disk, `client_max_body_size 50m`, and the login/API rate limits.

```bash
nginx -t && systemctl reload nginx
```

---

## 2. Continuous deployment (GitHub Actions)

On every push to `main`, the **CI** workflow runs lint + typecheck + build. When
it passes, the **Deploy** workflow SSHes to the VPS and runs `deploy/deploy.sh`.

Add these GitHub repo secrets (**Settings → Secrets and variables → Actions**):

| Secret | Value |
|---|---|
| `VPS_HOST` | `187.127.123.235` (or `srv1802669.hstgr.cloud`) |
| `VPS_USER` | the SSH user used for deploys (e.g. `root` or a dedicated deploy user) |
| `VPS_SSH_KEY` | the **private** key whose public half is an `authorized_keys` entry on the VPS for `VPS_USER` |

> Create a dedicated deploy key pair for Actions (separate from the read-only
> GitHub deploy key in 1.3): `ssh-keygen -t ed25519 -f a7_ci -N ""`, put the
> **public** key in the VPS user's `~/.ssh/authorized_keys`, and paste the
> **private** key into `VPS_SSH_KEY`.

`deploy/deploy.sh` does: `git fetch/reset → npm ci → prisma migrate deploy →
npm run build → pm2 reload`. If the build fails it rolls the checkout back to
the previous commit and leaves the running app untouched.

---

## 3. Manual deploy

```bash
ssh <vps>
bash /opt/a7-website/deploy/deploy.sh
```

## 4. Rollback

```bash
cd /opt/a7-website
git log --oneline -5                 # find the good commit
git reset --hard <good-commit-sha>
npm ci && npx prisma migrate deploy && npm run build
pm2 reload a7-website
```

(To undo a bad migration, restore the database from a backup — see §5.)

## 5. Backups & restore

Backups run nightly to `/opt/a7-website-backups` (14-day retention). Run one
on demand with `bash /opt/a7-website/deploy/backup.sh`.

Restore the database:

```bash
gunzip -c /opt/a7-website-backups/db-YYYYMMDD-HHMMSS.sql.gz \
  | docker exec -i a7-website-postgres psql -U a7_website -d a7_website
```

Restore uploads (and `lead-files-*.tar.gz` the same way for CVs):

```bash
tar -xzf /opt/a7-website-backups/uploads-YYYYMMDD-HHMMSS.tar.gz -C /opt/a7-website-data
```

## 6. Rotating secrets

- **AUTH_SECRET**: change in `.env.production`, `pm2 reload a7-website`. Existing
  sessions are invalidated (users log in again).
- **APP_ENCRYPTION_KEY**: rotating it invalidates stored integration secrets —
  re-enter them in the admin panel afterwards.
- **DB password**: update in `/opt/a7-website-db/.env.db` and the
  `DATABASE_URL`, recreate the container, reload the app.

## 7. Adding an admin user

The first owner is seeded from `OWNER_*`. Additional users are created in
**Admin → (users)** by an owner. To (re)seed the owner non-interactively, set
`OWNER_*` and run `npm run db:seed` (idempotent — it skips an existing email).

### Forgotten password

On the server (Hostinger → VPS → Web console):

```bash
bash /opt/a7-website/scripts/reset-admin.sh
```

It lists the admin accounts, asks which email to reset and the new password
(typed twice, hidden). Owners can also set any user's password in
**Admin → Users**, and everyone can change their own under **My account**.

## 8. Optional: admin subdomain (future)

`https://a7grouprealestate.com/admin` needs no DNS change. An
`admin.a7grouprealestate.com` subdomain is optional and would require an IONOS
A record plus a certbot certificate — not needed today.
