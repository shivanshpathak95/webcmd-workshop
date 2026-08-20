/**
 * COOKIE strategy adapter — `--profile demo-user` acts as a persistent
 * cookie jar so the agent authenticates once and never sees a login screen
 * again.
 *
 * Two subcommands:
 *   node billing-cookie.js login   --profile demo-user --username demo --password demo
 *   node billing-cookie.js billing --profile demo-user
 *
 * `login` performs the real POST /api/login, captures the Set-Cookie header,
 * and writes it to a per-profile jar file. `billing` reads that jar and
 * replays the cookie on GET /api/billing — no browser, no re-auth.
 *
 * Jar location defaults to ./.profiles/<profile>.json next to this file.
 * Point WEBCMD_PROFILE_DIR at the real webcmd profile directory once the
 * CLI is installed, if its on-disk layout differs.
 */

const fs = require("fs");
const path = require("path");
const { BACKEND_URL, ok, fail, emit, parseArgs } = require("./_shared");

const PROFILE_DIR = process.env.WEBCMD_PROFILE_DIR || path.join(__dirname, ".profiles");

const manifest = {
  site: "webcmd-demo-hub",
  command: "billing-cookie",
  strategy: "COOKIE",
  browserRequired: false,
  args: [
    { name: "profile", required: true, description: "Cookie jar profile name, e.g. demo-user" },
    { name: "username", required: false, description: "login subcommand only" },
    { name: "password", required: false, description: "login subcommand only" },
  ],
  outputColumns: ["account", "plan", "currentBalance", "nextInvoiceDate", "usage", "invoices"],
  tags: ["demo", "billing", "cookie", "auth"],
  keywords: ["billing dashboard", "login", "session", "profile"],
};

function jarPath(profile) {
  return path.join(PROFILE_DIR, `${profile}.json`);
}

function readJar(profile) {
  try {
    return JSON.parse(fs.readFileSync(jarPath(profile), "utf8"));
  } catch {
    return null;
  }
}

function writeJar(profile, jar) {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  fs.writeFileSync(jarPath(profile), JSON.stringify(jar, null, 2));
}

/** Extract just the `name=value` pair from a Set-Cookie header, dropping attrs. */
function extractCookiePair(setCookieHeader) {
  return setCookieHeader.split(";")[0];
}

async function login(args) {
  const endpoint = "/api/login";
  const profile = args.profile;
  if (!profile) return fail("COOKIE", endpoint, "missing --profile");

  try {
    const res = await fetch(BACKEND_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: args.username || "demo", password: args.password || "demo" }),
    });
    const setCookie = res.headers.get("set-cookie");
    if (!res.ok || !setCookie) throw new Error(`login failed: HTTP ${res.status}`);

    writeJar(profile, { profile, cookie: extractCookiePair(setCookie), savedAt: new Date().toISOString() });
    return ok("COOKIE", endpoint, { profile, loggedIn: true });
  } catch (err) {
    return fail("COOKIE", endpoint, err);
  }
}

async function billing(args) {
  const endpoint = "/api/billing";
  const profile = args.profile;
  if (!profile) return fail("COOKIE", endpoint, "missing --profile");

  const jar = readJar(profile);
  if (!jar?.cookie) {
    return fail("COOKIE", endpoint, `no session for profile "${profile}" — run: login --profile ${profile} first`);
  }

  try {
    const res = await fetch(BACKEND_URL + endpoint, {
      headers: { Cookie: jar.cookie },
    });
    if (res.status === 401) {
      return fail("COOKIE", endpoint, `session expired for profile "${profile}" — re-run login`);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return ok("COOKIE", endpoint, {
      account: body.account ?? null,
      plan: body.plan ?? null,
      currentBalance: body.currentBalance ?? null,
      nextInvoiceDate: body.nextInvoiceDate ?? null,
      usage: body.usage ?? [],
      invoices: body.invoices ?? [],
    });
  } catch (err) {
    return fail("COOKIE", endpoint, err);
  }
}

async function run(argv) {
  const [subcommand, ...rest] = argv;
  const args = parseArgs(rest);
  if (subcommand === "login") return login(args);
  if (subcommand === "billing") return billing(args);
  return fail("COOKIE", "/api/billing", `unknown subcommand "${subcommand}" — use "login" or "billing"`);
}

if (require.main === module) {
  run(process.argv.slice(2)).then(emit);
}

module.exports = { manifest, login, billing, run };
