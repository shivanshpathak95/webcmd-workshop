#!/usr/bin/env node
/**
 * Smoke test all four workshop adapters against a running stack.
 * Requires backend + frontend to be up (npm run dev).
 */

const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ADAPTERS = path.join(ROOT, "webcmd-adapters");

const COMMANDS = [
  ["public-status.js"],
  ["billing-cookie.js", "login", "--profile", "demo-user", "--username", "demo", "--password", "demo"],
  ["billing-cookie.js", "billing", "--profile", "demo-user"],
  ["tickets-intercept.js"],
  ["server-wizard-ui.js", "--name", "verify-demo", "--region", "eu-west-1"],
];

function runAdapter(args) {
  const label = `node ${args.join(" ")}`;
  const result = spawnSync("node", args, {
    cwd: ADAPTERS,
    encoding: "utf8",
    timeout: 60000,
  });

  if (result.error) {
    console.error(`✗ ${label}: ${result.error.message}`);
    return false;
  }

  const stdout = (result.stdout || "").trim();
  let parsed;
  try {
    parsed = JSON.parse(stdout.split("\n").pop());
  } catch {
    console.error(`✗ ${label}: invalid JSON on stdout`);
    if (result.stderr) console.error(result.stderr);
    return false;
  }

  if (!parsed.ok) {
    console.error(`✗ ${label}: ${parsed.error || "ok=false"}`);
    return false;
  }

  console.log(`✓ ${label}`);
  return true;
}

async function main() {
  const health = spawnSync("node", [path.join(__dirname, "health-check.js")], {
    encoding: "utf8",
    stdio: "inherit",
  });
  if (health.status !== 0) {
    console.error("\nHealth check failed — start the stack with: npm run dev");
    process.exit(1);
  }

  console.log("\nRunning adapters…\n");
  let passed = 0;
  for (const args of COMMANDS) {
    if (runAdapter(args)) passed++;
  }

  console.log(`\n${passed}/${COMMANDS.length} adapters passed`);
  process.exit(passed === COMMANDS.length ? 0 : 1);
}

main();
