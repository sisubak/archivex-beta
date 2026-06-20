"use client";

import { useEffect, useRef, useState } from "react";
import { getSection, NavLink, Slot } from "@/lib/sections";
import { useApp } from "@/lib/AppContext";
import { t, DictKey } from "@/lib/i18n";

interface Props {
  currentId: string;
  onMove: (targetId: string) => void;
}

interface Position {
  left: number;
  top: number;
}

const BTN_SIZE = 52;
const GAP = 22;
const LABEL_GAP = 8;
const VIEWPORT_MARGIN = 8;
const CAMERA_DURATION = 900;
const SETTLE_DELAY = 150;
const DISSOLVE_DURATION = 320;
const BUBBLE_DURATION = 3000;

function by_utf8xbot_3847(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

function computeSlotPosition(slot: Slot, cardRect: DOMRect): Position {
  const half = BTN_SIZE / 2;
  const cx = cardRect.left + cardRect.width / 2;
  const cy = cardRect.top + cardRect.height / 2;

  let raw: Position;
  switch (slot) {
    case "top":
      raw = { left: cx - half, top: cardRect.top - GAP - BTN_SIZE }; break;
    case "bottom":
      raw = { left: cx - half, top: cardRect.bottom + GAP }; break;
    case "left":
      raw = { left: cardRect.left - GAP - BTN_SIZE, top: cy - half }; break;
    case "right":
      raw = { left: cardRect.right + GAP, top: cy - half }; break;
    case "topLeft":
      raw = { left: cardRect.left - GAP - BTN_SIZE, top: cardRect.top - GAP - BTN_SIZE }; break;
    case "topRight":
      raw = { left: cardRect.right + GAP, top: cardRect.top - GAP - BTN_SIZE }; break;
    case "bottomLeft":
      raw = { left: cardRect.left - GAP - BTN_SIZE, top: cardRect.bottom + GAP }; break;
    case "bottomRight":
      raw = { left: cardRect.right + GAP, top: cardRect.bottom + GAP }; break;
  }

  const vw = typeof window !== "undefined" ? window.innerWidth : 9999;
  const vh = typeof window !== "undefined" ? window.innerHeight : 9999;
  return {
    left: by_utf8xbot_3847(raw.left, VIEWPORT_MARGIN, vw - BTN_SIZE - VIEWPORT_MARGIN),
    top: by_utf8xbot_3847(raw.top, VIEWPORT_MARGIN, vh - BTN_SIZE - VIEWPORT_MARGIN),
  };
}

const arrowBase: React.CSSProperties = {
  position: "fixed",
  width: `${BTN_SIZE}px`,
  height: `${BTN_SIZE}px`,
  borderRadius: "50%",
  border: "1px solid var(--border)",
  background: "var(--btn-bg)",
  color: "var(--text)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  backdropFilter: "blur(8px)",
  transition: "background 0.2s, border-color 0.2s, color var(--transition-theme)",
};

const labelBase: React.CSSProperties = {
  position: "fixed",
  height: "26px",
  padding: "0 14px",
  borderRadius: "999px",
  border: "1px solid var(--border)",
  background: "var(--btn-bg)",
  color: "var(--text-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
  zIndex: 100,
  backdropFilter: "blur(8px)",
  pointerEvents: "none",
  transition: "background 0.2s, color var(--transition-theme), border-color var(--transition-theme)",
};

function ArrowIcon({ rotation }: { rotation: number }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function measureLabel(text: string): number {
  if (typeof document === "undefined") return 80;
  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.visibility = "hidden";
  probe.style.height = "26px";
  probe.style.padding = "0 14px";
  probe.style.fontSize = "0.72rem";
  probe.style.fontWeight = "500";
  probe.style.letterSpacing = "0.02em";
  probe.style.whiteSpace = "nowrap";
  probe.style.display = "inline-flex";
  probe.style.alignItems = "center";
  probe.textContent = text;
  document.body.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  document.body.removeChild(probe);
  return Math.ceil(w);
}

function computeLabelPosition(slot: Slot, btnPos: Position, labelWidth: number): Position {
  const btnCenterX = btnPos.left + BTN_SIZE / 2;
  const btnBottom = btnPos.top + BTN_SIZE;
  const btnTop = btnPos.top;
  const labelH = 26;

  switch (slot) {
    case "top":
    case "topLeft":
    case "topRight":
      return { left: btnCenterX - labelWidth / 2, top: btnTop - LABEL_GAP - labelH };
    case "bottom":
    case "bottomLeft":
    case "bottomRight":
      return { left: btnCenterX - labelWidth / 2, top: btnBottom + LABEL_GAP };
    case "left":
      return { left: btnCenterX - labelWidth / 2, top: btnBottom + LABEL_GAP };
    case "right":
      return { left: btnCenterX - labelWidth / 2, top: btnBottom + LABEL_GAP };
  }
}

export default function NavArrows({ currentId, onMove }: Props) {
  const { lang } = useApp();
  const [clickedTarget, setClickedTarget] = useState<string | null>(null);
  const [dissolving, setDissolving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [positions, setPositions] = useState<Record<string, { btn: Position; label: Position; labelWidth: number }> | null>(null);
  const [bubbles, setBubbles] = useState<Record<string, boolean>>({});
  const bubbleTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const mountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const section = getSection(currentId);
  const layout: NavLink[] = section.nav;

  useEffect(() => {
    if (mountTimerRef.current) clearTimeout(mountTimerRef.current);
    setMounted(false);
    setPositions(null);
    setClickedTarget(null);
    setDissolving(false);
    setBubbles({});

    const recompute = () => {
      const card = document.querySelector<HTMLElement>(
        `[data-section-card="${currentId}"]`
      );
      if (!card) return;
      const rect = card.getBoundingClientRect();

      const next: Record<string, { btn: Position; label: Position; labelWidth: number }> = {};
      for (const link of layout) {
        const btn = computeSlotPosition(link.slot, rect);
        const text = t(lang, link.labelKey as DictKey);
        const labelWidth = measureLabel(text);
        const label = computeLabelPosition(link.slot, btn, labelWidth);
        next[link.targetId] = { btn, label, labelWidth };
      }
      setPositions(next);
    };

    mountTimerRef.current = setTimeout(() => {
      recompute();
      setMounted(true);
    }, CAMERA_DURATION + SETTLE_DELAY);

    const onResize = () => recompute();
    window.addEventListener("resize", onResize);

    return () => {
      if (mountTimerRef.current) clearTimeout(mountTimerRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [currentId, lang]);

  useEffect(() => {
    return () => {
      Object.values(bubbleTimersRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleClick = (link: NavLink) => {
    if (dissolving) return;
    if (link.disabled) {
      showBubble(link.targetId);
      return;
    }
    setClickedTarget(link.targetId);
    setDissolving(true);
    setTimeout(() => onMove(link.targetId), DISSOLVE_DURATION);
  };

  const showBubble = (targetId: string) => {
    if (bubbleTimersRef.current[targetId]) {
      clearTimeout(bubbleTimersRef.current[targetId]);
    }
    setBubbles((prev) => ({ ...prev, [targetId]: true }));
    bubbleTimersRef.current[targetId] = setTimeout(() => {
      setBubbles((prev) => ({ ...prev, [targetId]: false }));
    }, BUBBLE_DURATION);
  };

  if (!mounted || !positions) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes pixelDissolveOut {
          0%   { opacity: 1; filter: contrast(1) brightness(1); transform: scale(1); }
          50%  { opacity: 0.55; filter: contrast(1.8) brightness(1.4); transform: scale(0.93); }
          100% { opacity: 0; filter: contrast(3) brightness(2); transform: scale(0.7); }
        }
        @keyframes pixelDissolveOutSoft {
          0%   { opacity: 1; filter: contrast(1) brightness(1); transform: scale(1); }
          60%  { opacity: 0.5; filter: contrast(1.5) brightness(1.2); transform: scale(0.95); }
          100% { opacity: 0; filter: contrast(2) brightness(1.5); transform: scale(0.8); }
        }
        @keyframes pixelAppearIn {
          0%   { opacity: 0; filter: contrast(2.5) brightness(1.8); transform: scale(0.8); }
          60%  { opacity: 0.9; filter: contrast(1.4) brightness(1.2); transform: scale(1.04); }
          100% { opacity: 1; filter: contrast(1) brightness(1); transform: scale(1); }
        }
        @keyframes bubbleIn {
          0%   { opacity: 0; transform: translate(-50%, 6px) scale(0.92); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes bubbleOut {
          0%   { opacity: 1; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 0; transform: translate(-50%, 6px) scale(0.92); }
        }
        .arrow-btn { transition: background 0.2s, border-color 0.2s; }
        .arrow-btn:hover {
          background: var(--btn-bg-hover) !important;
          border-color: var(--border-strong) !important;
        }
        .arrow-btn-disabled:hover {
          background: var(--btn-bg) !important;
          border-color: var(--border) !important;
        }
        .arrow-appear { animation: pixelAppearIn 0.5s steps(6, end) both; }
        .arrow-dissolve-clicked {
          animation: pixelDissolveOut 0.32s steps(6, end) both !important;
          pointer-events: none;
        }
        .arrow-dissolve-other {
          animation: pixelDissolveOutSoft 0.32s steps(6, end) both !important;
          pointer-events: none;
        }
        .bubble-in  { animation: bubbleIn 0.32s ease-out both; }
        .bubble-out { animation: bubbleOut 0.32s ease-in both; }
        @media (max-width: 768px) {
          .nav-arrows-root { display: none !important; }
        }
      `}</style>

      <div className="nav-arrows-root">
        {layout.map((link, idx) => {
          const pos = positions[link.targetId];
          if (!pos) return null;

          let animClass = "arrow-appear";
          if (dissolving) {
            animClass = link.targetId === clickedTarget ? "arrow-dissolve-clicked" : "arrow-dissolve-other";
          }

          const labelText = t(lang, link.labelKey as DictKey);
          const isDisabled = !!link.disabled;
          const bubbleVisible = !!bubbles[link.targetId];
          const bubbleText = t(lang, "disabledTooltip" as DictKey);

          return (
            <div key={`${currentId}-${link.targetId}`}>
              <button
                className={`arrow-btn ${isDisabled ? "arrow-btn-disabled" : ""} ${animClass}`}
                style={{
                  ...arrowBase,
                  left: `${pos.btn.left}px`,
                  top: `${pos.btn.top}px`,
                  animationDelay: dissolving ? "0s" : `${idx * 60}ms`,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  position: "fixed",
                  overflow: "hidden",
                }}
                onClick={() => handleClick(link)}
                aria-label={isDisabled ? bubbleText : `Go to ${labelText}`}
                aria-disabled={isDisabled || undefined}
              >
                <ArrowIcon rotation={link.rotation} />
              </button>

              <div
                className={animClass}
                style={{
                  ...labelBase,
                  left: `${pos.label.left}px`,
                  top: `${pos.label.top}px`,
                  width: `${pos.labelWidth}px`,
                  animationDelay: dissolving ? "0s" : `${idx * 60 + 40}ms`,
                  overflow: "hidden",
                }}
              >
                <span>{labelText}</span>
              </div>

              {isDisabled && (
                <div
                  className={bubbleVisible ? "bubble-in" : "bubble-out"}
                  style={{
                    position: "fixed",
                    left: `${pos.btn.left + BTN_SIZE / 2}px`,
                    top: `${pos.btn.top - 44}px`,
                    transform: "translate(-50%, 0)",
                    padding: "0.45rem 0.75rem",
                    background: "var(--bg-elevated, rgba(20,20,24,0.92))",
                    border: "1px solid var(--border-strong, rgba(255,255,255,0.18))",
                    borderRadius: 8,
                    color: "var(--text, #fff)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 200,
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                    visibility: bubbleVisible ? "visible" : "hidden",
                  }}
                >
                  {bubbleText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}