/**
 * Shared neutral theme for all strategy pages.
 * Strategies are differentiated by label and icon, not by color.
 */
const NEUTRAL_THEME = {
  icon: "text-neutral-400",
  label: "text-neutral-400",
  dot: "bg-emerald-400",
  glowBg: "",
  ring: "focus:border-neutral-500 focus:ring-neutral-500/20",
  button: "bg-neutral-700 hover:bg-neutral-600",
  pill: "border-neutral-700 bg-neutral-800 text-neutral-300",
  iconBox: "border-neutral-700 bg-neutral-800 text-neutral-300",
};

export const STRATEGY_THEMES = {
  PUBLIC: NEUTRAL_THEME,
  COOKIE: NEUTRAL_THEME,
  INTERCEPT: NEUTRAL_THEME,
  UI: NEUTRAL_THEME,
};
