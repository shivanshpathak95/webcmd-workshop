import { NavLink } from "react-router-dom";
import { BookOpen, ArrowUpRight, TerminalSquare } from "lucide-react";
import { INTRO_ROUTE, STRATEGIES } from "../strategies.config.js";

export default function Sidebar() {
  return (
    <aside data-testid="sidebar-nav" className="flex h-full w-64 flex-none flex-col overflow-hidden bg-neutral-950">
      <div className="flex h-14 items-center gap-3 border-b border-neutral-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
          <TerminalSquare size={18} strokeWidth={2} />
        </div>
        <span className="font-semibold tracking-tight text-neutral-100">Webcmd Hub</span>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-8 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          <NavLink
            to={INTRO_ROUTE.to}
            end={INTRO_ROUTE.end}
            data-testid="nav-intro"
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-neutral-800 text-neutral-100"
                  : "text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-200"
              }`
            }
          >
            <INTRO_ROUTE.icon size={16} strokeWidth={2} className="opacity-70 transition-opacity group-hover:opacity-100" />
            <span>{INTRO_ROUTE.label}</span>
          </NavLink>
        </div>

        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Execution Strategies
          </p>
          <div className="space-y-1">
            {STRATEGIES.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={item.navTestId}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-neutral-800 text-neutral-100"
                      : "text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-200"
                  }`
                }
              >
                <item.icon size={16} strokeWidth={2} className="opacity-70 transition-opacity group-hover:opacity-100" />
                <span className="flex-1">{item.shortLabel}</span>
                <span className="font-mono text-[10px] tracking-widest text-neutral-600">{item.tag}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-neutral-800 p-4">
        <a
          href="https://webcmd.dev/docs"
          target="_blank"
          rel="noreferrer"
          data-testid="nav-docs-external"
          className="group flex w-full items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-500 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={14} />
            <span>Read Docs</span>
          </div>
          <ArrowUpRight
            size={14}
            className="opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </a>
      </div>
    </aside>
  );
}
