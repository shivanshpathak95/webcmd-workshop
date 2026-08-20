/**
 * UI strategy adapter — no API exists for this flow, so the agent must
 * drive the DOM directly through all three wizard steps using the page's
 * `data-testid` attributes as stable selectors.
 *
 * Requires the `playwright` dependency declared in this folder's
 * package.json.
 *
 * Usage:
 *   node server-wizard-ui.js --name prod-api-01 --region eu-west-1
 */

const { FRONTEND_URL, ok, fail, emit, parseArgs } = require("./_shared");

const manifest = {
  site: "webcmd-demo-hub",
  command: "server-wizard-ui",
  strategy: "UI",
  browserRequired: true,
  args: [
    { name: "name", required: true, description: "Instance name to type into step 1" },
    { name: "region", required: false, description: "Region to select in step 2, default us-east-1" },
    { name: "url", required: false, description: "Page to load, default the UI strategy page" },
  ],
  outputColumns: ["instanceName", "region", "created"],
  tags: ["demo", "wizard", "ui-automation"],
  keywords: ["multi-step form", "dom automation", "data-testid"],
};

async function run(args = {}) {
  const endpoint = "/strategies/ui";
  const pageUrl = args.url || `${FRONTEND_URL}${endpoint}`;
  const instanceName = args.name;
  const region = args.region || "us-east-1";

  if (!instanceName) return fail("UI", endpoint, "missing --name");

  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    return fail(
      "UI",
      endpoint,
      "playwright is not installed — run `npm install` in webcmd-adapters/ then `npx playwright install chromium`"
    );
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

    // Step 1: instance name
    await page.getByTestId("wizard-input-name").fill(instanceName);
    await page.getByTestId("wizard-next-btn").click();

    // Step 2: region
    await page.getByTestId("wizard-select-region").selectOption(region);
    await page.getByTestId("wizard-next-btn").click();

    // Step 3: review + submit
    await page.getByTestId("wizard-submit-btn").click();
    await page.getByTestId("wizard-success").waitFor({ timeout: 5000 });

    await browser.close();
    return ok("UI", endpoint, { instanceName, region, created: true });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    return fail("UI", endpoint, err);
  }
}

if (require.main === module) {
  run(parseArgs(process.argv.slice(2))).then(emit);
}

module.exports = { manifest, run };
