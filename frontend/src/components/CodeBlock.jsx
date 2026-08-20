import { useState } from "react";
import { Check, Copy, Terminal, FileJson2, Braces } from "lucide-react";

const LANGUAGE_META = {
  bash: { icon: Terminal, label: "bash" },
  json: { icon: FileJson2, label: "json" },
  js: { icon: Braces, label: "js" },
};

/** 
 * Very small, dependency-free syntax highlighter.
 */
function highlight(code, language) {
  const escape = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let src = escape(code);

  if (language === "json") {
    src = src
      .replace(/"([^"]+)":/g, '<span class="text-blue-300">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="text-emerald-400">"$1"</span>')
      .replace(/: (true|false|null)/g, ': <span class="text-orange-400">$1</span>')
      .replace(/: (-?\d+\.?\d*)/g, ': <span class="text-orange-400">$1</span>');
  } else if (language === "js") {
    src = src
      .replace(
        /\b(const|await|async|function|return|new|require|export|default)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>'
      )
      .replace(/(\/\/.*$)/gm, '<span class="text-neutral-500 italic">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="text-emerald-400">"$1"</span>');
  } else {
    // bash
    src = src
      .replace(/^(#.*)$/gm, '<span class="text-neutral-500 italic">$1</span>')
      .replace(/^([\w.-]+)/gm, '<span class="text-blue-400 font-medium">$1</span>')
      .replace(/\s(--[\w-]+)/g, ' <span class="text-neutral-400">$1</span>')
      .replace(/(&quot;[^&]*&quot;|'[^']*')/g, '<span class="text-emerald-400">$1</span>');
  }

  return src;
}

export default function CodeBlock({ children, language = "bash" }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).trim();
  const meta = LANGUAGE_META[language] || LANGUAGE_META.bash;
  const Icon = meta.icon;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fail silently
    }
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl ring-1 ring-white/5">
      
      {/* Top Chrome / Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/50 px-4 py-2.5 backdrop-blur-md">
        
        <div className="flex items-center gap-4">
          {/* Traffic Lights */}
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-inset ring-red-500/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 ring-1 ring-inset ring-yellow-500/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 ring-1 ring-inset ring-emerald-500/20" />
          </div>
          
          {/* Language Label */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
            <Icon size={14} className="opacity-70" />
            {meta.label}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            copied
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
              : "text-neutral-400 opacity-0 hover:bg-neutral-800 hover:text-neutral-200 group-hover:opacity-100 focus:opacity-100"
          }`}
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="scrollbar-thin overflow-x-auto p-4 text-[13px] leading-relaxed text-neutral-300">
        <code 
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlight(code, language) }} 
        />
      </pre>

      {/* Subtle Bottom Glow Effect */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </div>
  );
}