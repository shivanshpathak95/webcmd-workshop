import { useEffect, useState } from "react";
import { AlertTriangle, Table2, Braces, RefreshCw } from "lucide-react";
import SplitPane from "../../components/SplitPane.jsx";
import CodeBlock from "../../components/CodeBlock.jsx";
import LiveTargetNote from "../../components/LiveTargetNote.jsx";
import ExpectedOutputPanel from "../../components/ExpectedOutputPanel.jsx";
import StrategyNavFooter from "../../components/StrategyNavFooter.jsx";
import { STRATEGY_THEMES } from "../../theme.js";

const T = STRATEGY_THEMES.INTERCEPT;

const PRIORITY_DOT = {
  critical: "bg-red-400",
  high: "bg-neutral-200",
  medium: "bg-neutral-500",
  low: "bg-neutral-700",
};

const STATUS_TEXT = {
  open: "text-neutral-300",
  in_progress: "text-neutral-200",
  resolved: "text-neutral-500",
};

function TableSkeleton() {
  return (
    <div data-testid="tickets-loading" className="overflow-hidden rounded-xl border border-neutral-800">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-neutral-800 px-4 py-3.5 last:border-0">
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-800" />
          <div className="h-3 flex-1 animate-pulse rounded bg-neutral-800" />
          <div className="h-3 w-20 animate-pulse rounded bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}

function Assignee({ name }) {
  if (!name) return <span className="text-xs text-neutral-600">Unassigned</span>;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <span className="flex items-center gap-2 whitespace-nowrap text-neutral-400">
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-neutral-800 text-[10px] font-medium text-neutral-300">
        {initials}
      </span>
      {name}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function SupportTicketsTarget() {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState("table");
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchTickets = () => {
    setTickets(null);
    setError(null);
    fetch("/api/internal/tickets")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTickets(data);
        setFetchedAt(new Date());
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div data-testid="support-tickets-panel" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h3 className="text-base font-semibold text-neutral-100">Support Tickets</h3>
          {tickets && (
            <span data-testid="ticket-count" className="text-xs tabular-nums text-neutral-500">
              {tickets.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTickets}
            data-testid="refetch-tickets-btn"
            className="btn-secondary py-1.5 text-xs"
          >
            <RefreshCw size={12} className={!tickets && !error ? "animate-spin" : ""} />
            Refetch
          </button>
          <div className="flex rounded-md border border-neutral-800 p-0.5">
            <button
              onClick={() => setView("table")}
              data-testid="tickets-view-table"
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                view === "table" ? "bg-neutral-800 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Table2 size={12} /> Table
            </button>
            <button
              onClick={() => setView("json")}
              data-testid="tickets-view-json"
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                view === "json" ? "bg-neutral-800 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Braces size={12} /> JSON
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          data-testid="tickets-error"
          className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          <AlertTriangle size={15} />
          Failed to fetch: {error}
        </div>
      )}

      {!tickets && !error && <TableSkeleton />}

      {tickets && view === "table" && (
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <div className="overflow-x-auto">
            <table data-testid="tickets-table" className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-600">
                  <th className="px-4 py-2.5 font-medium">ID</th>
                  <th className="px-4 py-2.5 font-medium">Subject</th>
                  <th className="px-4 py-2.5 font-medium">Priority</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Customer</th>
                  <th className="px-4 py-2.5 font-medium">Created</th>
                  <th className="px-4 py-2.5 font-medium">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    data-testid={`ticket-row-${t.id}`}
                    className="border-b border-neutral-800/80 last:border-0 transition-colors hover:bg-neutral-900"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs tabular-nums text-neutral-500">
                      {t.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-[260px] truncate text-neutral-200" title={t.subject}>
                        {t.subject}
                      </p>
                      {t.tags?.length > 0 && (
                        <div className="mt-1 flex gap-1">
                          {t.tags.map((tag) => (
                            <span key={tag} className="font-mono text-[10px] text-neutral-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs capitalize text-neutral-400">
                        <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[t.priority] ?? "bg-neutral-600"}`} />
                        {t.priority}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`text-xs capitalize ${STATUS_TEXT[t.status] ?? "text-neutral-400"}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-xs text-neutral-500" title={t.customer}>
                      {t.customer}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-neutral-500">
                      {formatDate(t.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <Assignee name={t.assignee} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tickets && view === "json" && (
        <div data-testid="tickets-json-panel" className="animate-fadeIn">
          <CodeBlock language="json">{JSON.stringify(tickets, null, 2)}</CodeBlock>
        </div>
      )}

      <p className="text-xs text-neutral-600">
        Hidden endpoint: <code className="font-mono text-neutral-400">GET /api/internal/tickets</code>
        {fetchedAt && <span> · fetched {fetchedAt.toLocaleTimeString()}</span>}
      </p>
    </div>
  );
}

function InterceptGuide() {
  return (
    <div className="space-y-6">
      <span className={`pill border ${T.pill}`}>Strategy 03</span>
      <h1 className="text-2xl font-bold text-slate-50">Network Interception</h1>
      <p className="leading-relaxed text-slate-400">
        The table on the right is real React, but the table only exists because
        it fetched JSON from{" "}
        <code className="text-slate-300">/api/internal/tickets</code> on mount.
        The <code className="text-slate-300">INTERCEPT</code> strategy opens a
        headless browser, listens for that network response, and grabs the JSON
        directly off the wire.
      </p>

      <LiveTargetNote theme="INTERCEPT">
        Hit <span className="font-medium text-slate-300">Refetch</span> to trigger
        the network call again, then flip to{" "}
        <span className="font-medium text-slate-300">Raw JSON</span> to see the
        exact payload an INTERCEPT adapter would capture.
      </LiveTargetNote>

      <h2 className="section-label">The adapter</h2>
      <CodeBlock>node webcmd-adapters/tickets-intercept.js</CodeBlock>

      <ExpectedOutputPanel>{`{
  "ok": true,
  "strategy": "INTERCEPT",
  "endpoint": "/api/internal/tickets",
  "data": [
    { "id": "TCK-2041", "subject": "...", "priority": "high", "status": "open", "createdAt": "..." }
  ],
  "error": null,
  "fetchedAt": "..."
}`}</ExpectedOutputPanel>

      <StrategyNavFooter />
    </div>
  );
}

export default function InterceptStrategyPage() {
  return <SplitPane theme="INTERCEPT" guide={<InterceptGuide />} target={<SupportTicketsTarget />} />;
}
