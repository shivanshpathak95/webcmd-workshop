import { useEffect, useRef, useState } from "react";
import { Check, Copy, Terminal, FileJson2, Braces } from "lucide-react";

const LANGUAGE_META = {
  bash: { icon: Terminal, label: "bash" },
  json: { icon: FileJson2, label: "json" },
  js: { icon: Braces, label: "js" },
};

const COPY_COOLDOWN_MS = 1500;

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
  const timeoutRef = useRef(null);
  const lockedRef = useRef(false);
  const code = String(children).trim();
  const meta = LANGUAGE_META[language] || LANGUAGE_META.bash;
  const Icon = meta.icon;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const scheduleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      lockedRef.current = false;
      setCopied(false);
    }, COPY_COOLDOWN_MS);
  };

  const handleCopy = async () => {
    if (lockedRef.current) {
      scheduleReset();
      return;
    }
    lockedRef.current = true;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      scheduleReset();
    } catch {
      lockedRef.current = false;
    }
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
          <Icon size={14} className="opacity-70" />
          {meta.label}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          data-testid="codeblock-copy-btn"
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            copied
              ? "bg-emerald-500/10 text-emerald-400"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
          }`}
        >
          {copied ? (
            <>
              <Check size={13} /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy
            </>
          )}
        </button>
      </div>

      <pre className="scrollbar-thin overflow-x-auto p-4 text-[13px] leading-relaxed text-neutral-300">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlight(code, language) }}
        />
      </pre>
    </div>
  );
}
