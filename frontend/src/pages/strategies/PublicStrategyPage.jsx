import { useEffect, useState } from "react";
import { Cpu, MemoryStick, Activity, Clock, RefreshCw, AlertTriangle, LogOut } from "lucide-react";
import SplitPane from "../../components/SplitPane.jsx";
import CodeBlock from "../../components/CodeBlock.jsx";
import LiveTargetNote from "../../components/LiveTargetNote.jsx";
import ExpectedOutputPanel from "../../components/ExpectedOutputPanel.jsx";
import StrategyNavFooter from "../../components/StrategyNavFooter.jsx";
import { STRATEGY_THEMES } from "../../theme.js";

const T = STRATEGY_THEMES.PUBLIC;

const METRICS = [
  { key: "cpuUsagePercent", label: "CPU Usage", icon: Cpu, suffix: "%", testId: "metric-cpu" },
  { key: "memoryUsagePercent", label: "Memory Usage", icon: MemoryStick, suffix: "%", testId: "metric-memory" },
  { key: "activeConnections", label: "Active Connections", icon: Activity, suffix: "", testId: "metric-connections" },
  { key: "uptimeSeconds", label: "Uptime", icon: Clock, suffix: "h", testId: "metric-uptime", transform: (v) => Math.floor(v / 3600) },
];

function MetricSkeleton() {
  return (
    <div className="card p-4">
      <div className="mb-3 h-3 w-20 animate-pulse rounded bg-elevated" />
      <div className="h-7 w-14 animate-pulse rounded bg-elevated" />
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <div className="card divide-y divide-line">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-elevated" />
          <div className="h-3 flex-1 animate-pulse rounded bg-elevated" />
        </div>
      ))}
    </div>
  );
}

function ServicesList({ services }) {
  return (
    <div className="card divide-y divide-line">
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
              <span className="text-sm text-ink">{svc.name}</span>
              <span className="font-mono text-[10px] text-faint">{svc.region}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tabular-nums text-faint">{svc.latencyMs}ms</span>
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-ink">Server Status</h3>
        <button
          onClick={fetchStatus}
          data-testid="refresh-status-btn"
          className="btn-secondary py-1.5 text-xs"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {status && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-faint">
          <span
            data-testid="status-overall-badge"
            className="pill border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          >
            {status.status}
          </span>
          <span data-testid="status-version">v{status.version}</span>
          <span data-testid="status-region">{status.region}</span>
          <span data-testid="status-timestamp">{new Date(status.timestamp).toLocaleString()}</span>
        </div>
      )}

      {error && (
        <div
          className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          data-testid="status-error"
        >
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
                <div
                  key={m.key}
                  data-testid={m.testId}
                  className="card card-hover p-4"
                >
                  <div className="mb-2 flex items-center gap-1.5 text-faint">
                    <m.icon size={13} />
                    <p className="text-xs">{m.label}</p>
                  </div>
                  <p className="text-2xl font-semibold tabular-nums text-ink">
                    {value}
                    <span className="text-base text-faint">{m.suffix}</span>
                  </p>
                </div>
              );
            })}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-faint">
        <code className="font-mono text-muted">GET /api/public/status</code>
        {lastFetched && <span>· updated {lastFetched.toLocaleTimeString()}</span>}
      </p>
    </div>
  );
}

function PublicGuide() {
  return (
    <div className="space-y-6">
      <span className={`pill border ${T.pill}`}>Strategy 01</span>
      <h1 className="text-2xl font-bold text-ink">Public Bypass</h1>
      <p className="leading-relaxed text-muted">
        Some data doesn't need a login and doesn't need a rendered page.
        It's just an open HTTP endpoint wearing a UI as a courtesy. The{" "}
        <code className="text-muted">PUBLIC</code> strategy skips the
        browser entirely: no Playwright instance to boot, no DOM to wait on,
        no CSS selectors to keep in sync with a redesign. Just a plain fetch
        straight to the endpoint, parsed into stable JSON.
      </p>
      <p className="leading-relaxed text-muted">
        This is the cheapest of the four strategies by a wide margin.
        Always reach for it first before assuming you need a browser at all.
      </p>

      <LiveTargetNote theme="PUBLIC">
        The panel on the right is a real infra status page, backed by the
        same Express server, not a screenshot. It auto-refreshes every 4
        seconds straight from <code className="text-muted">GET /api/public/status</code>.
        Hit <span className="font-medium text-muted">Refresh</span> to
        force an immediate re-fetch and watch the CPU/memory numbers and
        service latencies change on demand.
      </LiveTargetNote>

      <h2 className="section-label">The adapter</h2>
      <p className="leading-relaxed text-muted">
        <code className="text-muted">webcmd-adapters/public-status.js</code>{" "}
        does exactly this: one <code className="text-muted">fetch()</code>{" "}
        call, no auth, no session state.
      </p>
      <CodeBlock>node webcmd-adapters/public-status.js</CodeBlock>

      <ExpectedOutputPanel>{`{
  "ok": true,
  "strategy": "PUBLIC",
  "endpoint": "/api/public/status",
  "data": {
    "cpuUsagePercent": 18.2,
    "memoryUsagePercent": 47.9,
    "uptimeSeconds": 128473,
    "activeConnections": 165,
    "services": [...],
    "region": "us-east-1",
    "version": "1.4.2"
  },
  "error": null,
  "fetchedAt": "2026-08-21T00:00:00.000Z"
}`}</ExpectedOutputPanel>

      <StrategyNavFooter />
    </div>
  );
}

export default function PublicStrategyPage() {
  return <SplitPane theme="PUBLIC" guide={<PublicGuide />} target={<ServerStatusTarget />} />;
}
