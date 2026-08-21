import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ROUTE_META } from "../strategies.config.js";

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] ?? ROUTE_META["/"];
  const Icon = meta.icon;
  const [backendOk, setBackendOk] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch("/api/health", { signal: AbortSignal.timeout(4000) });
        if (!cancelled) setBackendOk(res.ok);
      } catch {
        if (!cancelled) setBackendOk(false);
      }
    };

    check();
    const interval = setInterval(check, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="flex h-14 flex-none items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          data-testid="topbar-sidebar-toggle"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
        <div className="h-4 w-px bg-neutral-800" />
        <Icon size={16} className="text-neutral-500" />
        <h1 className="text-sm font-medium text-neutral-200">{meta.title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {meta.strategy && (
          <span data-testid="topbar-strategy-badge" className="pill border border-neutral-800 bg-neutral-900 text-neutral-500 font-mono text-[10px] tracking-widest">
            {meta.strategy}
          </span>
        )}
        <span
          data-testid="topbar-backend-health"
          title={backendOk === null ? "Checking backend…" : backendOk ? "Backend connected" : "Backend unreachable"}
          className={`h-2 w-2 rounded-full transition-colors ${
            backendOk === null
              ? "animate-pulse bg-neutral-600"
              : backendOk
                ? "bg-emerald-400"
                : "bg-red-400"
          }`}
        />
      </div>
    </header>
  );
}
