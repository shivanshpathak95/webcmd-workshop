import { Link } from "react-router-dom";
import {
  Terminal,
  Stethoscope,
  Puzzle,
  ArrowRight,
  Globe,
  Cookie,
  Radio,
  MousePointerClick,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock.jsx";

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

const STRATEGY_CARDS = [
  { 
    to: "/strategies/public", 
    icon: Globe, 
    name: "Public Bypass", 
    tag: "01", 
    glow: "hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.4)] hover:border-sky-500/60 hover:bg-sky-950/20",
    iconGlow: "text-sky-400 group-hover:bg-sky-500/20 group-hover:shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)] group-hover:border-sky-500/40"
  },
  { 
    to: "/strategies/cookie", 
    icon: Cookie, 
    name: "Cookie Jars", 
    tag: "02", 
    glow: "hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)] hover:border-amber-500/60 hover:bg-amber-950/20",
    iconGlow: "text-amber-400 group-hover:bg-amber-500/20 group-hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] group-hover:border-amber-500/40"
  },
  { 
    to: "/strategies/intercept", 
    icon: Radio, 
    name: "Interception", 
    tag: "03", 
    glow: "hover:shadow-[0_0_40px_-10px_rgba(217,70,239,0.4)] hover:border-fuchsia-500/60 hover:bg-fuchsia-950/20",
    iconGlow: "text-fuchsia-400 group-hover:bg-fuchsia-500/20 group-hover:shadow-[0_0_20px_-5px_rgba(217,70,239,0.5)] group-hover:border-fuchsia-500/40"
  },
  { 
    to: "/strategies/ui", 
    icon: MousePointerClick, 
    name: "UI Automation", 
    tag: "04", 
    glow: "hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.4)] hover:border-orange-500/60 hover:bg-orange-950/20",
    iconGlow: "text-orange-400 group-hover:bg-orange-500/20 group-hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)] group-hover:border-orange-500/40"
  },
];

export default function IntroductionPage() {
  return (
    <div className="relative h-full w-full overflow-y-auto bg-surface-950 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      
      {/* Dependency-Free CSS Animations for the dynamic lights */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drift-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.15; }
          33% { transform: translate(120px, -80px) scale(1.2); opacity: 0.25; }
          66% { transform: translate(-80px, 120px) scale(0.9); opacity: 0.1; }
        }
        @keyframes drift-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.1; }
          33% { transform: translate(-150px, 100px) scale(1.3); opacity: 0.2; }
          66% { transform: translate(100px, -50px) scale(0.8); opacity: 0.05; }
        }
        @keyframes drift-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.08; }
          50% { transform: translate(200px, -200px) scale(1.4); opacity: 0.15; }
        }
      `}} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-surface-700 bg-grid-pattern bg-grid bg-radial-fade">
        
        {/* Dynamic Volumetric Lights */}
        <div 
          className="pointer-events-none absolute -left-20 -top-40 h-[500px] w-[500px] rounded-full bg-accent-500 blur-[120px]" 
          style={{ animation: 'drift-1 25s infinite ease-in-out' }}
        />
        <div 
          className="pointer-events-none absolute -right-20 top-20 h-[400px] w-[600px] rounded-full bg-blue-600 blur-[120px]" 
          style={{ animation: 'drift-2 30s infinite ease-in-out' }}
        />

        <div className="relative mx-auto max-w-3xl px-8 py-20 sm:py-28">
          
          <span className="pill mb-6 inline-flex items-center border border-accent-500/30 bg-accent-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-300 shadow-[0_0_20px_rgba(var(--color-accent-500),0.2)] ring-1 ring-inset ring-accent-500/20 backdrop-blur-md">
            <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400 shadow-[0_0_8px_rgba(var(--color-accent-400),0.8)]" />
            Getting Started
          </span>
          
          <h1 className="mb-6 bg-gradient-to-br from-white via-slate-100 to-slate-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-6xl lg:text-7xl">
            Stop rediscovering
            <br />
            <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-blue-400 bg-clip-text drop-shadow-[0_0_30px_rgba(var(--color-accent-500),0.3)]">the same sites.</span>
          </h1>
          
          <p className="max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Webcmd turns brittle browser work into{" "}
            <span className="font-semibold text-slate-100 drop-shadow-md">deterministic JSON CLIs</span>
            , so agents don't have to re-learn a site's DOM on every single
            run. Fetch once, script it, save tokens forever.
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-8 py-16">
        
        {/* Third Dynamic Light for the lower section */}
        <div 
          className="pointer-events-none absolute -right-40 top-60 h-[600px] w-[600px] rounded-full bg-accent-500 blur-[150px]" 
          style={{ animation: 'drift-3 35s infinite ease-in-out alternate' }}
        />

        {/* Setup Section Divider */}
        <div className="relative z-10 mb-12 flex items-center gap-4 opacity-80">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-surface-600 to-surface-700" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Setup — Three Steps</p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-surface-600 to-surface-700" />
        </div>

        {/* Stacked Cards Grid (Timeline Removed) */}
        <div className="relative z-10 flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <div 
              key={step.title} 
              className="group relative w-full overflow-hidden rounded-2xl border border-surface-700/50 bg-surface-900/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-surface-500/60 hover:bg-surface-800/60 hover:shadow-[0_12px_40px_rgb(0,0,0,0.6)]"
            >
              {/* Subtle top edge highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              {/* Header Row (Icon + Title) */}
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-surface-700/80 bg-surface-800/50 text-slate-400 shadow-inner transition-colors duration-300 group-hover:border-accent-500/30 group-hover:bg-accent-500/10 group-hover:text-accent-400">
                  <step.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="mb-1 block font-mono text-[10px] font-bold tracking-widest text-accent-400">
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-100">{step.title}</h3>
                </div>
              </div>
              
              <p className="mb-6 text-[14px] leading-relaxed text-slate-400">{step.body}</p>
              
              {/* Inner Code Block Container */}
              <div className="rounded-xl bg-[#0a0a0a] shadow-inner ring-1 ring-white/10">
                 <CodeBlock>{step.code}</CodeBlock>
              </div>
            </div>
          ))}
        </div>

        {/* Strategies Section */}
        <div className="relative z-10 mt-24">
          <div className="mb-12 flex items-center gap-4 opacity-80">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-surface-600 to-surface-700" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Explore Strategies</p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-surface-600 to-surface-700" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {STRATEGY_CARDS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className={`group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-surface-700/60 bg-surface-800/30 p-5 shadow-lg backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 ${s.glow}`}
              >
                {/* Edge light reflection */}
                <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Diagonal Glass Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                
                <div className={`relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-xl border border-surface-600/40 bg-surface-900/60 transition-all duration-300 ${s.iconGlow}`}>
                  <s.icon size={24} strokeWidth={1.5} />
                </div>
                
                <div className="relative z-10 min-w-0 flex-1">
                  <p className="mb-1 font-mono text-[10px] font-bold tracking-[0.15em] text-slate-500 transition-colors group-hover:text-slate-300">
                    STRATEGY {s.tag}
                  </p>
                  <p className="text-base font-semibold tracking-tight text-slate-200 transition-colors group-hover:text-white">
                    {s.name}
                  </p>
                </div>
                
                <div className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-transparent transition-all duration-300 group-hover:border-surface-600/50 group-hover:bg-surface-700/30">
                  <ArrowRight 
                    size={16} 
                    className="text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" 
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}