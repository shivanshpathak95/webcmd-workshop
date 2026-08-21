import { useState, useRef, useEffect } from "react";
import { BookOpen, Radio, GripVertical, GripHorizontal, Maximize2, Minimize2 } from "lucide-react";

export default function SplitPane({ guide, target, direction = "horizontal" }) {
  const isVertical = direction === "vertical";

  const [splitRatio, setSplitRatio] = useState(50);
  const [expanded, setExpanded] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  const isActuallyVertical = isVertical || !isDesktop;
  const targetExpanded = expanded === "target";
  const splitMode = expanded === null;

  const handleMouseDown = (e) => {
    e.preventDefault();

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
    document.body.style.cursor = isActuallyVertical ? "row-resize" : "col-resize";
  };

  const paneStyle = (pane) => {
    if (expanded === pane) {
      return { flexBasis: "100%", flexShrink: 0, flexGrow: 1 };
    }
    if (expanded && expanded !== pane) {
      return { display: "none" };
    }
    if (pane === "guide") {
      return {
        flexBasis: isDesktop && !isVertical ? `${splitRatio}%` : isVertical ? `${splitRatio}%` : "50%",
        flexShrink: 0,
        flexGrow: 0,
      };
    }
    return undefined;
  };

  const ExpandButton = ({ pane, testId }) => {
    const isThisExpanded = expanded === pane;
    return (
      <button
        type="button"
        data-testid={testId}
        onClick={() => setExpanded(isThisExpanded ? null : pane)}
        aria-label={isThisExpanded ? "Exit fullscreen" : "Expand to fullscreen"}
        title={isThisExpanded ? "Exit fullscreen" : "Expand to fullscreen"}
        className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
      >
        {isThisExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full bg-neutral-950 ${isVertical ? "flex-col" : "flex-col lg:flex-row"}`}
    >
      <section
        data-testid="split-pane-guide"
        className="flex flex-col overflow-hidden bg-neutral-950"
        style={paneStyle("guide")}
      >
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-6 py-3">
          <BookOpen size={14} className="text-neutral-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Guide</span>
          <ExpandButton pane="guide" testId="split-pane-guide-expand" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {guide}
        </div>
      </section>

      {splitMode && (
        <div
          data-testid="split-pane-resizer"
          onMouseDown={handleMouseDown}
          className={`group relative z-20 flex flex-none items-center justify-center bg-neutral-900 transition-colors hover:bg-neutral-800 ${
            isActuallyVertical
              ? "h-1.5 w-full cursor-row-resize border-y border-neutral-800"
              : "h-full w-1.5 cursor-col-resize border-x border-neutral-800"
          }`}
        >
          <div className="absolute flex h-6 w-6 items-center justify-center rounded border border-neutral-700 bg-neutral-800 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
            {isActuallyVertical ? <GripHorizontal size={14} /> : <GripVertical size={14} />}
          </div>
        </div>
      )}

      <section
        data-testid="split-pane-target"
        className="relative flex flex-col overflow-hidden bg-neutral-950"
        style={targetExpanded ? paneStyle("target") : splitMode ? { flex: 1 } : { display: "none" }}
      >
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-6 py-3">
          <Radio size={14} className="text-neutral-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Live Target
          </span>
          <span className="h-2 w-2 animate-pulseDot rounded-full bg-emerald-400" />
          <ExpandButton pane="target" testId="split-pane-target-expand" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {target}
        </div>
      </section>
    </div>
  );
}
