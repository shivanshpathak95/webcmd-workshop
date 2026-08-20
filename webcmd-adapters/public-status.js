/**
 * PUBLIC strategy adapter — fetches /api/public/status directly over HTTP.
 *
 * The entire point of PUBLIC: no Playwright, no cookie jar, no DOM. Just an
 * unauthenticated GET, parsed straight into stable JSON. This is the
 * cheapest and fastest of the four strategies — always prefer it when an
 * endpoint is open.
 *
 * Usage:
 *   node public-status.js
 *   node public-status.js --base-url http://localhost:4000
 */

const { BACKEND_URL, ok, fail, emit, parseArgs } = require("./_shared");

const manifest = {
  site: "webcmd-demo-hub",
  command: "public-status",
  strategy: "PUBLIC",
  browserRequired: false,
  args: [{ name: "base-url", required: false, description: "Backend origin, default http://localhost:4000" }],
  outputColumns: ["cpuUsagePercent", "memoryUsagePercent", "uptimeSeconds", "activeConnections", "services", "region", "version"],
  tags: ["demo", "metrics", "public"],
  keywords: ["server status", "cpu", "memory", "uptime"],
};

async function run(args = {}) {
  const baseUrl = args["base-url"] || BACKEND_URL;
  const endpoint = "/api/public/status";
  try {
    const res = await fetch(baseUrl + endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return ok("PUBLIC", endpoint, {
      cpuUsagePercent: body.metrics?.cpuUsagePercent ?? null,
      memoryUsagePercent: body.metrics?.memoryUsagePercent ?? null,
      uptimeSeconds: body.metrics?.uptimeSeconds ?? null,
      activeConnections: body.metrics?.activeConnections ?? null,
      services: body.services ?? [],
      region: body.region ?? null,
      version: body.version ?? null,
    });
  } catch (err) {
    return fail("PUBLIC", endpoint, err);
  }
}

if (require.main === module) {
  run(parseArgs(process.argv.slice(2))).then(emit);
}

module.exports = { manifest, run };
