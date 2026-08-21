/**
 * Webcmd Interactive Demo Hub — Backend
 *
 * A single Express server that powers the four "Live Target" strategy demos:
 *   1. PUBLIC     -> GET  /api/public/status
 *   2. COOKIE     -> POST /api/login, GET /api/billing
 *   3. INTERCEPT  -> GET  /api/internal/tickets
 *   4. UI         -> (no dedicated API; the wizard is pure client-side DOM)
 *
 * All data is mock/in-memory. No real database.
 */

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// --- Middleware -------------------------------------------------------

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true, // required so the browser sends/receives cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// --- 1. PUBLIC strategy: GET /api/public/status -----------------------
// Returns mock server metrics. No auth required — this is the whole point
// of the PUBLIC strategy: an agent can hit this directly with a fetch/curl,
// no browser automation needed.

const rand = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;

app.get("/api/public/status", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    // A real infra status page reports per-service health, not one blob of
    // numbers — this is what makes the PUBLIC endpoint worth fetching.
    services: [
      { name: "API Gateway", status: "operational", latencyMs: rand(18, 42), region: "us-east-1" },
      { name: "Postgres Primary", status: "operational", latencyMs: rand(3, 9), region: "us-east-1" },
      { name: "Redis Cache", status: "operational", latencyMs: rand(1, 3), region: "us-east-1" },
      {
        name: "CDN Edge",
        status: Math.random() > 0.92 ? "degraded" : "operational",
        latencyMs: rand(8, 20),
        region: "global",
      },
    ],
    metrics: {
      cpuUsagePercent: Math.round((Math.random() * 40 + 10) * 10) / 10,
      memoryUsagePercent: Math.round((Math.random() * 50 + 20) * 10) / 10,
      uptimeSeconds: 128473,
      activeConnections: Math.floor(Math.random() * 200) + 50,
    },
    region: "us-east-1",
    version: "1.4.2",
  });
});

// --- 2. COOKIE strategy: POST /api/login, GET /api/billing ------------
// POST /api/login sets a dummy HTTP-only cookie simulating an authenticated
// session. GET /api/billing checks for that cookie: 401 if missing, mock
// financial data if present. This models how a `--profile demo-user`
// cookie jar lets an agent skip re-authenticating on every run.

const SESSION_COOKIE_NAME = "webcmd_demo_session";

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  // Any non-empty credentials succeed — this is a mock login.
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  res.cookie(SESSION_COOKIE_NAME, "demo-session-token-abc123", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1 hour
  });

  res.json({ success: true, message: `Logged in as ${username}` });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME);
  res.json({ success: true, message: "Logged out" });
});

app.get("/api/billing", (req, res) => {
  const sessionCookie = req.cookies?.[SESSION_COOKIE_NAME];

  if (!sessionCookie) {
    return res.status(401).json({ error: "Not authenticated. Please log in first." });
  }

  res.json({
    account: "Northwind Traders, Inc.",
    plan: "Pro",
    currentBalance: 482.19,
    nextInvoiceDate: "2026-09-01",
    // Real SaaS billing is usage-based, not just a flat number — this is
    // the kind of breakdown an agent would actually need to reconcile.
    usage: [
      { label: "API Requests", used: 842311, included: 1000000, unit: "req" },
      { label: "Storage", used: 128, included: 250, unit: "GB" },
      { label: "Bandwidth", used: 340, included: 500, unit: "GB" },
    ],
    invoices: [
      { id: "inv_1050", date: "2026-09-01", amount: 199.0, status: "upcoming" },
      { id: "inv_1041", date: "2026-08-01", amount: 199.0, status: "paid" },
      { id: "inv_1032", date: "2026-07-01", amount: 199.0, status: "paid" },
      { id: "inv_1023", date: "2026-06-01", amount: 214.5, status: "paid" },
    ],
    paymentMethod: { brand: "visa", last4: "4242" },
  });
});

// --- 3. INTERCEPT strategy: GET /api/internal/tickets ------------------
// Simulates a "hidden" internal endpoint that a React table fetches on
// mount. An agent intercepting network traffic can grab this JSON directly
// instead of scraping the rendered DOM table.

const MOCK_TICKETS = [
  { id: "TCK-2041", subject: "MFA reset stuck: locked out of admin console", priority: "high", status: "open", customer: "sarah.chen@northwind.io", assignee: "Maria Alva", tags: ["auth", "mfa"], createdAt: "2026-08-20T09:15:00Z" },
  { id: "TCK-2040", subject: "Invoice inv_1023 double-charged card ending 4242", priority: "medium", status: "open", customer: "b.okafor@meridianhealth.com", assignee: "Devon Ruiz", tags: ["billing"], createdAt: "2026-08-19T14:32:00Z" },
  { id: "TCK-2039", subject: "Bulk /export endpoint returns 500 above 10k rows", priority: "critical", status: "in_progress", customer: "platform@fintra.dev", assignee: "Maria Alva", tags: ["api", "bug"], createdAt: "2026-08-19T16:02:00Z" },
  { id: "TCK-2038", subject: "Feature request: CSV export for usage report", priority: "low", status: "open", customer: "sam.iyer@brightloop.co", assignee: null, tags: ["feature-request"], createdAt: "2026-08-20T08:45:00Z" },
  { id: "TCK-2037", subject: "Dashboard takes 12s+ to load with 50+ team seats", priority: "medium", status: "resolved", customer: "ops@northwind.io", assignee: "Devon Ruiz", tags: ["performance"], createdAt: "2026-08-15T11:20:00Z" },
  { id: "TCK-2036", subject: "SSO login loop after SAML metadata rotation", priority: "high", status: "in_progress", customer: "it-admin@meridianhealth.com", assignee: "Priya Nair", tags: ["auth", "sso"], createdAt: "2026-08-20T19:10:00Z" },
  { id: "TCK-2035", subject: "Webhook retries not respecting exponential backoff", priority: "medium", status: "open", customer: "dev@fintra.dev", assignee: "Priya Nair", tags: ["api", "webhooks"], createdAt: "2026-08-18T10:05:00Z" },
  { id: "TCK-2034", subject: "Cannot downgrade from Pro to Starter plan", priority: "low", status: "resolved", customer: "finance@brightloop.co", assignee: "Devon Ruiz", tags: ["billing"], createdAt: "2026-08-14T13:40:00Z" },
  { id: "TCK-2033", subject: "Rate limit hit during nightly sync job", priority: "critical", status: "open", customer: "platform@fintra.dev", assignee: null, tags: ["api", "rate-limit"], createdAt: "2026-08-21T02:12:00Z" },
  { id: "TCK-2032", subject: "Support widget not loading on Safari 17", priority: "low", status: "in_progress", customer: "sarah.chen@northwind.io", assignee: "Maria Alva", tags: ["ui", "browser"], createdAt: "2026-08-17T15:50:00Z" },
];

app.get("/api/internal/tickets", (req, res) => {
  res.json(MOCK_TICKETS);
});

// --- Health check -------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// --- Start ---------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Webcmd Demo Hub backend listening on http://localhost:${PORT}`);
});
