# Build prompt: A7 Group website CMS / admin panel

> Paste everything below this line into Claude Code (web) with this repository connected.

---

You are working on the **A7 Group real estate website** (Dubai), a Next.js app in this repository. It is **already live** at https://a7grouprealestate.com on a Hostinger VPS. Your job is to build a **full admin panel (CMS)** at **https://a7grouprealestate.com/admin**. From there the team must be able to manage **the entire public website** without touching code:

- **Listings and agents** are **synced automatically** from Property Finder, Bayut and Bitrix24.
- **Everything else** (pages, sections, header, menu, footer, projects, areas, developers, events, careers, services, testimonials, FAQs, SEO, site settings) is **managed in the admin panel**.

The single most important rule:

> **The public site must look and behave exactly as it does today.** Same layout, brand colours, fonts, spacing, animations (Framer Motion, Swiper and carousel behaviour), responsive behaviour and component styling. The admin panel changes **data/content only**. New pages and sections built in the admin are made from the **same existing components**, so they inherit the brand automatically. Admins must never be able to enter arbitrary CSS, colours or fonts. They can only pick from predefined, on-brand variants.

Work in phases (listed below). Open a separate PR or commit series per phase. Before writing code, read the codebase and post a short implementation plan for my approval. Confirm or correct any assumption below that doesn't match the code.

---

## 1. Current codebase (what already exists)

**Stack:**
- Next.js **16.1.7** with the App Router and Turbopack.
- React 19 and TypeScript 5.
- Tailwind CSS 4 (`@theme inline` tokens in `src/styles/globals.css`).
- shadcn/Radix UI (`src/shared/ui`).
- Framer Motion, Swiper, Embla and react-slick.
- lucide-react plus generated SVG icons (`src/shared/icons/generated`).
- Libraries already installed that are useful for the admin:
  - `@dnd-kit/*` for drag-and-drop reordering.
  - TipTap (`src/shared/ui/rich-text-editor`) for rich text.
  - `react-day-picker`, `recharts`, side drawers, form-field components, listing tables.

**There is no backend today.** All content is hard-coded TypeScript:
- Page content lives in `src/features/<feature>/content/*.ts`, for example:
  - `features/about/content/about-page-content.ts`
  - `features/agent/content/agents-page-content.ts`, `agent-profile-content.ts`
  - `features/area/content/areas-page-content.ts`, `area-detail-content.ts`
  - `features/developer/content/*`, `features/event/content/events-page-content.ts`, `features/career/content/career-page-content.ts`
  - `features/property/content/property-listing-page-content.ts`, `list-your-property-page-content.ts`
  - `features/services/content/*` (7 service pages)
  - Home content goes through `features/home/services/content.ts`.
- Property and listing mock data lives in `features/property/core/data/mocks/` and `features/project/core/data/mocks/`.
- Navigation lives in `src/shared/content/navigation/site-header-nav.ts`.
- Shared marketing content lives in `src/shared/content/marketing/*`.
- Header and footer components are in `src/shared/layout/` (`site-header.tsx`, `header-main.tsx`, `footer-main.tsx`, `footer-link-columns.tsx`, `layout-header.tsx`, `layout-footer.tsx`).

**Architecture:** feature-sliced, with ESLint-enforced layering. Each feature has these folders:
- `src/features/<x>/core/{domain,data}`: entities, repository interfaces, DTOs, mappers (for example `property.mapper.ts`) and repositories.
- `services/`: re-exports.
- `pages/`: page components.
- `ui/`: components that only take props.
- `content/`: the data.

Route files in `src/app/(public)/**` are thin re-exports of `@/features/<x>/pages/*`. **Keep this architecture.** Replace the mock repositories and content files with DB-backed repositories behind the **same interfaces**, so UI components barely change.

**Public routes** (`src/app/(public)`):
- `/`
- `/properties` and `/properties/[id]`
- `/off-plan/[id]` and `/projects/[id]`. These use per-project brand theming via `src/theme` (`ThemeScope`, `PROJECT_THEMES`, `generate-palette-from-color`).
- `/agents` and `/agents/[id]`, with tabs: about, listings, off-plan, transactions, area-expertise, contact.
- `/areas` and `/areas/[id]`, `/developers` and `/developers/[id]`, `/events` and `/events/[id]`, `/career` and `/career/[id]`.
- `/about`, `/sell-property`.
- `/services` plus the 7 service pages: conveyancing, list-your-property, mortgages, plots, property-management, property-snagging, short-term-rentals.

**Home page sections** (`src/features/home/ui/home/*`), in order:
1. Hero: background slider, property search, stat cards.
2. Off-plan latest launches.
3. Most trending projects.
4. Trusted developer partners.
5. Furnished luxury properties (tabs).
6. Trending luxury villas.
7. Real estate experts (agents).
8. "Real estating since" banner.
9. Real estate news.
10. Happy home owners (testimonials).
11. FAQ.
12. Newsletter / developer CTA.

**Other existing code:**
- **A mock CRM** under `src/app/(dashboard)/dashboard/*` and `src/features/dashboard/*`. It's UI only, with mock data and fake auth. It's **not** wanted as a CRM, but **reuse its UI shell** for the admin: `dashboard-shell`, `dashboard-sidebar`, drawers, tables, form components, TipTap editor and dnd-kit kanban patterns. Delete whatever isn't reused at the end.
- **Fake auth** in `src/features/auth/*`: it accepts any email and password and stores the user in an unsigned JSON cookie. **Replace it completely.**
- **`src/proxy.ts`** (Next 16's replacement for middleware) currently redirects `/dashboard`, `/login`, `/register`, `/welcome`, `/components/*` and `/icons` to `/`. The live nginx config also returns 404 for these paths. Update both for `/admin` (see the Deployment section).
- **The design-system gallery** (`src/app/(design-system)`) shows every reusable component. Use it as the catalogue of available building blocks.

**Known issues to fix along the way:**
- About 31 ESLint errors, mostly `react-hooks/set-state-in-effect` and refs being read during render.
- Missing SEO metadata on most pages; no `sitemap.ts` or `robots.ts`.
- All lead and contact forms are no-ops.
- Images are hot-linked from Unsplash and pravatar. `next.config.mjs` `images.remotePatterns` only allows those two hosts.

---

## 2. Target architecture

**Single Next.js app.** The admin lives in the same app under a new route group, `src/app/(admin)/admin/**`. No separate service unless strictly necessary.

**Database:** PostgreSQL in a dedicated Docker container on the VPS (see Deployment). Use **Prisma** or **Drizzle**; pick one and justify it. All schema changes go through migrations committed to the repo.

**Auth:**
- Real authentication: Auth.js (NextAuth v5) with credentials, or a hand-rolled equivalent.
- Passwords hashed with argon2 or bcrypt.
- httpOnly, secure, signed sessions; CSRF-safe server actions.
- Login rate-limiting.
- **Roles:**
  - `owner`: everything, plus user management.
  - `admin`: all content and settings.
  - `editor`: content only, no settings or users.
- First owner account is created by a seed script that reads env vars. No default passwords in code.
- `/admin/**` is protected in `proxy.ts` and again server-side in every admin page and server action. Never rely on the proxy alone.

**Caching:** public pages stay fast (static or ISR). On publish, call `revalidateTag`/`revalidatePath` for the affected pages. Never make public pages fully dynamic just because data is in the DB.

**Drafts and publishing:** every editable entity has `draft` and `published` states.
- "Preview" uses Next draft mode to show the draft on the real public page.
- "Publish" makes it live.
- Keep **version history** with restore for pages and global settings: at least the last 20 versions.

**Audit log:** who changed what and when.

---

## 3. The page builder: how new pages and sections inherit the brand automatically

This is the core design. Implement it exactly in this spirit.

### 3.1 Block registry
Turn every existing section component into a registered **block type**:

```ts
// src/features/cms/blocks/registry.ts (illustrative)
defineBlock({
  type: "home.hero",
  label: "Hero with search",
  component: HeroSection,          // the EXISTING component, unchanged styling
  schema: heroSchema,              // zod schema of its editable props
  defaults: currentHeroContent,    // today's content from content/*.ts
  dataSource?: "none" | "listings" | "agents" | "projects" | ..., // for data-driven blocks
  allowedOn: ["home", "custom", ...],
})
```

- The **zod schema** describes only content: text, rich text, images, links/buttons, lists of items, and a picker for which listings, agents or projects to show.
- Style choices are limited to **enums of on-brand variants** that already exist in the code: background (`white | cream | dark`), alignment, button variant (`primary | outline | link`), or an icon from the existing icon set. **No free-form colours, fonts, CSS, or class names.**
- The admin **auto-generates forms** from the schema: text inputs, the TipTap rich-text editor, a media-library picker for images, a link/button editor, repeatable list editors with drag-to-reorder, and pickers for listings, agents, projects, areas and developers.
- Because blocks render the **existing components**, animations (Framer Motion and carousels), spacing, typography and responsive behaviour are inherited automatically. New blocks must follow the same rule.

### 3.2 Generic brand blocks (for building new pages)
Besides the existing page-specific sections, add a small set of **generic blocks** built **only** from existing design tokens and primitives (`src/shared/ui`, typography scale, `--a7-*` tokens, `section-header`, buttons, cards, the existing Framer Motion reveal patterns). Examples:
- Section heading: eyebrow, heading and description, matching the existing `section-header`.
- Rich text.
- Buttons row.
- Image, and image + text (left or right).
- Feature/icon grid.
- Card grid of links.
- Stats row.
- CTA banner.
- FAQ accordion.
- Testimonials.
- Gallery and carousel.
- Video embed.
- Contact/lead form.
- Listing grid (filtered query), agent grid, project grid.
- Spacer and divider, with preset sizes only.

Every block gets the **same entrance animations** the site uses today, applied by the block wrapper so admins can't forget them.

### 3.3 Pages
- A **Page** is an ordered list of block instances: `{ id, type, props, visible, order }`.
- Page-level fields: title, slug, SEO, status, and template (`default`, `service`, `landing`).
- **Existing pages** (home, about, services, each service page, sell-property, listing pages, area, developer, event and career index pages) are migrated into this model. The **seed migration** converts today's `content/*.ts` into DB rows, so after migration the site is **pixel-identical**.
- **New pages:** in admin, choose "Add page", set the title and slug (validated as unique and not clashing with reserved routes), add blocks from the library, publish. They're served by a catch-all `src/app/(public)/[...slug]/page.tsx` that only resolves CMS pages and otherwise returns `notFound()`.
- **Per-section actions** in the admin for every page:
  - add a block at any position,
  - edit,
  - **hide/show** (toggle without deleting),
  - **duplicate**,
  - **delete** (with confirmation, recoverable from version history),
  - **drag to reorder** (dnd-kit).
- **Detail templates** (`/properties/[id]`, `/projects/[id]`, `/off-plan/[id]`, `/agents/[id]`, `/areas/[id]`, and so on) keep their coded layout. Admins edit the **data**, plus the shared editable sections on those templates (for example the inquiry CTA text and FAQ) and their visibility.

### 3.4 Live editing experience
- The editor has a left panel (block list and forms) and a right **live preview iframe** of the real page in draft mode. It refreshes when a field changes.
- Preview at desktop, tablet and mobile widths.

---

## 4. Global settings (admin → Settings)

- **Header:**
  - Logo (light and dark variants), with the existing transparent-over-hero behaviour preserved.
  - The CTA button ("Sell Property": label and link).
  - Show/hide for the search bar where applicable.
- **Menu editor:** a tree editor for the main navigation in `site-header-nav.ts`. Current items: Home, Services, Find Agent, Buy, Rent, Sell, Offplan Project, Holiday Homes, each with their dropdowns.
  - Each item: label, link (internal page picker or external URL), open in new tab, visible.
  - Children: nested dropdown items, drag to reorder.
  - Mobile menu uses the same data.
- **Footer:**
  - Link columns (add, rename, reorder, delete columns and links), contact block, social links, newsletter text, legal/copyright line.
  - Show/hide each part.
- **Site settings:**
  - Company name, phone (+971 50 392 8461), WhatsApp, email (info@a7group.com), office address and map, opening hours.
  - Default SEO (title template, description, OG image), favicon, analytics IDs (GA4, Meta Pixel; consent-aware), robots on/off for staging.
- **Brand theme settings are read-only in v1.** Show the palette from `src/theme`/`globals.css` for reference. Per-project themes (`PROJECT_THEMES`) become editable on the Project entity: the admin picks a brand colour and the palette is generated by the existing `generate-palette-from-color`.

---

## 5. Content collections managed in admin

Each collection gets a list view (search, filter, sort, bulk publish/hide/delete), an edit form, and a draft/publish flow.

- **Off-plan projects:** gallery, overview, highlights, timeline, floor plans, payment plans, FAQ, assigned experts, developer, area, handover date, project theme colour.
- **Areas / communities:** all fields currently in `areas-page-content.ts` and `area-detail-content.ts`.
- **Developers:** logo, description, projects, CTA.
- **Events, careers/jobs, services** (the 7 service pages), **news/blog posts** (the home "news" section), **testimonials**, **FAQs** (global, plus per-page sets), **developer partner logos**, **hero slides**.
- **Agents:** synced from the integrations (section 6), with CMS overrides.
- **Listings:** synced from the integrations (section 6), with CMS overrides.
- **Media library:**
  - Upload images, video and PDFs (brochures, floor plans), with alt text, folders and search.
  - Files are stored on the VPS disk (`/opt/a7-website-data/uploads`), served efficiently (nginx `location /uploads/` or a Next route with long cache headers).
  - Optimised via `next/image`. Install `sharp` on the server; its install script was skipped before.
  - Replace hot-linked Unsplash/pravatar images over time. Keep those hosts in `remotePatterns` until they're replaced, and add the portals' image hosts.
- **Leads / form submissions:**
  - Every public form (agent contact, property inquiry, area "ask experts", newsletter, list-your-property, sell-property, career application with CV upload, contact) saves to the DB.
  - Each submission sends an email notification (SMTP via env vars) and **creates a lead in Bitrix24** (`crm.lead.add`) with source, page URL and the listing/agent reference.
  - Admin inbox: list, view, mark handled, export CSV.
  - Spam protection: honeypot plus rate limit. Optional Cloudflare Turnstile.

---

## 6. Listings and agents: integrations (Property Finder, Bayut, Bitrix24)

**Goal:** listings and agents come from the portals and CRM. The public site renders them with the **existing** property cards, detail page, agent cards and agent profile, so **design and animations stay exactly the same; only the data changes.**

**Architecture:**
- **Provider adapters** in `src/features/integrations/<provider>/`:
  - **Property Finder:** Enterprise / Expert API (OAuth client credentials), and/or the XML listings feed.
  - **Bayut / dubizzle:** Profolio XML feed or API.
  - **Bitrix24:** REST API via an inbound webhook or OAuth app. Use it for agents/users, CRM listings if the team keeps listings there, and lead creation.
  - Note: `src/features/dashboard/settings/integrations/content/data-import-export-content.ts` contains `crm.a7group.ae/api/v2/export/XML/...` URLs. Check whether this is an existing CRM XML export the team already uses as a single combined feed. If it is, support it as a provider too, and **move the URLs out of the code into the admin Integrations settings.**
- Each adapter fetches data and normalises it into **one internal schema** that matches the existing domain entities (`property.entity.ts`, `property.dto.ts`, the agent entity). Map it through, or extend, the existing `property.mapper.ts`, so UI components need **no changes**.
- **Listing fields to normalise:** reference/permit number, title, description, price, sale/rent, rent frequency, property type, beds, baths, size, location hierarchy (city, community, sub-community, building), coordinates, amenities, images (ordered), floor plans, video/360, completion status, furnishing, DLD permit/QR, assigned agent, portal URLs, updated timestamp.
- **Agent fields to normalise:** name, photo, title/role, phone, WhatsApp, email, languages, nationality, BRN/licence, specialities and areas, bio, social links, listing counts.
- **De-duplication:** the same listing can appear on several portals. Match on permit/reference number, choose a source priority (configurable), and keep links to every source.
- **Sync:**
  - Scheduled job (every 30–60 min, configurable) plus a manual "Sync now" button in admin.
  - Use a pm2 cron process or a systemd timer on the VPS. n8n is already running on the same server, but keep this in the app for simplicity.
  - Incremental where the API allows it.
  - Listings removed from the source are marked off-market and hidden, not hard-deleted.
- **Images:** keep portal image URLs, add their hosts to `next.config.mjs` `images.remotePatterns`, and optionally cache them locally.
- **Admin overrides:** survive future syncs, stored separately from synced fields. They are:
  - hide or feature a listing or agent,
  - pin to home sections ("Furnished luxury", "Trending villas", and so on),
  - override title or cover image,
  - assign to an area or project page,
  - custom SEO slug.
- **Admin Integrations screen (Settings → Integrations): credentials are entered here, not in code or env files.**
  - One card per provider (Property Finder, Bayut, Bitrix24, plus a generic XML feed). Fields: API key/secret, client ID, webhook URL, feed URL, enabled on/off, sync interval, source priority.
  - **Secrets are stored encrypted at rest** in the DB (AES-256-GCM). The key comes from a single env var, `APP_ENCRYPTION_KEY`. After saving, secrets are never shown in full (masked, with a "replace" option). Only `owner`/`admin` roles can edit them.
  - A **"Test connection"** button per provider validates credentials and shows a sample of fetched records.
  - Last sync time, counts added/updated/removed, error log.
  - Field-mapping review and a dry-run.
  - **Integration access is not available yet.** Ship everything ready to work: adapters, the sync engine, the admin screens, and fixtures/mocked tests. The moment credentials are entered in admin and the provider is enabled, sync must start working with no code change or redeploy.
- **SEO:** listing detail pages keep stable slugs and add `RealEstateListing` JSON-LD. Agents get `RealEstateAgent` JSON-LD.

API access is not available yet. Build the adapters against documented response shapes, with fixtures and tests. Until a provider is configured and enabled in admin, the site keeps showing the current seeded listings and agents (migrated from the mock data), so nothing looks empty. List exactly which credentials I need to obtain from each provider, and where to get them.

---

## 7. SEO and quality (part of the deliverable)

- `generateMetadata` on every page from CMS fields: title, description, canonical, OG and Twitter images.
- `sitemap.ts` (pages, listings, projects, areas, agents, developers, events, careers) and `robots.ts`.
- A custom `not-found.tsx`.
- JSON-LD: Organization, RealEstateListing, RealEstateAgent, FAQPage, BreadcrumbList.
- Fix all existing ESLint errors. `npm run check` (lint + typecheck) must pass. Add `npm run build` to CI (`.github/workflows/ci.yml`).
- **Tests:**
  - Unit tests for mappers, adapters and schema validation (Vitest).
  - Playwright e2e tests for admin login, edit/publish of a section, menu edit, new page creation, and hide/delete/reorder.
  - **Playwright visual-regression snapshots** of the public pages taken **before** the migration. The migrated, DB-backed pages must match them.
- Accessibility: alt text is required in the media library, forms are labelled, and the admin is keyboard-navigable.

---

## 8. Deployment (Hostinger VPS)

The live site's server details:

| Item | Value |
|---|---|
| Server | Hostinger VPS, Ubuntu 24.04, IP `187.127.123.235` (hostname `srv1802669.hstgr.cloud`), root SSH |
| App path | `/opt/a7-website` (currently a plain uploaded copy, **not** a git checkout) |
| Runtime | Node v24, run by **pm2** as process `a7-website`: `npm start -- -p 3060` (pm2 startup enabled) |
| Reverse proxy | nginx, config `/etc/nginx/conf.d/a7-website.conf`. Proxies `a7grouprealestate.com`, `www.`, and `site.srv1802669.hstgr.cloud` to `127.0.0.1:3060`. A `location ~ ^/(dashboard\|login\|register\|components\|icons\|deep-research)` block returns 404. |
| SSL | Let's Encrypt via `certbot --nginx` (auto-renew), http→https redirect |
| DNS | Domain registered at GoDaddy, DNS hosted at IONOS. `@` and `www` A records point to `187.127.123.235`. **`erp.a7grouprealestate.com` and all MX/TXT records point elsewhere and must not be touched.** |

**⚠️ This server also runs other production apps**: A7 accounting (`:3050`), n8n (`:5678`), WhatsApp/HR apps (`:8085`, `:8086`, `:8100`), complaints (`:8200`), jarvis (`:5100`, `:5101`, `:7880`), `deploy-web` (`:8091`), Postgres containers including `a7db-db-1` on `127.0.0.1:5432`, and pm2 apps `cv-auto` and `waba-campaign-mapper`, plus other nginx sites in `/etc/nginx/conf.d/`.
- **Never modify, restart or reuse** their containers, databases, ports or nginx files.
- Never run `docker system prune`, `docker compose down` outside our own compose project, or `nginx` changes that touch other files.
- Always run `nginx -t` before reloading.

**What to set up:**
1. **Database:** a new docker compose project at `/opt/a7-website-db/` with its own Postgres container (`a7-website-postgres`) bound to `127.0.0.1:5440` (check that it's free first), with a named volume. Nightly `pg_dump` backups to `/opt/a7-website-backups` with 14-day retention, plus a backup of the uploads folder.
2. **Env:** `/opt/a7-website/.env.production`, never committed. Commit a complete `.env.example` listing every variable: DB URL, auth secret, `APP_ENCRYPTION_KEY`, SMTP (optional fallback; SMTP should also be configurable in admin settings), owner seed email/password. Integration credentials are **not** env vars; they're entered in the admin panel (section 6).
3. **Git-based deploys:** convert `/opt/a7-website` into a git checkout of this repo, keeping the existing `.env` and data.
   - The repo is **private**: `github.com/shahbax/a7_web-admin-panel`, branch `main`.
   - The server needs a **read-only GitHub deploy key**: generate it on the server, add the public key under repo Settings → Deploy keys, and clone over SSH.
   - Put the exact commands in the runbook.
4. **CI/CD:** a GitHub Actions workflow `deploy.yml`.
   - Runs on push to `main` after CI passes.
   - SSHes to the VPS using repository secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`. **I will create a dedicated deploy key; tell me exactly what to add.**
   - Steps: `git fetch/reset`, `npm ci`, `prisma/drizzle migrate deploy`, `npm run build`, `pm2 reload a7-website`.
   - Build in a way that keeps the old version serving until the new build succeeds, for example build into a release directory and switch a symlink, or fail without restarting.
   - Include a documented rollback command.
5. **Sync job:** register a separate pm2 process or systemd timer for the integrations sync, for example `a7-website-sync`.
6. **nginx changes:** edit **only** `/etc/nginx/conf.d/a7-website.conf`.
   - Keep blocking the old paths. Allow `/admin` and `/api/admin`.
   - Add `client_max_body_size 50m` for uploads.
   - Optionally add `limit_req` on `/admin/login` and `/api/*`.
   - Serve `/uploads/` from disk with long cache headers.
   - Update `src/proxy.ts` to match: keep redirecting the old mock routes, and protect `/admin/**`.
7. Write a `docs/DEPLOYMENT.md` runbook covering: first-time setup steps, deploy, rollback, backups/restore, rotating secrets, and adding an admin user.

You (Claude Code on the web) probably can't SSH into the VPS from your sandbox. So:
- Put all server setup into **idempotent scripts** in `deploy/` (for example `deploy/setup-server.sh`, `deploy/nginx/a7-website.conf`, `deploy/docker-compose.db.yml`), plus the GitHub Actions workflow.
- Give me the exact one-time commands to run on the server. The scripts must check ports and existing resources before changing anything, and never touch the other apps.

**Admin URL:** use the path **`https://a7grouprealestate.com/admin`**. **No subdomain or DNS change is needed**, because nginx already proxies every path on the domain to the app. Only mention a subdomain such as `admin.a7grouprealestate.com` as an optional future change. It would need an IONOS A record plus a certbot certificate.

---

## 9. Phases and acceptance criteria

1. **Foundation:**
   - DB, ORM, migrations, real auth with roles, admin shell at `/admin` (reusing the dashboard UI components), media library.
   - Remove the fake auth and mock CRM routes.
   - Visual-regression baseline of the current public site.
   - *Done when:* login works, `/admin` is protected, and the baseline snapshots are committed.
2. **Global settings:** header, menu tree editor, footer, site settings, SEO defaults, all wired to the public layout.
   - *Done when:* changing a menu item or footer link in admin and clicking publish updates the live site, with no visual regressions.
3. **Page builder:** block registry for **every** existing section; seed migration from `content/*.ts`; page editor with add/edit/hide/duplicate/delete/reorder, draft/preview/publish and version history; generic brand blocks; catch-all CMS pages.
   - *Done when:* every existing page is DB-backed and pixel-identical to the baseline, and a brand-new page can be built from blocks and published without code.
4. **Collections:** projects (with theme colour), areas, developers, events, careers, services, news, testimonials, FAQs, hero slides, partner logos.
5. **Integrations:** Property Finder, Bayut and Bitrix24 adapters, normalisation, dedupe, scheduled and manual sync, overrides, Integrations admin screen. Listings and agents are rendered by the existing components.
6. **Leads:** all forms save to the DB, send email notifications, create Bitrix leads, and appear in the admin inbox.
7. **SEO and hardening:** metadata, sitemap, robots, JSON-LD, lint clean, tests, CI build.
8. **Deployment:** server scripts, DB container, backups, GitHub Actions deploy, nginx update, runbook. *Done when:* a push to `main` deploys automatically to https://a7grouprealestate.com and `/admin` works in production over HTTPS.

**General rules:**
- TypeScript strict; no `any` in new code; zod validation on every server action and API input.
- Keep the feature-sliced architecture and the ESLint layering rules. Add `src/features/cms` and `src/features/integrations`.
- No secrets in the repo.
- Don't change the public site's visual design. If something can't be made editable without a visual change, stop and ask me.
- At the end of each phase, summarise what changed, how to test it, and anything I need to provide (credentials, decisions).
