import { Rocket, Globe, Cookie, Radio, MousePointerClick } from "lucide-react";

export const INTRO_ROUTE = { to: "/", label: "Introduction", icon: Rocket, end: true };

export const STRATEGIES = [
  {
    to: "/strategies/public",
    slug: "public",
    label: "Public Bypass",
    shortLabel: "Public Bypass",
    tag: "01",
    strategy: "PUBLIC",
    icon: Globe,
    speed: 3,
    color: "text-neutral-300 bg-neutral-800 border-neutral-700",
    navTestId: "nav-strategy-public",
  },
  {
    to: "/strategies/cookie",
    slug: "cookie",
    label: "Authenticated Cookie Jars",
    shortLabel: "Cookie Jars",
    tag: "02",
    strategy: "COOKIE",
    icon: Cookie,
    speed: 2,
    color: "text-neutral-300 bg-neutral-800 border-neutral-700",
    navTestId: "nav-strategy-cookie",
  },
  {
    to: "/strategies/intercept",
    slug: "intercept",
    label: "Network Interception",
    shortLabel: "Interception",
    tag: "03",
    strategy: "INTERCEPT",
    icon: Radio,
    speed: 2,
    color: "text-neutral-300 bg-neutral-800 border-neutral-700",
    navTestId: "nav-strategy-intercept",
  },
  {
    to: "/strategies/ui",
    slug: "ui",
    label: "Complex UI Automation",
    shortLabel: "UI Automation",
    tag: "04",
    strategy: "UI",
    icon: MousePointerClick,
    speed: 1,
    color: "text-neutral-300 bg-neutral-800 border-neutral-700",
    navTestId: "nav-strategy-ui",
  },
];

export const ROUTE_META = {
  "/": { title: "Introduction & Setup", icon: Rocket },
  ...Object.fromEntries(
    STRATEGIES.map((s) => [
      s.to,
      { title: s.label, icon: s.icon, strategy: s.strategy, color: s.color, speed: s.speed },
    ])
  ),
};

export function getStrategyNeighbors(pathname) {
  const idx = STRATEGIES.findIndex((s) => s.to === pathname);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? STRATEGIES[idx - 1] : null,
    next: idx < STRATEGIES.length - 1 ? STRATEGIES[idx + 1] : null,
  };
}
