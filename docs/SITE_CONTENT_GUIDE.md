# Making a coded page editable ("Website content")

Every public page keeps its existing components and layout. Only the **data** the
components receive moves behind the CMS: code defaults (today's `content/*.ts`,
mocks) are the fallback, and admin edits stored in `content_docs` are deep-merged
over them. A page must render **identically** until someone edits it.

Reference implementation: the About page.
- Definition: `src/features/about/content/cms-content.ts`
- Loader: `src/features/about/services/about-content.ts`
- Route + page: `src/app/(public)/about/page.tsx`, `src/features/about/pages/about-page.tsx`
- UI takes `content` + `layout` props: `src/features/about/ui/about/about-page.tsx`
- Registered in `src/features/cms/site-content/definitions.ts`

Core API (`src/features/cms/site-content/`):
- `service.ts` (server-only): `getPageContent(key)` → `{ content, layout }`, `getContent(key)`,
  `getContentList(key)`, `getContentItem(key, id)`, `getContentItemIds(key)`.
- `core/sections.ts`: `renderSections(layout, { sectionKey: <Component/> })`.
- `core/types.ts`: `SingleContentDefinition`, `ListContentDefinition`.
- `core/hints.ts`: `selectFromKeys(map)`, `MARKETING_ICON_HINT`, `SERVICE_ICON_HINT`.

## Recipe for a single page

1. In `src/features/<feature>/content/cms-content.ts` export a defaults factory that
   gathers **everything the page renders that is content** (texts, images, buttons,
   lists, FAQ, SEO title/description) from the existing content files — reuse the
   existing objects, don't copy text. Export `type XContent = ReturnType<typeof getXDefaults>`
   and an array `xContentDefinitions` of definitions:
   ```ts
   { key: "page.<name>", kind: "single", label, group, previewPath, defaults, sections?, hints? }
   ```
   Groups: "Home" | "Pages" | "Services" | "Directories" | "Projects" | "Shared".
2. Loader in `src/features/<feature>/services/<x>-content.ts` (`import "server-only"`)
   calling `getPageContent<XContent>("page.<name>")`. Re-export the type from here,
   because UI files may NOT import `@/features/*/content/**` (ESLint rule) — UI
   imports types from `services/`.
3. Page component in `pages/` becomes `async`, loads content and passes it down as
   props. Metadata becomes `generateMetadata` built from `content.seo`; update the
   route file in `src/app/(public)/...` to `export const generateMetadata = ...`
   (route files may import only `@/features/<x>` or `@/features/<x>/pages/**`).
4. UI components: replace direct imports of content constants with props. Keep
   every className, animation and structure exactly as is.
5. Sections: if the page is a sequence of sections, declare `sections` and render
   via `renderSections(layout, {...})` with the default order equal to today's order.
   Pages on `ServiceMarketingPageLayout` just pass `layout` and use
   `SERVICE_MARKETING_SECTIONS` (filter out keys the page doesn't render).
6. Register the definitions array in `src/features/cms/site-content/definitions.ts`.

## Recipe for a directory (list + detail pages)

Use `kind: "list"` with `defaults: () => items[]`, `idField` (the URL id/slug),
`titleField`, `itemPath`. Each item must contain everything its detail page needs
(merge per-id lookups from several static files into one item object). Detail
pages use `getContentItem(key, id)` → `notFound()` when missing;
`generateStaticParams` uses `getContentItemIds(key)`; keep `dynamicParams` default
(true) so admin-added items work. List pages derive cards from the same items.
Page-level texts of the list page (hero, FAQ, SEO) go in a separate
`kind: "single"` definition.

## Rules

- **Never change visuals.** Same components, classNames, order, animations.
- Non-JSON values (React components, icon components, functions) cannot be
  edited; they stay in code and are re-attached by the merge. If an item picks an
  icon by string key, add a `select` hint so admins can only choose valid keys.
- Fields named `headingId`, `kind`, `variant`, `icon`, `className`, `breadcrumbs`
  and `*Id` are hidden by default; add hints to expose/label fields as needed.
- Don't touch property **listing** data (`features/property/core/data/**`,
  listing cards, `/properties/[id]` listing details) — listings will come from Bitrix.
- Keep `npx tsc --noEmit` and `npx eslint <your files>` clean.
