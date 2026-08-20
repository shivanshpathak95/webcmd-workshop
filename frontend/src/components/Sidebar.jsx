import { NavLink } from "react-router-dom";
import { 
  Rocket, 
  Globe, 
  Cookie, 
  Radio, 
  MousePointerClick, 
  BookOpen, 
  ArrowUpRight,
  TerminalSquare
} from "lucide-react";

const TOP_LINK = { to: "/", label: "Introduction", icon: Rocket, end: true };

const STRATEGY_LINKS = [
  { to: "/strategies/public", label: "Public Bypass", icon: Globe, tag: "01" },
  { to: "/strategies/cookie", label: "Cookie Jars", icon: Cookie, tag: "02" },
  { to: "/strategies/intercept", label: "Interception", icon: Radio, tag: "03" },
  { to: "/strategies/ui", label: "UI Automation", icon: MousePointerClick, tag: "04" },
];

export default function Sidebar() {
  return (
    <aside className="relative flex h-full w-64 flex-none flex-col overflow-hidden border-r border-neutral-800 bg-neutral-950">
      
      {/* 
        Ambient Light Effect 
        This creates a soft blue glow in the top-left of the sidebar.
      */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-blue-900/20 blur-3xl" />

      {/* Brand Header */}
      <div className="relative z-10 flex h-16 items-center gap-3 border-b border-neutral-800/50 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
          <TerminalSquare size={18} strokeWidth={2.5} />
        </div>
        <span className="font-semibold tracking-tight text-neutral-100">Webcmd Hub</span>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-thin relative z-10 flex-1 space-y-8 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          <NavLink
            to={TOP_LINK.to}
            end={TOP_LINK.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20"
                  : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
              }`
            }
          >
            <TOP_LINK.icon 
              size={16} 
              strokeWidth={2} 
              className="opacity-70 transition-opacity group-hover:opacity-100" 
            />
            <span>{TOP_LINK.label}</span>
          </NavLink>
        </div>

        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Execution Strategies
          </p>
          <div className="space-y-1">
            {STRATEGY_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                  }`
                }
              >
                <item.icon 
                  size={16} 
                  strokeWidth={2} 
                  className="opacity-70 transition-opacity group-hover:opacity-100" 
                />
                <span className="flex-1">{item.label}</span>
                <span className="font-mono text-[10px] tracking-widest opacity-50">
                  {item.tag}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer Resource Card */}
      <div className="relative z-10 border-t border-neutral-800/50 bg-neutral-950/50 p-4 backdrop-blur-sm">
        <a
          href="https://webcmd.dev/docs"
          target="_blank"
          rel="noreferrer"
          className="group flex w-full items-center justify-between rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-400 transition-all hover:border-neutral-600 hover:bg-neutral-800 hover:text-neutral-200"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-neutral-500 group-hover:text-blue-400 transition-colors" />
            <span>Read Docs</span>
          </div>
          <ArrowUpRight 
            size={14} 
            className="opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-blue-400" 
          />
        </a>
      </div>
    </aside>
  );
}