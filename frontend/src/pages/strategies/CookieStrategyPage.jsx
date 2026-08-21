import { useEffect, useState } from "react";
import { Lock, User, KeyRound, CreditCard, Calendar, CheckCircle2, AlertTriangle, LogOut } from "lucide-react";
import SplitPane from "../../components/SplitPane.jsx";
import CodeBlock from "../../components/CodeBlock.jsx";
import LiveTargetNote from "../../components/LiveTargetNote.jsx";
import ExpectedOutputPanel from "../../components/ExpectedOutputPanel.jsx";
import StrategyNavFooter from "../../components/StrategyNavFooter.jsx";
import { STRATEGY_THEMES } from "../../theme.js";

const T = STRATEGY_THEMES.COOKIE;

const INVOICE_STATUS_STYLES = {
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  upcoming: "border-slate-500/20 bg-slate-500/10 text-muted",
  due: "border-red-500/20 bg-red-500/10 text-red-400",
};

function UsageBar({ item }) {
  const pct = Math.min(100, Math.round((item.used / item.included) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted">{item.label}</span>
        <span className="tabular-nums text-ink0">
          {item.used.toLocaleString()} / {item.included.toLocaleString()} {item.unit}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
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
  const [form, setForm] = useState({ username: "demo", password: "demo" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBilling = async () => {
    try {
      const res = await fetch("/api/billing", { credentials: "include" });
      if (res.status === 401) {
        setNeedsLogin(true);
        setBilling(null);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setBilling(data);
      setNeedsLogin(false);
      setError(null);
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
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Login failed (HTTP ${res.status})`);
      }
      setChecking(true);
      await fetchBilling();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/logout", { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error(`Logout failed (HTTP ${res.status})`);
      setBilling(null);
      setNeedsLogin(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking && !billing && !error) {
    return (
      <div data-testid="billing-loading" className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-elevated" />
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
        <h3 className="text-lg font-semibold text-ink">Please Login</h3>
        <p className="mb-5 mt-1 text-sm text-ink0">
          Sign in to view the Billing Dashboard. Pre-filled with <code className="text-muted">demo</code> /{" "}
          <code className="text-muted">demo</code>.
        </p>
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative">
            <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink0" />
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
            <KeyRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink0" />
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
            <p data-testid="login-error" className="flex items-center gap-1.5 text-sm text-red-400">
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-ink">Billing Dashboard</h3>
        <div className="flex items-center gap-2">
          <span className="pill border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={12} /> Authenticated
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            data-testid="billing-logout-btn"
            className="btn-secondary py-1.5 text-xs"
          >
            <LogOut size={13} />
            Log out
          </button>
        </div>
      </div>

      {error && (
        <p data-testid="login-error" className="flex items-center gap-1.5 text-sm text-red-400">
          <AlertTriangle size={13} /> {error}
        </p>
      )}

      <div className="card p-4" data-testid="billing-account">
        <p className="text-xs text-ink0">Account</p>
        <p className="text-lg font-semibold text-ink">{billing.account}</p>
        <p className="mt-1 text-sm text-muted">Plan: {billing.plan}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-1.5 text-ink0">
            <CreditCard size={13} />
            <p className="text-xs">Current Balance</p>
          </div>
          <p data-testid="billing-balance" className="text-2xl font-semibold tabular-nums text-ink">
            ${billing.currentBalance.toFixed(2)}
          </p>
        </div>
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-1.5 text-ink0">
            <Calendar size={13} />
            <p className="text-xs">Next Invoice</p>
          </div>
          <p className="text-2xl font-semibold text-ink">{billing.nextInvoiceDate}</p>
        </div>
      </div>

      {billing.paymentMethod && (
        <div className="card p-4" data-testid="payment-method">
          <p className="text-xs text-ink0">Payment method</p>
          <p className="mt-1 text-sm capitalize text-ink">
            {billing.paymentMethod.brand} ending in {billing.paymentMethod.last4}
          </p>
        </div>
      )}

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
        <div className="card divide-y divide-line">
          {billing.invoices.map((inv) => (
            <div key={inv.id} data-testid={`invoice-row-${inv.id}`} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-mono text-muted">{inv.id}</span>
              <span className="text-ink0">{inv.date}</span>
              <span className="tabular-nums text-ink">${inv.amount.toFixed(2)}</span>
              <span className={`pill border ${INVOICE_STATUS_STYLES[inv.status] ?? INVOICE_STATUS_STYLES.paid}`}>
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink0">
        Endpoint: <code className="font-mono text-muted">GET /api/billing</code>
      </p>
    </div>
  );
}

function CookieGuide() {
  return (
    <div className="space-y-6">
      <span className={`pill border ${T.pill}`}>Strategy 02</span>
      <h1 className="text-2xl font-bold text-ink">Authenticated Cookie Jars</h1>
      <p className="leading-relaxed text-muted">
        Most useful data sits behind a login. Re-authenticating on every
        single agent run is slow, brittle, and sometimes outright blocked
        (rate limits, MFA, CAPTCHAs). The{" "}
        <code className="text-muted">COOKIE</code> strategy fixes this
        with <code className="text-muted">--profile</code>: a named,
        persistent cookie jar. Log in once, by hand or via script, and
        every future run just replays the saved session cookie. No browser,
        no login form, no re-auth.
      </p>

      <LiveTargetNote theme="COOKIE">
        The panel on the right is genuinely unauthenticated right now. It
        just got a real 401 from{" "}
        <code className="text-muted">GET /api/billing</code>. Submit the
        pre-filled login form: the server sets a real HTTP-only cookie, and
        the dashboard swaps to live billing data. Use{" "}
        <span className="font-medium text-muted">Log out</span> to reset
        without opening an incognito window.
      </LiveTargetNote>

      <h2 className="section-label">The adapter</h2>
      <CodeBlock>{`node webcmd-adapters/billing-cookie.js login \\
  --profile demo-user --username demo --password demo

node webcmd-adapters/billing-cookie.js billing --profile demo-user`}</CodeBlock>

      <ExpectedOutputPanel>{`{
  "ok": true,
  "strategy": "COOKIE",
  "endpoint": "/api/billing",
  "data": {
    "account": "Northwind Traders, Inc.",
    "plan": "Pro",
    "currentBalance": 482.19,
    "nextInvoiceDate": "2026-09-01",
    "usage": [...],
    "invoices": [...]
  },
  "error": null,
  "fetchedAt": "..."
}`}</ExpectedOutputPanel>

      <StrategyNavFooter />
    </div>
  );
}

export default function CookieStrategyPage() {
  return <SplitPane theme="COOKIE" guide={<CookieGuide />} target={<BillingDashboardTarget />} />;
}
