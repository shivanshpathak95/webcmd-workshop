import { useState } from "react";
import { ChevronDown, ChevronRight, Terminal } from "lucide-react";
import CodeBlock from "./CodeBlock.jsx";

export default function ExpectedOutputPanel({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-surface-600 bg-surface-900/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-400 transition-colors hover:text-slate-200"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Terminal size={14} className="text-slate-500" />
        <span className="font-medium">Expected CLI output</span>
      </button>
      {open && (
        <div className="border-t border-surface-700 px-4 pb-4 pt-2">
          <p className="mb-2 text-xs text-slate-500">
            The adapter prints one line of JSON to stdout. Compare with the Live Target panel.
          </p>
          <CodeBlock language="json">{children}</CodeBlock>
        </div>
      )}
    </div>
  );
}
