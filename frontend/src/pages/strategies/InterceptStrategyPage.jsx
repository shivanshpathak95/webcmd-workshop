import { useEffect, useState } from "react";
import { AlertTriangle, Table2, Braces, RefreshCw, Eye } from "lucide-react";
import SplitPane from "../../components/SplitPane.jsx";
import CodeBlock from "../../components/CodeBlock.jsx";
import { STRATEGY_THEMES } from "../../theme.js";

const T = STRATEGY_THEMES.INTERCEPT;

const PRIORITY_STYLES = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const STATUS_STYLES = {
  open: "bg-accent-600/10 text-accent-300 border-accent-500/20",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

function TableSkeleton() {
  return (
    <div className="card divide-y divide-surface-700">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5">
          <div className="h-3 w-16 animate-pulse rounded bg-surface-700" />
          <div className="h-3 flex-1 animate-pulse rounded bg-surface-700" />
          <div className="h-3 w-14 animate-pulse rounded bg-surface-700" />
        </div>
      ))}
    </div>
  );
}

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

function Assignee({ name }) {
  if (!name) return <span className="text-xs italic text-slate-600">Unassigned</span>;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-400">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-fuchsia-500/10 text-[10px] font-medium text-fuchsia-300">
        {initials}
      </span>
      {name}
    </span>
  );
}

function SupportTicketsTarget() {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState("table");
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchTickets = () => {
    // Reset to null first so the loading skeleton reappears — makes the
    // re-fetch visibly happen instead of just silently swapping data.
    setTickets(null);
    setError(null);
    // This is exactly the network call an INTERCEPT-strategy agent would
    // capture instead of scraping the rendered <table> below.
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-100">Support Tickets</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTickets}
            data-testid="refetch-tickets-btn"
            className="btn-secondary py-1.5 text-xs hover:border-fuchsia-500/40 hover:text-fuchsia-300"
          >
            <RefreshCw size={12} className={!tickets && !error ? "animate-spin text-fuchsia-400" : ""} />
            Refetch
          </button>
          <div className="flex rounded-lg border border-surface-600 bg-surface-800 p-0.5">
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              view === "table" ? "bg-fuchsia-500/15 text-fuchsia-300" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Table2 size={12} /> Table
          </button>
          <button
            onClick={() => setView("json")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              view === "json" ? "bg-fuchsia-500/15 text-fuchsia-300" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Braces size={12} /> Raw JSON
          </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle size={15} />
          Failed to fetch: {error}
        </div>
      )}

      {!tickets && !error && <TableSkeleton />}

      {tickets && view === "table" && (
        <div className="card animate-fadeIn overflow-x-auto">
          <table data-testid="tickets-table" className="w-full text-sm">
            <thead className="bg-surface-900/60 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {tickets.map((t) => (
                <tr key={t.id} data-testid={`ticket-row-${t.id}`} className="transition-colors hover:bg-fuchsia-500/[0.04]">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.id}</td>
                  <td className="px-4 py-3 text-slate-200">
                    <p>{t.subject}</p>
                    {t.tags?.length > 0 && (
                      <div className="mt-1.5 flex gap-1">
                        {t.tags.map((tag) => (
                          <span key={tag} className="rounded bg-surface-700 px-1.5 py-0.5 text-[10px] text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`pill border ${PRIORITY_STYLES[t.priority] ?? ""}`}>{t.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`pill border ${STATUS_STYLES[t.status] ?? ""}`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{t.customer}</td>
                  <td className="px-4 py-3 text-xs">
                    <Assignee name={t.assignee} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tickets && view === "json" && (
        <div className="animate-fadeIn">
          <CodeBlock language="json">{JSON.stringify(tickets, null, 2)}</CodeBlock>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Hidden endpoint: <code className="font-mono text-slate-400">GET /api/internal/tickets</code>
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
        The table on the right is real React — it renders rows, class names
        that will change on the next refactor, and a loading state you'd
        have to wait out. Scraping it means matching CSS selectors that
        break the moment a designer touches this page. But the table only
        exists because it fetched JSON from{" "}
        <code className="text-slate-300">/api/internal/tickets</code> on
        mount — and that response is far more stable than the DOM it
        produced. Flip the toggle on the right to see the exact payload the
        table is hiding behind its render.
      </p>
      <p className="leading-relaxed text-slate-400">
        The <code className="text-slate-300">INTERCEPT</code> strategy opens
        a real (headless) browser — so the page's own JS still runs and
        calls the hidden endpoint — but instead of waiting for render and
        parsing HTML, it listens for that one network response and grabs
        the JSON directly off the wire.
      </p>

      <LiveTargetNote>
        The table on the right already fetched once, on mount — hit{" "}
        <span className="font-medium text-slate-300">Refetch</span> to
        trigger that network call again on demand and watch the loading
        skeleton reappear. Then flip to{" "}
        <span className="font-medium text-slate-300">Raw JSON</span> to see
        the exact payload behind the rendered rows — that's what an
        INTERCEPT adapter would capture instead of the table.
      </LiveTargetNote>

      <h2 className="section-label">The adapter</h2>
      <p className="leading-relaxed text-slate-400">
        <code className="text-slate-300">webcmd-adapters/tickets-intercept.js</code>{" "}
        launches Chromium, races{" "}
        <code className="text-slate-300">page.waitForResponse()</code>{" "}
        against navigation, and returns the raw JSON payload — never
        touching <code className="text-slate-300">page.$$('tr')</code> or
        similar.
      </p>
      <CodeBlock>node webcmd-adapters/tickets-intercept.js</CodeBlock>
      <CodeBlock language="js">{`const responsePromise = page.waitForResponse(
  (res) => res.url().includes("/api/internal/tickets") && res.status() === 200
);
await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
const tickets = await (await responsePromise).json();`}</CodeBlock>
    </div>
  );
}

export default function InterceptStrategyPage() {
  return <SplitPane theme="INTERCEPT" guide={<InterceptGuide />} target={<SupportTicketsTarget />} />;
}
