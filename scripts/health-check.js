#!/usr/bin/env node
/**
 * Quick pre-demo health check — backend API + frontend dev server.
 */

const BACKEND = process.env.WEBCMD_BACKEND_URL || "http://localhost:4000";
const FRONTEND = process.env.WEBCMD_FRONTEND_URL || "http://localhost:5173";

async function check(label, url, validate) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (validate) await validate(res);
    console.log(`✓ ${label}`);
    return true;
  } catch (err) {
    console.error(`✗ ${label}: ${err.message}`);
    return false;
  }
}

async function main() {
  const results = await Promise.all([
    check("backend /api/health", `${BACKEND}/api/health`, async (res) => {
      const body = await res.json();
      if (!body.ok) throw new Error("body.ok is not true");
    }),
    check("frontend dev server", FRONTEND),
  ]);

  if (!results.every(Boolean)) {
    process.exit(1);
  }
}

main();
