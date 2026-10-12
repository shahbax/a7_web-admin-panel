import { test, expect, type Page } from "@playwright/test"

/**
 * Visual-regression baseline of the public site. Captured while the site is
 * still backed by the hard-coded content/mock data. After the Phase 3 CMS
 * migration, the DB-backed pages must still match these snapshots (that is the
 * "pixel-identical" acceptance check).
 *
 * Images are stubbed with a fixed pixel so snapshots do not depend on external
 * image hosts (Unsplash/pravatar) or the Next image optimiser being reachable.
 * The migration changes data plumbing, not layout or image URLs, so stubbing
 * identically on both sides keeps the comparison meaningful and deterministic.
 */

// 1x1 transparent PNG.
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
)

async function stubImages(page: Page): Promise<void> {
  await page.route(/\/_next\/image\?/, (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PIXEL }),
  )
  await page.route(/(images\.unsplash\.com|i\.pravatar\.cc)/, (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PIXEL }),
  )
}

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle").catch(() => {})
  // Scroll through the page to trigger lazy-loaded sections, then return to top.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let y = 0
        const step = () => {
          window.scrollTo(0, y)
          y += window.innerHeight
          if (y < document.body.scrollHeight) {
            requestAnimationFrame(step)
          } else {
            window.scrollTo(0, 0)
            resolve()
          }
        }
        step()
      }),
  )
  await page.waitForTimeout(500)
}

const ROUTES: { path: string; name: string }[] = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/properties", name: "properties" },
  { path: "/agents", name: "agents" },
  { path: "/areas", name: "areas" },
  { path: "/developers", name: "developers" },
  { path: "/developers/emaar", name: "developer-detail-emaar" },
  { path: "/events", name: "events" },
  { path: "/events/cityscape-dubai-2026", name: "event-detail-cityscape" },
  { path: "/career", name: "career" },
  { path: "/sell-property", name: "sell-property" },
  { path: "/services", name: "services" },
  { path: "/services/conveyancing", name: "services-conveyancing" },
  { path: "/services/list-your-property", name: "services-list-your-property" },
  { path: "/services/mortgages", name: "services-mortgages" },
  { path: "/services/plots", name: "services-plots" },
  { path: "/services/property-management", name: "services-property-management" },
  { path: "/services/property-snagging", name: "services-property-snagging" },
  { path: "/services/short-term-rentals", name: "services-short-term-rentals" },
]

for (const route of ROUTES) {
  test(`public page: ${route.name}`, async ({ page }) => {
    await stubImages(page)
    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" })
    expect(response?.ok(), `expected ${route.path} to load`).toBeTruthy()
    await settle(page)
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true })
  })
}
