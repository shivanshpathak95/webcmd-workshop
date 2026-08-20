/**
 * INTERCEPT strategy adapter — opens a headless browser, but never touches
 * the DOM. It waits for the page's own async fetch to `/api/internal/tickets`
 * and captures that network response directly, which is far cheaper and
 * more robust than parsing the rendered <table>.
 *
 * Requires the `playwright` dependency declared in this folder's
 * package.json (`npm install` inside webcmd-adapters/ once, including
 * browser binaries via `npx playwright install chromium`).
 *
 * Usage:
 *   node tickets-intercept.js
 *   node tickets-intercept.js --url http://localhost:5173/strategies/intercept
 */

const { FRONTEND_URL, ok, fail, emit, parseArgs } = require("./_shared");

const manifest = {
  site: "webcmd-demo-hub",
  command: "tickets-intercept",
  strategy: "INTERCEPT",
  browserRequired: true,
  args: [{ name: "url", required: false, description: "Page to load, default the intercept strategy page" }],
  outputColumns: ["id", "subject", "priority", "status", "customer", "createdAt"],
  tags: ["demo", "tickets", "intercept", "network"],
  keywords: ["support tickets", "network interception", "headless browser"],
};

async function run(args = {}) {
  const endpoint = "/api/internal/tickets";
  const pageUrl = args.url || `${FRONTEND_URL}/strategies/intercept`;

  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    return fail(
      "INTERCEPT",
      endpoint,
      "playwright is not installed — run `npm install` in webcmd-adapters/ then `npx playwright install chromium`"
    );
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Race the target response against the page navigation instead of
    // scraping the DOM once "loaded" — this is the INTERCEPT strategy's
    // whole thesis: capture the wire payload, not the render.
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes(endpoint) && res.status() === 200,
      { timeout: 15000 }
    );

    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
    const response = await responsePromise;
    const tickets = await response.json();

    await browser.close();
    return ok("INTERCEPT", endpoint, tickets);
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    return fail("INTERCEPT", endpoint, err);
  }
}

if (require.main === module) {
  run(parseArgs(process.argv.slice(2))).then(emit);
}

module.exports = { manifest, run };
