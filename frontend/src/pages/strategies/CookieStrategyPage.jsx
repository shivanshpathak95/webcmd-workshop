import { useEffect, useState } from "react";
import { Lock, User, KeyRound, CreditCard, Calendar, CheckCircle2, AlertTriangle, Eye } from "lucide-react";
import SplitPane from "../../components/SplitPane.jsx";
import CodeBlock from "../../components/CodeBlock.jsx";
import { STRATEGY_THEMES } from "../../theme.js";

const T = STRATEGY_THEMES.COOKIE;

/** Bridges the Guide pane to the Live Target on the right — what it shows,
 *  and exactly what to click to see the strategy play out. */
function LiveTargetNote({ children }) {
  return (
    <div className="rounded-lg border border-surface-600 bg-surface-900/60 p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <Eye size={14} className={T.icon} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${T.label}`}>Live Target — try it</span>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}

const INVOICE_STATUS_STYLES = {
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  upcoming: "border-slate-500/20 bg-slate-500/10 text-slate-400",
  due: "border-red-500/20 bg-red-500/10 text-red-400",
};

function UsageBar({ item }) {
  const pct = Math.min(100, Math.round((item.used / item.included) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-slate-400">{item.label}</span>
        <span className="tabular-nums text-slate-500">
          {item.used.toLocaleString()} / {item.included.toLocaleString()} {item.unit}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-700">
        <div
          className={`h-full rounded-full ${pct > 90 ? "bg-red-500" : "bg-amber-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BillingDashboardTarget() {
  const [billing, setBilling] = useState(null);
  const [needsLogin, setNeedsLogin] = useState(true);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBilling = async () => {
    try {
      const res = await fetch("/api/billing", { credentials: "include" });
      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }
      const data = await res.json();
      setBilling(data);
      setNeedsLogin(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Login failed (HTTP ${res.status})`);
      await fetchBilling();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-surface-700" />
        <div className="card h-24 animate-pulse" />
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div data-testid="billing-login-form" className="card max-w-sm animate-slideUp p-6">
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg border ${T.iconBox}`}>
          <Lock size={18} />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">Please Login</h3>
        <p className="mb-5 mt-1 text-sm text-slate-500">
          Sign in to view the Billing Dashboard. Any non-empty credentials work.
        </p>
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative">
            <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              data-testid="login-username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={`input-field pl-9 ${T.ring}`}
            />
          </div>
          <div className="relative">
            <KeyRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              data-testid="login-password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`input-field pl-9 ${T.ring}`}
            />
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertTriangle size={13} /> {error}
            </p>
          )}
          <button
            type="submit"
            data-testid="login-submit"
            disabled={loading}
            className={`btn-primary w-full ${T.button}`}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div data-testid="billing-dashboard" className="animate-slideUp space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Billing Dashboard</h3>
        <span className="pill border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={12} /> Authenticated
        </span>
      </div>

      <div className="card p-4">
        <p className="text-xs text-slate-500">Account</p>
        <p className="text-lg font-semibold text-slate-100">{billing.account}</p>
        <p className="mt-1 text-sm text-slate-400">Plan: {billing.plan}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-1.5 text-slate-500">
            <CreditCard size={13} className="text-amber-400/70" />
            <p className="text-xs">Current Balance</p>
          </div>
          <p className="text-2xl font-semibold tabular-nums text-slate-100">
            ${billing.currentBalance.toFixed(2)}
          </p>
        </div>
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-1.5 text-slate-500">
            <Calendar size={13} className="text-amber-400/70" />
            <p className="text-xs">Next Invoice</p>
          </div>
          <p className="text-2xl font-semibold text-slate-100">{billing.nextInvoiceDate}</p>
        </div>
      </div>

      <div>
        <p className="section-label mb-2">Usage This Cycle</p>
        <div className="card space-y-4 p-4">
          {billing.usage.map((item) => (
            <UsageBar key={item.label} item={item} />
          ))}
        </div>
      </div>

      <div>
        <p className="section-label mb-2">Recent Invoices</p>
        <div className="card divide-y divide-surface-700">
          {billing.invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-mono text-slate-300">{inv.id}</span>
              <span className="text-slate-500">{inv.date}</span>
              <span className="tabular-nums text-slate-200">${inv.amount.toFixed(2)}</span>
              <span className={`pill border ${INVOICE_STATUS_STYLES[inv.status] ?? INVOICE_STATUS_STYLES.paid}`}>
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Endpoint: <code className="font-mono text-slate-400">GET /api/billing</code>
      </p>
    </div>
  );
}

function CookieGuide() {
  return (
    <div className="space-y-6">
      <span className={`pill border ${T.pill}`}>Strategy 02</span>
      <h1 className="text-2xl font-bold text-slate-50">Authenticated Cookie Jars</h1>
      <p className="leading-relaxed text-slate-400">
        Most useful data sits behind a login. Re-authenticating on every
        single agent run is slow, brittle, and sometimes outright blocked
        (rate limits, MFA, CAPTCHAs). The{" "}
        <code className="text-slate-300">COOKIE</code> strategy fixes this
        with <code className="text-slate-300">--profile</code>: a named,
        persistent cookie jar. Log in once — by hand or via script — and
        every future run just replays the saved session cookie. No browser,
        no login form, no re-auth.
      </p>
      <p className="leading-relaxed text-slate-400">
        The dashboard on the right models exactly this: it 401s with no
        cookie, and returns real billing data once one is present.
      </p>

      <LiveTargetNote>
        The panel on the right is genuinely unauthenticated right now — it
        just got a real 401 from{" "}
        <code className="text-slate-300">GET /api/billing</code>. Type
        anything into the login form and submit: the server sets a real
        HTTP-only cookie, and the dashboard swaps to live billing data.
        Refresh this page afterward — you'll stay logged in, exactly like a
        webcmd <code className="text-slate-300">--profile</code> would.
      </LiveTargetNote>

      <h2 className="section-label">The adapter</h2>
      <p className="leading-relaxed text-slate-400">
        <code className="text-slate-300">webcmd-adapters/billing-cookie.js</code>{" "}
        splits into two subcommands — one that authenticates and writes the
        jar, one that only ever reads it:
      </p>
      <CodeBlock>{`# Run once — authenticates and saves the cookie to the "demo-user" jar
node webcmd-adapters/billing-cookie.js login \\
  --profile demo-user --username demo --password demo`}</CodeBlock>
      <CodeBlock>{`# Every run after — no login, just replays the saved cookie
node webcmd-adapters/billing-cookie.js billing --profile demo-user`}</CodeBlock>
      <p className="text-sm leading-relaxed text-slate-500">
        If the jar is missing or the session has expired, the adapter fails
        loudly with a clear next step instead of silently returning nothing:
      </p>
      <CodeBlock language="json">{`{
  "ok": false,
  "strategy": "COOKIE",
  "endpoint": "/api/billing",
  "data": null,
  "error": "no session for profile \\"demo-user\\" — run: login --profile demo-user first",
  "fetchedAt": "2026-08-21T00:00:00.000Z"
}`}</CodeBlock>
    </div>
  );
}

export default function CookieStrategyPage() {
  return <SplitPane theme="COOKIE" guide={<CookieGuide />} target={<BillingDashboardTarget />} />;
}
