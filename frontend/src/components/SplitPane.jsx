import { useState, useRef, useEffect } from "react";
import { BookOpen, Radio, GripVertical, GripHorizontal } from "lucide-react";
import { STRATEGY_THEMES } from "../theme.js"; // Assuming this still exists

export default function SplitPane({ guide, target, theme = "UI", direction = "horizontal" }) {
  const isVertical = direction === "vertical";
  const t = STRATEGY_THEMES[theme] ?? STRATEGY_THEMES.UI;
  
  // State for the draggable divider (percentage)
  const [splitRatio, setSplitRatio] = useState(50);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    
    // Only allow horizontal drag on large screens if not explicitly vertical
    const isDesktopHorizontal = !isVertical && window.innerWidth >= 1024;
    const isActuallyVertical = isVertical || (!isDesktopHorizontal && window.innerWidth < 1024);

    const handleMouseMove = (moveEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      if (!isActuallyVertical) {
        const newRatio = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        if (newRatio > 20 && newRatio < 80) setSplitRatio(newRatio);
      } else {
        const newRatio = ((moveEvent.clientY - rect.top) / rect.height) * 100;
        if (newRatio > 20 && newRatio < 80) setSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    // Lock cursor during drag to prevent flickering
    document.body.style.cursor = isActuallyVertical ? "row-resize" : "col-resize";
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full bg-neutral-950 ${
        isVertical ? "flex-col" : "flex-col lg:flex-row"
      }`}
    >
      {/* Guide Pane (Left/Top) */}
      <section 
        className="relative flex flex-col overflow-hidden bg-neutral-950"
        style={{ 
          flexBasis: window.innerWidth >= 1024 && !isVertical ? `${splitRatio}%` : (isVertical ? `${splitRatio}%` : '50%'),
          flexShrink: 0,
          flexGrow: 0 
        }}
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-900/15 blur-[100px]" />

        <div className="relative z-10 flex items-center gap-2 border-b border-neutral-800/80 bg-neutral-900/40 px-6 py-3 backdrop-blur-md">
          <BookOpen size={14} className="text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400/90">
            Guide
          </span>
        </div>
        
        {/* Hidden scrollbars using arbitrary variants */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {guide}
        </div>
      </section>

      {/* Resizer / Divider */}
      <div
        onMouseDown={handleMouseDown}
        className={`group relative z-20 flex flex-none items-center justify-center bg-neutral-900 transition-colors hover:bg-blue-500/20 active:bg-blue-500/30 ${
          isVertical || window.innerWidth < 1024 
            ? "h-1.5 w-full cursor-row-resize border-y border-neutral-800" 
            : "h-full w-1.5 cursor-col-resize border-x border-neutral-800"
        }`}
      >
        <div className="absolute flex h-6 w-6 items-center justify-center rounded bg-neutral-800 border border-neutral-700 text-neutral-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-active:opacity-100">
          {isVertical || window.innerWidth < 1024 ? <GripHorizontal size={14} /> : <GripVertical size={14} />}
        </div>
      </div>

      {/* Target Pane (Right/Bottom) */}
      <section 
        className={`relative flex flex-1 flex-col overflow-hidden bg-neutral-950 ${t.glowBg || ''}`}
      >
        {/* Ambient Glow (Thematic) */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-900/10 blur-[100px]" />

        <div className="relative z-10 flex items-center gap-2 border-b border-neutral-800/80 bg-neutral-900/40 px-6 py-3 backdrop-blur-md">
          <Radio size={14} className={t.icon || "text-emerald-400"} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${t.label || "text-emerald-400/90"}`}>
            Live Target
          </span>
          <span className={`ml-auto h-2 w-2 rounded-full animate-pulse ${t.dot || "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"}`} />
        </div>
        
        {/* Hidden scrollbars */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {target}
        </div>
      </section>
    </div>
  );
}