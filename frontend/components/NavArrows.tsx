"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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

interface Stripe {
  angleDeg: number;
  thickness: number;
  offset: number;
}

const BTN_SIZE = 52;
const GAP = 22;
const LABEL_GAP = 8;

const EASTER_CODE = "GIFTM4VL";

function computeSlotPosition(slot: Slot, cardRect: DOMRect): Position {
  const half = BTN_SIZE / 2;
  const cx = cardRect.left + cardRect.width / 2;
  const cy = cardRect.top + cardRect.height / 2;

  switch (slot) {
    case "top":
      return { left: cx - half, top: cardRect.top - GAP - BTN_SIZE };
    case "bottom":
      return { left: cx - half, top: cardRect.bottom + GAP };
    case "left":
      return { left: cardRect.left - GAP - BTN_SIZE, top: cy - half };
    case "right":
      return { left: cardRect.right + GAP, top: cy - half };
    case "topLeft":
      return { left: cardRect.left - GAP - BTN_SIZE, top: cardRect.top - GAP - BTN_SIZE };
    case "topRight":
      return { left: cardRect.right + GAP, top: cardRect.top - GAP - BTN_SIZE };
    case "bottomLeft":
      return { left: cardRect.left - GAP - BTN_SIZE, top: cardRect.bottom + GAP };
    case "bottomRight":
      return { left: cardRect.right + GAP, top: cardRect.bottom + GAP };
  }
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

const CAMERA_DURATION = 900;
const SETTLE_DELAY = 150;
const DISSOLVE_DURATION = 320;
const BUBBLE_DURATION = 3000;
const BUBBLE_FADE = 320;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateStripes(): Stripe[] {
  const count = Math.random() < 0.5 ? 1 : 2;
  const stripes: Stripe[] = [];
  for (let i = 0; i < count; i++) {
    const thickness = rand(7, 12);
    const angleDeg = rand(25, 65) * (Math.random() < 0.5 ? 1 : -1);
    const maxOffset = thickness / 2 - 1;
    const offset = rand(-maxOffset, maxOffset);
    stripes.push({ angleDeg, thickness, offset });
  }
  return stripes;
}

function StripeOverlay({
  width,
  height,
  borderRadius,
  stripes,
  easter = false,
  uid,
}: {
  width: number;
  height: number;
  borderRadius: number;
  stripes: Stripe[];
  easter?: boolean;
  uid: string;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const diag = Math.sqrt(width * width + height * height) + 40;

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        borderRadius,
        overflow: "hidden",
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect width={width} height={height} rx={borderRadius} ry={borderRadius} />
        </clipPath>

        {stripes.map((s, i) => {
          const step = Math.max(8, s.thickness * 1.4);
          return (
            <pattern
              key={i}
              id={`hazard-${uid}-${i}`}
              patternUnits="userSpaceOnUse"
              width={step * 2}
              height={s.thickness}
              patternTransform={`rotate(${s.angleDeg + 90})`}
            >
              <rect width={step} height={s.thickness} fill="#facc15" />
              <rect x={step} width={step} height={s.thickness} fill="#0a0a0a" />
            </pattern>
          );
        })}

        {easter && (
          <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g clipPath={`url(#clip-${uid})`} filter={easter ? `url(#glow-${uid})` : undefined}>
        {stripes.map((s, i) => {
          const rad = (s.angleDeg * Math.PI) / 180;
          const nx = -Math.sin(rad);
          const ny = Math.cos(rad);
          const px = cx + nx * s.offset;
          const py = cy + ny * s.offset;
          const dx = Math.cos(rad);
          const dy = Math.sin(rad);
          const x1 = px - dx * diag;
          const y1 = py - dy * diag;
          const x2 = px + dx * diag;
          const y2 = py + dy * diag;

          const hx = nx * (s.thickness / 2 - 1);
          const hy = ny * (s.thickness / 2 - 1);

          return (
            <g key={i} className={easter ? "stripe-pulse" : undefined}>
              <line
                x1={x1 - nx * 1.5}
                y1={y1 - ny * 1.5}
                x2={x2 - nx * 1.5}
                y2={y2 - ny * 1.5}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={s.thickness + 2}
                strokeLinecap="butt"
              />
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`url(#hazard-${uid}-${i})`}
                strokeWidth={s.thickness}
                strokeLinecap="butt"
              />
              <line
                x1={x1 + hx}
                y1={y1 + hy}
                x2={x2 + hx}
                y2={y2 + hy}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={1}
                strokeLinecap="butt"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function NavArrows({ currentId, onMove }: Props) {
  const { lang } = useApp();
  const [clickedTarget, setClickedTarget] = useState<string | null>(null);
  const [dissolving, setDissolving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [positions, setPositions] = useState<Record<string, { btn: Position; label: Position; labelWidth: number }> | null>(null);
  const [bubbles, setBubbles] = useState<Record<string, boolean>>({});
  const bubbleTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [stripeMap, setStripeMap] = useState<Record<string, { btn: Stripe[]; label: Stripe[] }>>({});

  const stripeCacheRef = useRef<Record<string, { btn: Stripe[]; label: Stripe[] }>>({});

  const mountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelMeasureRef = useRef<HTMLDivElement | null>(null);

  const section = getSection(currentId);
  const layout: NavLink[] = section.nav;

  const easterUnlocked = useMemo(() => {
    const disabledLinks = layout.filter((l) => l.disabled);
    if (disabledLinks.length === 0) return false;
    for (const l of disabledLinks) {
      const s = stripeMap[l.targetId];
      if (!s || s.btn.length !== 2) return false;
    }
    return true;
  }, [layout, stripeMap]);

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
        const label = computeLabelPosition(link.slot, btn, labelWidth, rect);
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
    const map: Record<string, { btn: Stripe[]; label: Stripe[] }> = {};
    const sec = getSection(currentId);
    for (const link of sec.nav) {
      if (link.disabled) {
        map[link.targetId] = { btn: generateStripes(), label: generateStripes() };
      }
    }
    stripeCacheRef.current = map;
    setStripeMap(map);
  }, [currentId]);


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
    return (
      <div
        ref={labelMeasureRef}
        style={{
          position: "fixed",
          visibility: "hidden",
          pointerEvents: "none",
          ...labelBase,
        }}
      />
    );
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
        @keyframes stripePulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.78; }
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
        .stripe-pulse { animation: stripePulse 1.8s ease-in-out infinite; }
      `}</style>

      {layout.map((link, idx) => {
        const pos = positions[link.targetId];
        if (!pos) return null;

        let animClass = "arrow-appear";
        if (dissolving) {
          animClass = link.targetId === clickedTarget ? "arrow-dissolve-clicked" : "arrow-dissolve-other";
        }

        const labelText = t(lang, link.labelKey as DictKey);
        const isDisabled = !!link.disabled;
        const stripes = isDisabled ? stripeMap[link.targetId] : null;
        const bubbleVisible = bubbles[link.targetId];

        const bubbleText = isDisabled && easterUnlocked
          ? EASTER_CODE
          : t(lang, "disabledTooltip" as DictKey);

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
              aria-label={isDisabled ? t(lang, "disabledTooltip" as DictKey) : `Go to ${labelText}`}
              aria-disabled={isDisabled || undefined}
            >
              <ArrowIcon rotation={link.rotation} />
              {isDisabled && stripes && (
                <StripeOverlay
                  width={BTN_SIZE}
                  height={BTN_SIZE}
                  borderRadius={BTN_SIZE / 2}
                  stripes={stripes.btn}
                  easter={easterUnlocked}
                  uid={`btn-${link.targetId}`}
                />
              )}
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
              <span style={{ position: "relative", zIndex: 1 }}>{labelText}</span>
              {isDisabled && stripes && (
                <StripeOverlay
                  width={pos.labelWidth}
                  height={26}
                  borderRadius={13}
                  stripes={stripes.label}
                  easter={easterUnlocked}
                  uid={`label-${link.targetId}`}
                />
              )}
            </div>

            {isDisabled && (
              <div
                key={`bubble-${currentId}-${link.targetId}-${bubbleVisible ? "v" : "h"}`}
                className={bubbleVisible ? "bubble-in" : "bubble-out"}
                style={{
                  position: "fixed",
                  left: `${pos.btn.left + BTN_SIZE / 2}px`,
                  top: `${pos.btn.top - 44}px`,
                  transform: "translate(-50%, 0)",
                  padding: "0.45rem 0.75rem",
                  background: easterUnlocked
                    ? "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(20,20,24,0.95))"
                    : "var(--bg-elevated, rgba(20,20,24,0.92))",
                  border: easterUnlocked
                    ? "1px solid rgba(250,204,21,0.5)"
                    : "1px solid var(--border-strong, rgba(255,255,255,0.18))",
                  borderRadius: 8,
                  color: easterUnlocked ? "#facc15" : "var(--text, #fff)",
                  fontSize: easterUnlocked ? "0.78rem" : "0.72rem",
                  fontWeight: easterUnlocked ? 700 : 500,
                  letterSpacing: easterUnlocked ? "0.12em" : "normal",
                  fontFamily: easterUnlocked ? "var(--font-mono, monospace)" : undefined,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 200,
                  backdropFilter: "blur(8px)",
                  boxShadow: easterUnlocked
                    ? "0 6px 20px rgba(250,204,21,0.25), 0 0 0 1px rgba(250,204,21,0.15) inset"
                    : "0 6px 20px rgba(0,0,0,0.25)",
                  opacity: bubbleVisible ? undefined : 0,
                  visibility: bubbleVisible || bubbles[link.targetId] !== undefined ? "visible" : "hidden",
                }}
              >
                {bubbleText}
              </div>
            )}
          </div>
        );
      })}
    </>
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

function computeLabelPosition(slot: Slot, btnPos: Position, labelWidth: number, _cardRect: DOMRect): Position {
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