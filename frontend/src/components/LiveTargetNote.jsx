import { Eye } from "lucide-react";
import { STRATEGY_THEMES } from "../theme.js";

export default function LiveTargetNote({ theme, children }) {
  const T = STRATEGY_THEMES[theme] ?? STRATEGY_THEMES.UI;
  return (
    <div className="rounded-lg border border-surface-600 bg-surface-900/60 p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <Eye size={14} className={T.icon} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${T.label}`}>Live Target: try it</span>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}
