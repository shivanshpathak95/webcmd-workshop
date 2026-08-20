import { useEffect, useState } from "react";
import { Cpu, MemoryStick, Activity, Clock, RefreshCw, AlertTriangle, Eye } from "lucide-react";
import SplitPane from "../../components/SplitPane.jsx";
import CodeBlock from "../../components/CodeBlock.jsx";
import { STRATEGY_THEMES } from "../../theme.js";

const T = STRATEGY_THEMES.PUBLIC;

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

const METRICS = [
  { key: "cpuUsagePercent", label: "CPU Usage", icon: Cpu, suffix: "%" },
  { key: "memoryUsagePercent", label: "Memory Usage", icon: MemoryStick, suffix: "%" },
  { key: "activeConnections", label: "Active Connections", icon: Activity, suffix: "" },
  { key: "uptimeSeconds", label: "Uptime", icon: Clock, suffix: "h", transform: (v) => Math.floor(v / 3600) },
];

function MetricSkeleton() {
  return (
    <div className="card p-4">
      <div className="mb-3 h-3 w-20 animate-pulse rounded bg-surface-700" />
      <div className="h-7 w-14 animate-pulse rounded bg-surface-700" />
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <div className="card divide-y divide-surface-700">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-surface-700" />
          <div className="h-3 flex-1 animate-pulse rounded bg-surface-700" />
        </div>
      ))}
    </div>
  );
}

function ServicesList({ services }) {
  return (
    <div className="card divide-y divide-surface-700">
      {services.map((svc) => {
        const isUp = svc.status === "operational";
        return (
          <div key={svc.name} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2 w-2 flex-none rounded-full ${
                  isUp ? "bg-emerald-400" : "bg-amber-400 animate-pulseDot"
                }`}
              />
              <span className="text-sm text-slate-200">{svc.name}</span>
              <span className="font-mono text-[10px] text-slate-600">{svc.region}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tabular-nums text-slate-500">{svc.latencyMs}ms</span>
              <span
                className={`pill border ${
                  isUp
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                }`}
              >
                {svc.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ServerStatusTarget() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/public/status");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus(data);
      setError(null);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-testid="server-status-panel" className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Server Status</h3>
        <button
          onClick={fetchStatus}
          data-testid="refresh-status-btn"
          className="btn-secondary py-1.5 text-xs hover:border-sky-500/40 hover:text-sky-300"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin text-sky-400" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400" data-testid="status-error">
          <AlertTriangle size={15} />
          Failed to fetch: {error}
        </div>
      )}

      <div data-testid="status-services">
        <p className="section-label mb-2">Services</p>
        {!status && !error ? <ServicesSkeleton /> : status && <ServicesList services={status.services} />}
      </div>

      <p className="section-label mb-2">Resource Metrics</p>
      <div className="grid grid-cols-2 gap-3" data-testid="status-metrics">
        {!status && !error
          ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
          : status &&
            METRICS.map((m) => {
              const raw = status.metrics[m.key];
              const value = m.transform ? m.transform(raw) : raw;
              return (
                <div key={m.key} className="card card-hover p-4 hover:border-sky-500/30 hover:shadow-sky-500/10">
                  <div className="mb-2 flex items-center gap-1.5 text-slate-500">
                    <m.icon size={13} className="text-sky-400/70" />
                    <p className="text-xs">{m.label}</p>
                  </div>
                  <p className="text-2xl font-semibold tabular-nums text-slate-100">
                    {value}
                    <span className="text-base text-slate-500">{m.suffix}</span>
                  </p>
                </div>
              );
            })}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <code className="font-mono text-slate-400">GET /api/public/status</code>
        {lastFetched && <span>· updated {lastFetched.toLocaleTimeString()}</span>}
      </p>
    </div>
  );
}

function PublicGuide() {
  return (
    <div className="space-y-6">
      <span className={`pill border ${T.pill}`}>Strategy 01</span>
      <h1 className="text-2xl font-bold text-slate-50">Public Bypass</h1>
      <p className="leading-relaxed text-slate-400">
        Some data doesn't need a login and doesn't need a rendered page —
        it's just an open HTTP endpoint wearing a UI as a courtesy. The{" "}
        <code className="text-slate-300">PUBLIC</code> strategy skips the
        browser entirely: no Playwright instance to boot, no DOM to wait on,
        no CSS selectors to keep in sync with a redesign. Just a plain fetch
        straight to the endpoint, parsed into stable JSON.
      </p>
      <p className="leading-relaxed text-slate-400">
        This is the cheapest of the four strategies by a wide margin —
        always reach for it first before assuming you need a browser at all.
      </p>

      <LiveTargetNote>
        The panel on the right is a real infra status page, backed by the
        same Express server — not a screenshot. It auto-refreshes every 4
        seconds straight from <code className="text-slate-300">GET /api/public/status</code>.
        Hit <span className="font-medium text-slate-300">Refresh</span> to
        force an immediate re-fetch and watch the CPU/memory numbers and
        service latencies change on demand.
      </LiveTargetNote>

      <h2 className="section-label">The adapter</h2>
      <p className="leading-relaxed text-slate-400">
        <code className="text-slate-300">webcmd-adapters/public-status.js</code>{" "}
        does exactly this: one <code className="text-slate-300">fetch()</code>{" "}
        call, no auth, no session state.
      </p>
      <CodeBlock>node webcmd-adapters/public-status.js</CodeBlock>
      <p className="text-sm leading-relaxed text-slate-500">
        Returns a single line of stable-keyed JSON — same shape whether the
        call succeeds or fails:
      </p>
      <CodeBlock language="json">{`{
  "ok": true,
  "strategy": "PUBLIC",
  "endpoint": "/api/public/status",
  "data": {
    "cpuUsagePercent": 18.2,
    "memoryUsagePercent": 47.9,
    "uptimeSeconds": 128473,
    "activeConnections": 165,
    "services": [
      { "name": "API Gateway", "status": "operational", "latencyMs": 24 },
      { "name": "Postgres Primary", "status": "operational", "latencyMs": 6 }
    ],
    "region": "us-east-1",
    "version": "1.4.2"
  },
  "error": null,
  "fetchedAt": "2026-08-21T00:00:00.000Z"
}`}</CodeBlock>
    </div>
  );
}

export default function PublicStrategyPage() {
  return <SplitPane theme="PUBLIC" guide={<PublicGuide />} target={<ServerStatusTarget />} />;
}
