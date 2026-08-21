/**
 * Shared helpers for all webcmd-adapters plugins.
 *
 * NOTE ON MANIFEST SCHEMA: webcmd's public docs (webcmd.dev/docs) describe
 * that a plugin manifest "includes the site, command name, args, output
 * columns, strategy, browser requirement, tags, and keywords" and that
 * results should "return JSON rows with stable keys, using null for missing
 * optional fields" — but do not publish the exact loader/manifest file
 * format. The shape below implements those documented fields faithfully;
 * once the real `webcmd` CLI is installed, run `webcmd doctor` /
 * `webcmd skills add` and diff this against whatever loader contract it
 * expects, then adjust the manifest export accordingly.
 */

const BACKEND_URL = process.env.WEBCMD_BACKEND_URL || "http://localhost:4000";
const FRONTEND_URL = process.env.WEBCMD_FRONTEND_URL || "http://localhost:5173";
const FETCH_TIMEOUT_MS = Number(process.env.WEBCMD_FETCH_TIMEOUT_MS || 10000);

/** Wrap a plugin result in the stable-keys JSON envelope. */
function ok(strategy, endpoint, data) {
  return { ok: true, strategy, endpoint, data, error: null, fetchedAt: nowIso() };
}

function fail(strategy, endpoint, error) {
  return { ok: false, strategy, endpoint, data: null, error: String(error?.message || error), fetchedAt: nowIso() };
}

function nowIso() {
  return new Date().toISOString();
}

/** Print a result to stdout as a single line of JSON and set exit code. */
function emit(result) {
  process.stdout.write(JSON.stringify(result) + "\n");
  process.exitCode = result.ok ? 0 : 1;
}

/** Fetch with timeout and clearer connection errors. */
async function fetchWithTimeout(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? FETCH_TIMEOUT_MS;
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
    return res;
  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      throw new Error(`request timed out after ${timeoutMs}ms: ${url}`);
    }
    if (err.cause?.code === "ECONNREFUSED" || err.code === "ECONNREFUSED") {
      throw new Error(`backend not reachable at ${url} — is the demo hub running? (npm run dev)`);
    }
    throw err;
  }
}

/** Resolve backend base URL from args or env. */
function resolveBackendUrl(args = {}) {
  return args["base-url"] || BACKEND_URL;
}

/** Minimal argv --flag value parser shared by all adapters. */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (tok.startsWith("--")) {
      const key = tok.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

module.exports = {
  BACKEND_URL,
  FRONTEND_URL,
  FETCH_TIMEOUT_MS,
  ok,
  fail,
  emit,
  fetchWithTimeout,
  resolveBackendUrl,
  parseArgs,
  nowIso,
};
