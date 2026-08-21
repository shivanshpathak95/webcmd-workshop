import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getStrategyNeighbors } from "../strategies.config.js";

export default function StrategyNavFooter() {
  const { pathname } = useLocation();
  const { prev, next } = getStrategyNeighbors(pathname);

  if (!prev && !next) return null;

  return (
    <div className="mt-8 flex items-center justify-between gap-4 border-t border-surface-700 pt-6">
      {prev ? (
        <Link
          to={prev.to}
          className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          <span>
            <span className="font-mono text-[10px] text-slate-600">{prev.tag}</span> {prev.shortLabel}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={next.to}
          className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
        >
          <span>
            <span className="font-mono text-[10px] text-slate-600">{next.tag}</span> {next.shortLabel}
          </span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
