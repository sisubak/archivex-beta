"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { t, tArr } from "@/lib/i18n";

const IDLE_MS = 10_000;
const QUOTE_VISIBLE_MS = 3000;
const LINK_QUOTE_VISIBLE_MS = 6000;
const BUBBLE_FADE_MS = 320;
const STORAGE_KEY = "archivex.x.quoteIndex";
const STORAGE_DONE_KEY = "archivex.x.done";

type Phase = "armed" | "ready" | "speaking";

function isUrl(s: string) {
return /^https?:\/\//i.test(s);
}

function readIndex(): number {
try {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === null) return 0;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
} catch {
  return 0;
}
}

function writeIndex(i: number) {
try {
  localStorage.setItem(STORAGE_KEY, String(i));
} catch {}
}

function readDone(): boolean {
try {
  return localStorage.getItem(STORAGE_DONE_KEY) === "1";
} catch {
  return false;
}
}

function writeDone() {
try {
  localStorage.setItem(STORAGE_DONE_KEY, "1");
} catch {}
}

interface EyeProps {
side: "left" | "right";
visible: boolean;
pupilOffset: { x: number; y: number };
}

function Eye({ side, visible, pupilOffset }: EyeProps) {
const positionStyle: React.CSSProperties =
  side === "left"
    ? { left: "calc(50% - 0.28em)", transform: visible ? "translate(-50%, 0) scale(1)" : "translate(-50%, 0) scale(0.4)" }
    : { left: "calc(50% + 0.28em)", transform: visible ? "translate(-50%, 0) scale(1)" : "translate(-50%, 0) scale(0.4)" };

return (
  <span
    aria-hidden
    style={{
      position: "absolute",
      top: "30%",
      width: "0.42em",
      height: "0.42em",
      borderRadius: "50%",
      background: "white",
      border: "1px solid rgba(0,0,0,0.4)",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.28s ease, transform 0.28s ease",
      pointerEvents: "none",
      ...positionStyle,
    }}
  >
    <span
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "45%",
        height: "45%",
        borderRadius: "50%",
        background: "#000",
        transform: `translate(calc(-50% + ${pupilOffset.x}px), calc(-50% + ${pupilOffset.y}px))`,
        transition: "transform 0.12s ease-out",
      }}
    />
  </span>
);
}

export default function ArchiveXLogo() {
const { lang } = useApp();
const xRef = useRef<HTMLSpanElement | null>(null);

const [phase, setPhase] = useState<Phase>("armed");
const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
const [bubbleClosing, setBubbleClosing] = useState(false);
const [quoteText, setQuoteText] = useState<string>("");
const [disabled, setDisabled] = useState<boolean>(false);

const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const phaseRef = useRef<Phase>("armed");
phaseRef.current = phase;

const clearIdleTimer = () => {
  if (idleTimerRef.current) {
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
  }
};

const updatePupils = (cx: number, cy: number, tx: number, ty: number) => {
  const dx = tx - cx;
  const dy = ty - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const maxR = 2.5;
  setPupilOffset({ x: (dx / dist) * maxR, y: (dy / dist) * maxR });
};

const startIdleTimer = () => {
  clearIdleTimer();
  idleTimerRef.current = setTimeout(() => {
    const xEl = xRef.current;
    if (xEl) {
      const rect = xEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      updatePupils(cx, cy, window.innerWidth / 2, window.innerHeight / 2);
    }
    setPhase("ready");
  }, IDLE_MS);
};

useEffect(() => {
  if (readDone()) {
    setDisabled(true);
    return;
  }

  const onMove = (e: MouseEvent) => {
    if (document.hidden) return;
    const p = phaseRef.current;
    if (p === "armed") {
      startIdleTimer();
    } else if (p === "ready") {
      const xEl = xRef.current;
      if (xEl) {
        const rect = xEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        updatePupils(cx, cy, e.clientX, e.clientY);
      }
    }
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (phaseRef.current === "armed") clearIdleTimer();
    } else {
      if (phaseRef.current === "armed") startIdleTimer();
    }
  };

  if (!document.hidden) startIdleTimer();

  window.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

  return () => {
    window.removeEventListener("mousemove", onMove);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    clearIdleTimer();
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };
}, []);

const handleXClick = () => {
  if (phaseRef.current !== "ready" || disabled) return;

  const quotes = tArr(lang, "xQuotes");
  if (quotes.length === 0) return;

  let idx = readIndex();
  if (idx >= quotes.length) idx = quotes.length - 1;
  const text = quotes[idx];
  const isLast = idx >= quotes.length - 1;

  setQuoteText(text);
  setPhase("speaking");
  setBubbleClosing(false);

  const visibleMs = isUrl(text) ? LINK_QUOTE_VISIBLE_MS : QUOTE_VISIBLE_MS;

  if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
  bubbleTimerRef.current = setTimeout(() => {
    setBubbleClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setBubbleClosing(false);
      if (isLast) {
        writeDone();
        setDisabled(true);
        setPhase("armed");
      } else {
        writeIndex(idx + 1);
        setPhase("armed");
        if (!document.hidden) startIdleTimer();
      }
    }, BUBBLE_FADE_MS);
  }, visibleMs);
};

const eyesVisible = !disabled && phase === "ready";
const bubbleOpen = phase === "speaking";
const xClickable = !disabled && phase === "ready";
const quoteIsLink = isUrl(quoteText);

return (
  <h1
    style={{
      fontSize: "var(--fs-menu)",
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: "-0.04em",
      position: "relative",
      display: "inline-block",
      margin: 0,
    }}
  >
    <style>{`
      @keyframes bubbleIn {
        from { opacity: 0; transform: translate(-50%, 6px) scale(0.85); }
        to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
      }
      @keyframes bubbleOut {
        from { opacity: 1; transform: translate(-50%, 0) scale(1); }
        to   { opacity: 0; transform: translate(-50%, 4px) scale(0.9); }
      }
      .archivex-x-clickable {
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .archivex-x-clickable:hover {
        transform: scale(1.04);
      }
      .archivex-bubble-link {
        color: var(--accent, #5b9bff);
        text-decoration: underline;
        pointer-events: auto;
      }
    `}</style>

    <span>Archive</span>
    <span
      ref={xRef}
      className={`accent-x ${xClickable ? "archivex-x-clickable" : ""}`}
      onClick={xClickable ? handleXClick : undefined}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: xClickable ? "pointer" : "default",
      }}
    >
      X

      <Eye side="left" visible={eyesVisible} pupilOffset={pupilOffset} />
      <Eye side="right" visible={eyesVisible} pupilOffset={pupilOffset} />

      {bubbleOpen && (
        <span
          style={{
            position: "absolute",
            top: "-2.4em",
            left: "50%",
            transform: "translate(-50%, 0)",
            padding: "0.45em 0.75em",
            borderRadius: "0.6em",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            color: "var(--text)",
            fontSize: "0.32em",
            fontWeight: 600,
            letterSpacing: "normal",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            animation: bubbleClosing
              ? `bubbleOut ${BUBBLE_FADE_MS}ms ease-in both`
              : "bubbleIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            pointerEvents: quoteIsLink ? "auto" : "none",
          }}
        >
          {quoteIsLink ? (
            <a
              href={quoteText}
              target="_blank"
              rel="noopener noreferrer"
              className="archivex-bubble-link"
              onClick={(e) => e.stopPropagation()}
            >
              {quoteText}
            </a>
          ) : (
            quoteText
          )}
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: "8px",
              height: "8px",
              background: "var(--bg-elevated)",
              borderRight: "1px solid var(--border-strong)",
              borderBottom: "1px solid var(--border-strong)",
            }}
          />
        </span>
      )}
    </span>
  </h1>
);
}
