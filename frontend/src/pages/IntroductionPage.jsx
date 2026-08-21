import { Link } from "react-router-dom";
import { Terminal, Stethoscope, Puzzle, ArrowRight } from "lucide-react";
import CodeBlock from "../components/CodeBlock.jsx";
import { STRATEGIES } from "../strategies.config.js";

const STEPS = [
  {
    icon: Terminal,
    title: "Install the CLI",
    body: "Get the webcmd binary on your machine, globally.",
    code: "npm install -g @agentrhq/webcmd",
  },
  {
    icon: Stethoscope,
    title: "Run diagnostics",
    body: "Must pass before browser commands work properly.",
    code: "webcmd doctor",
  },
  {
    icon: Puzzle,
    title: "Install agent skills",
    body: "Wires webcmd usage guidance into your agent of choice.",
    code: "webcmd skills add",
  },
];

export default function IntroductionPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-canvas [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

      {/* Hero */}
      <div className="border-b border-line px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-elevated px-3 py-1 text-xs font-medium text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Getting Started
          </span>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Stop rediscovering
            <br />the same sites.
          </h1>

          <p className="text-base leading-relaxed text-muted sm:text-lg">
            Webcmd turns brittle browser work into{" "}
            <span className="font-medium text-ink">deterministic JSON CLIs</span>
            , so agents don't have to re-learn a site's DOM on every run.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-8 py-14">

        {/* Setup steps */}
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-faint">
          Setup: Three Steps
        </p>

        <div className="mb-16 flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-xl border border-line bg-elevated p-5 transition-colors hover:border-faint"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas text-muted">
                  <step.icon size={17} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block font-mono text-[10px] font-semibold tracking-widest text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                </div>
              </div>
              <p className="mb-4 text-sm text-faint">{step.body}</p>
              <CodeBlock>{step.code}</CodeBlock>
            </div>
          ))}
        </div>

        {/* Strategies */}
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-faint">
          Explore Strategies
        </p>

        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STRATEGIES.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex items-center gap-4 rounded-xl border border-line bg-elevated p-4 transition-colors hover:border-faint hover:bg-elevated"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-line bg-canvas text-muted">
                <s.icon size={18} strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] font-semibold tracking-widest text-faint">
                  STRATEGY {s.tag}
                </p>
                <p className="text-sm font-medium text-ink">{s.shortLabel}</p>
              </div>

              <ArrowRight
                size={15}
                className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-muted"
              />
            </Link>
          ))}
        </div>

        {/* Local dev info */}
        <div className="rounded-xl border border-line bg-elevated p-5">
          <p className="mb-1 text-sm font-medium text-muted">Run this demo hub locally</p>
          <p className="mb-4 text-sm text-faint">
            From the repo root: <code className="text-muted">npm run setup</code> then{" "}
            <code className="text-muted">npm run dev</code>. Backend on :4000, frontend on :5173.
          </p>
          <p className="mb-1 text-sm font-medium text-muted">Discover installed Webcmd commands</p>
          <p className="mb-3 text-sm text-faint">
            After installing the CLI and any plugins, your agent can list available adapters:
          </p>
          <CodeBlock>webcmd list -f json</CodeBlock>
        </div>

      </div>
    </div>
  );
}
