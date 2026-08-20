import { useState } from "react";
import { Server, MapPin, ClipboardCheck, CheckCircle2, ArrowLeft, ArrowRight, RotateCcw, Eye } from "lucide-react";
import SplitPane from "../../components/SplitPane.jsx";
import CodeBlock from "../../components/CodeBlock.jsx";
import { STRATEGY_THEMES } from "../../theme.js";

const T = STRATEGY_THEMES.UI;

/** Bridges the Guide pane to the Live Target on the right — what it shows,
 *  and exactly what to click to see the strategy play out. */
function LiveTargetNote({ children }) {
  return (
    <div className="rounded-lg border border-surface-600 bg-surface-900/60 p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <Eye size={14} className={T.icon} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${T.label}`}>Live Target — try it</span>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}

const REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];

// Purely presentational — deterministic per region so the review step shows
// something a real cloud console would show, without adding new form fields.
const REGION_SPECS = {
  "us-east-1": { vcpu: 2, ramGb: 4, ssdGb: 80, hourly: 0.042 },
  "us-west-2": { vcpu: 2, ramGb: 4, ssdGb: 80, hourly: 0.046 },
  "eu-west-1": { vcpu: 2, ramGb: 4, ssdGb: 80, hourly: 0.051 },
  "ap-southeast-1": { vcpu: 2, ramGb: 4, ssdGb: 80, hourly: 0.058 },
};
const STEP_META = [
  { icon: Server, label: "Name" },
  { icon: MapPin, label: "Region" },
  { icon: ClipboardCheck, label: "Review" },
];

function ServerWizardTarget() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", region: REGIONS[0] });
  const [submitted, setSubmitted] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const handleSubmit = () => setSubmitted(true);
  const reset = () => {
    setSubmitted(false);
    setStep(1);
    setForm({ name: "", region: REGIONS[0] });
  };

  if (submitted) {
    return (
      <div data-testid="wizard-success" className="card animate-slideUp max-w-md p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={22} />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">Server Instance Created</h3>
        <p className="mb-5 mt-1.5 text-sm leading-relaxed text-slate-400">
          <span className="font-medium text-slate-200">{form.name}</span> is
          being provisioned in{" "}
          <span className="text-slate-200">{form.region}</span> (
          {REGION_SPECS[form.region].vcpu} vCPU · {REGION_SPECS[form.region].ramGb}GB RAM, ~$
          {REGION_SPECS[form.region].hourly.toFixed(3)}/hr).
        </p>
        <button onClick={reset} data-testid="wizard-reset" className="btn-secondary">
          <RotateCcw size={13} /> Create Another
        </button>
      </div>
    );
  }

  return (
    <div data-testid="server-wizard" className="card max-w-md p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">Create a New Server Instance</h3>
        <span className="font-mono text-xs text-slate-500">Step {step} of 3</span>
      </div>

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2" data-testid="wizard-progress">
        {STEP_META.map((s, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={s.label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs transition-colors ${
                  done
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : active
                      ? "border-orange-500 bg-orange-500/10 text-orange-300"
                      : "border-surface-600 text-slate-600"
                }`}
              >
                {done ? <CheckCircle2 size={13} /> : <s.icon size={13} />}
              </div>
              {n < 3 && (
                <div className={`h-px flex-1 transition-colors ${done ? "bg-emerald-500/40" : "bg-surface-600"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="animate-fadeIn min-h-[92px]">
        {step === 1 && (
          <div data-testid="wizard-step-1" className="space-y-2">
            <label className="text-sm text-slate-400" htmlFor="instance-name">
              Instance Name
            </label>
            <input
              id="instance-name"
              data-testid="wizard-input-name"
              type="text"
              placeholder="e.g. prod-api-01"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`input-field ${T.ring}`}
            />
          </div>
        )}

        {step === 2 && (
          <div data-testid="wizard-step-2" className="space-y-2">
            <label className="text-sm text-slate-400" htmlFor="instance-region">
              Region
            </label>
            <select
              id="instance-region"
              data-testid="wizard-select-region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className={`input-field ${T.ring}`}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div data-testid="wizard-step-3" className="space-y-2.5 rounded-lg border border-surface-600 bg-surface-800/60 p-4">
            <p className="section-label">Review</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-100">{form.name || "(empty)"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Region</span>
              <span className="font-medium text-slate-100">{form.region}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Specs</span>
              <span className="font-medium text-slate-100">
                {REGION_SPECS[form.region].vcpu} vCPU · {REGION_SPECS[form.region].ramGb}GB RAM ·{" "}
                {REGION_SPECS[form.region].ssdGb}GB SSD
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-surface-700 pt-2.5 text-sm">
              <span className="text-slate-500">Est. cost</span>
              <span className="font-medium text-orange-300">
                ${REGION_SPECS[form.region].hourly.toFixed(3)}/hr
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={back}
          disabled={step === 1}
          data-testid="wizard-back-btn"
          className="btn-secondary disabled:opacity-0"
        >
          <ArrowLeft size={13} /> Back
        </button>

        {step < 3 ? (
          <button
            onClick={next}
            disabled={step === 1 && !form.name.trim()}
            data-testid="wizard-next-btn"
            className={`btn-primary ${T.button}`}
          >
            Next <ArrowRight size={13} />
          </button>
        ) : (
          <button onClick={handleSubmit} data-testid="wizard-submit-btn" className={`btn-primary ${T.button}`}>
            Create Instance
          </button>
        )}
      </div>
    </div>
  );
}

function UiGuide() {
  return (
    <div className="space-y-6">
      <span className={`pill border ${T.pill}`}>Strategy 04</span>
      <h1 className="text-2xl font-bold text-slate-50">Complex UI Automation</h1>
      <p className="leading-relaxed text-slate-400">
        Sometimes there just isn't an API to bypass to — the wizard on the
        right has no backend at all, it's pure client-side state. This is
        the fallback of last resort: the{" "}
        <code className="text-slate-300">UI</code> strategy drives the real
        DOM, clicking through the same steps a human would.
      </p>
      <p className="leading-relaxed text-slate-400">
        The one thing that makes this reliable instead of brittle:{" "}
        <code className="text-slate-300">data-testid</code> attributes.
        Every input, button, and container on this page carries one — a
        selector contract that survives a redesign even when class names
        and layout don't.
      </p>

      <LiveTargetNote>
        The wizard on the right has no backend at all — every step is
        client-side React state. Type a name, pick a region, and watch the
        review step compute specs and an hourly cost live. Submit to see
        the success state, then hit{" "}
        <span className="font-medium text-slate-300">Create Another</span>{" "}
        to reset and run through it again.
      </LiveTargetNote>

      <h2 className="section-label">The adapter</h2>
      <p className="leading-relaxed text-slate-400">
        <code className="text-slate-300">webcmd-adapters/server-wizard-ui.js</code>{" "}
        walks all three steps by{" "}
        <code className="text-slate-300">data-testid</code>, then waits for
        the success panel to confirm the submit actually landed:
      </p>
      <CodeBlock>node webcmd-adapters/server-wizard-ui.js --name prod-api-01 --region eu-west-1</CodeBlock>
      <CodeBlock language="js">{`await page.getByTestId("wizard-input-name").fill(instanceName);
await page.getByTestId("wizard-next-btn").click();
await page.getByTestId("wizard-select-region").selectOption(region);
await page.getByTestId("wizard-next-btn").click();
await page.getByTestId("wizard-submit-btn").click();
await page.getByTestId("wizard-success").waitFor();`}</CodeBlock>
    </div>
  );
}

export default function UiStrategyPage() {
  return <SplitPane theme="UI" guide={<UiGuide />} target={<ServerWizardTarget />} />;
}
