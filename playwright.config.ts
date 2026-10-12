import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.E2E_PORT ?? 3100)
const BASE_URL = `http://localhost:${PORT}`

/**
 * Playwright config. The `visual` projects capture visual-regression baselines
 * of the public site at desktop/tablet/mobile widths (see e2e/visual). The
 * baselines are the reference the DB-backed pages (Phase 3) must still match.
 *
 * Snapshots are platform-sensitive: generate and compare on the same OS +
 * Playwright version (CI runs ubuntu/linux, matching these committed `-linux`
 * baselines). Regenerate with `npm run test:e2e:update` if the environment
 * changes.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    reducedMotion: "reduce",
    // Allow pinning to a specific local Chromium build (e.g. a pre-installed one
    // in CI/sandbox). Leave unset to use Playwright's managed browser.
    launchOptions: process.env.PW_EXECUTABLE
      ? { executablePath: process.env.PW_EXECUTABLE }
      : {},
  },
  projects: [
    {
      name: "visual-desktop",
      testMatch: /visual\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "visual-tablet",
      testMatch: /visual\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "visual-mobile",
      testMatch: /visual\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "e2e",
      testMatch: /flows\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
})
