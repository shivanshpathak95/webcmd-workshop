/**
 * Per-strategy color themes. Each strategy page gets its own accent so the
 * four Live Targets feel visually distinct while sharing one design system.
 * Keep class strings literal (no runtime concatenation) so Tailwind's JIT
 * scanner picks them up from this file at build time.
 */
export const STRATEGY_THEMES = {
  PUBLIC: {
    icon: "text-sky-400",
    label: "text-sky-400/90",
    dot: "bg-sky-400",
    glowBg: "bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.07),transparent_60%)]",
    ring: "focus:border-sky-500 focus:ring-sky-500/20",
    button: "bg-sky-600 hover:bg-sky-500 hover:shadow-[0_0_20px_-4px_rgba(56,189,248,0.6)]",
    pill: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    iconBox: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  },
  COOKIE: {
    icon: "text-amber-400",
    label: "text-amber-400/90",
    dot: "bg-amber-400",
    glowBg: "bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.07),transparent_60%)]",
    ring: "focus:border-amber-500 focus:ring-amber-500/20",
    button: "bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_20px_-4px_rgba(251,191,36,0.6)]",
    pill: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    iconBox: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  INTERCEPT: {
    icon: "text-fuchsia-400",
    label: "text-fuchsia-400/90",
    dot: "bg-fuchsia-400",
    glowBg: "bg-[radial-gradient(circle_at_50%_0%,rgba(232,121,249,0.07),transparent_60%)]",
    ring: "focus:border-fuchsia-500 focus:ring-fuchsia-500/20",
    button: "bg-fuchsia-600 hover:bg-fuchsia-500 hover:shadow-[0_0_20px_-4px_rgba(232,121,249,0.6)]",
    pill: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400",
    iconBox: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400",
  },
  UI: {
    icon: "text-orange-400",
    label: "text-orange-400/90",
    dot: "bg-orange-400",
    glowBg: "bg-[radial-gradient(circle_at_50%_0%,rgba(251,146,60,0.07),transparent_60%)]",
    ring: "focus:border-orange-500 focus:ring-orange-500/20",
    button: "bg-orange-600 hover:bg-orange-500 hover:shadow-[0_0_20px_-4px_rgba(251,146,60,0.6)]",
    pill: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    iconBox: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
};
