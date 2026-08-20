import { useLocation } from "react-router-dom";
import { Rocket, Globe, Cookie, Radio, MousePointerClick, Zap, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const ROUTE_META = {
  "/": { title: "Introduction & Setup", icon: Rocket },
  "/strategies/public": {
    title: "Public Bypass",
    icon: Globe,
    strategy: "PUBLIC",
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    speed: 3,
  },
  "/strategies/cookie": {
    title: "Authenticated Cookie Jars",
    icon: Cookie,
    strategy: "COOKIE",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    speed: 2,
  },
  "/strategies/intercept": {
    title: "Network Interception",
    icon: Radio,
    strategy: "INTERCEPT",
    color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
    speed: 2,
  },
  "/strategies/ui": {
    title: "Complex UI Automation",
    icon: MousePointerClick,
    strategy: "UI",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    speed: 1,
  },
};

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] ?? ROUTE_META["/"];
  const Icon = meta.icon;

  return (
    <header className="flex h-14 flex-none items-center justify-between border-b border-surface-700 bg-surface-900/60 px-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-surface-700 hover:text-slate-200"
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
        <div className="h-4 w-px bg-surface-700" />
        <Icon size={16} className="text-slate-400" />
        <h1 className="text-sm font-semibold text-slate-200">{meta.title}</h1>
      </div>

      {meta.strategy && (
        <div className="flex items-center gap-3">
          <span className={`pill border ${meta.color}`}>{meta.strategy}</span>
          <span className="flex items-center gap-0.5 text-slate-500" title="Relative speed">
            {Array.from({ length: 3 }).map((_, i) => (
              <Zap
                key={i}
                size={12}
                className={i < meta.speed ? "fill-accent-400 text-accent-400" : "text-surface-600"}
              />
            ))}
          </span>
        </div>
      )}
    </header>
  );
}
