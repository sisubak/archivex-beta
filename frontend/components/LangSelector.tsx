"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/AppContext";
import { LANGS, LangOption } from "@/lib/i18n";

const FLAGS: Record<string, React.ReactNode> = {
gb: (
  <>
    <rect width="60" height="40" fill="#012169" />
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3" />
    <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
  </>
),
ru: (
  <>
    <rect width="60" height="13.33" y="0" fill="#fff" />
    <rect width="60" height="13.34" y="13.33" fill="#0039A6" />
    <rect width="60" height="13.33" y="26.67" fill="#D52B1E" />
  </>
),
ua: (
  <>
    <rect width="60" height="20" y="0" fill="#005BBB" />
    <rect width="60" height="20" y="20" fill="#FFD500" />
  </>
),
es: (
  <>
    <rect width="60" height="10" y="0" fill="#AA151B" />
    <rect width="60" height="20" y="10" fill="#F1BF00" />
    <rect width="60" height="10" y="30" fill="#AA151B" />
  </>
),
cn: (
  <>
    <rect width="60" height="40" fill="#DE2910" />
    <g fill="#FFDE00">
      <polygon points="12,8 13.8,13.5 19.5,13.5 14.85,17 16.65,22.5 12,19 7.35,22.5 9.15,17 4.5,13.5 10.2,13.5" />
      <polygon points="24,4 24.7,6 26.8,6 25.05,7.2 25.75,9.2 24,8 22.25,9.2 22.95,7.2 21.2,6 23.3,6" />
      <polygon points="28,8 28.7,10 30.8,10 29.05,11.2 29.75,13.2 28,12 26.25,13.2 26.95,11.2 25.2,10 27.3,10" />
      <polygon points="28,14 28.7,16 30.8,16 29.05,17.2 29.75,19.2 28,18 26.25,19.2 26.95,17.2 25.2,16 27.3,16" />
      <polygon points="24,18 24.7,20 26.8,20 25.05,21.2 25.75,23.2 24,22 22.25,23.2 22.95,21.2 21.2,20 23.3,20" />
    </g>
  </>
),
tr: (
  <>
    <rect width="60" height="40" fill="#E30A17" />
    <circle cx="22" cy="20" r="8" fill="#fff" />
    <circle cx="24" cy="20" r="6.4" fill="#E30A17" />
    <polygon
      points="32,20 28.5,21.13 30.66,18.16 30.66,21.84 28.5,18.87"
      fill="#fff"
      transform="translate(2.5,0)"
    />
  </>
),
br: (
  <>
    <rect width="60" height="40" fill="#009C3B" />
    <polygon points="30,4 56,20 30,36 4,20" fill="#FFDF00" />
    <circle cx="30" cy="20" r="8" fill="#002776" />
    <path
      d="M 22,18 Q 30,14 38,18"
      stroke="#fff"
      strokeWidth="1.4"
      fill="none"
    />
  </>
),
};

const FLAG_STYLE: React.CSSProperties = {
display: "block",
borderRadius: 2,
flexShrink: 0,
overflow: "hidden",
boxShadow: "0 0 0 1px rgba(0,0,0,0.12) inset",
};

function Flag({ code, w, h }: { code: string; w: number; h: number }) {
return (
  <svg
    width={w}
    height={h}
    viewBox="0 0 60 40"
    preserveAspectRatio="xMidYMid slice"
    style={FLAG_STYLE}
    aria-hidden="true"
  >
    {FLAGS[code] ?? <rect width="60" height="40" fill="#888" />}
  </svg>
);
}

interface DropdownPos {
top: number;
left: number;
}

const KEYFRAMES = `@keyframes langDropIn {
0%   { opacity: 0; transform: translate(-50%, -6px) scale(0.94); }
100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
}`;

let keyframesInjected = false;
function ensureKeyframes() {
if (typeof document === "undefined" || keyframesInjected) return;
const style = document.createElement("style");
style.setAttribute("data-lang-selector", "");
style.textContent = KEYFRAMES;
document.head.appendChild(style);
keyframesInjected = true;
}

export default function LangSelector() {
const { lang, setLang } = useApp();
const [open, setOpen] = useState(false);
const [pos, setPos] = useState<DropdownPos | null>(null);
const [mounted, setMounted] = useState(false);
const [activeIdx, setActiveIdx] = useState<number>(-1);
const btnRef = useRef<HTMLButtonElement | null>(null);
const dropRef = useRef<HTMLDivElement | null>(null);
const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
const returnFocusRef = useRef<HTMLElement | null>(null);

const current: LangOption = useMemo(
  () => LANGS.find((l) => l.code === lang) ?? LANGS[0],
  [lang]
);
const currentIdx = useMemo(
  () => LANGS.findIndex((l) => l.code === current.code),
  [current.code]
);

useEffect(() => {
  setMounted(true);
  ensureKeyframes();
}, []);

useEffect(() => {
  if (!open) return;
  if (typeof window === "undefined") return;

  const compute = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left + r.width / 2 });
  };

  compute();
  window.addEventListener("scroll", compute, { passive: true, capture: true });
  window.addEventListener("resize", compute, { passive: true });
  return () => {
    window.removeEventListener("scroll", compute, true);
    window.removeEventListener("resize", compute);
  };
}, [open]);

useEffect(() => {
  if (!open) return;
  const onDown = (e: MouseEvent | TouchEvent) => {
    const target = e.target as Node;
    if (btnRef.current?.contains(target)) return;
    if (dropRef.current?.contains(target)) return;
    setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      returnFocusRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1 >= LANGS.length ? 0 : i + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? LANGS.length - 1 : i - 1));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIdx(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIdx(LANGS.length - 1);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      if (activeIdx >= 0 && activeIdx < LANGS.length) {
        e.preventDefault();
        pick(LANGS[activeIdx].code);
      }
    }
  };
  document.addEventListener("mousedown", onDown);
  document.addEventListener("touchstart", onDown, { passive: true });
  document.addEventListener("keydown", onKey);
  return () => {
    document.removeEventListener("mousedown", onDown);
    document.removeEventListener("touchstart", onDown);
    document.removeEventListener("keydown", onKey);
  };
}, [open, activeIdx]);

useEffect(() => {
  if (open && activeIdx >= 0) {
    itemRefs.current[activeIdx]?.focus();
  }
}, [open, activeIdx]);

const pick = useCallback(
  (code: LangOption["code"]) => {
    setLang(code);
    setOpen(false);
    returnFocusRef.current?.focus();
  },
  [setLang]
);

const handleOpen = useCallback(() => {
  returnFocusRef.current = (document.activeElement as HTMLElement) ?? btnRef.current;
  setActiveIdx(currentIdx >= 0 ? currentIdx : 0);
  setOpen(true);
}, [currentIdx]);

const handleToggle = useCallback(() => {
  if (open) {
    setOpen(false);
    return;
  }
  handleOpen();
}, [open, handleOpen]);

const handleButtonKeyDown = useCallback(
  (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  },
  [handleOpen]
);

return (
  <div style={{ position: "relative", display: "inline-block" }}>
    <button
      ref={btnRef}
      onClick={handleToggle}
      onKeyDown={handleButtonKeyDown}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-label={`Language: ${current.nativeLabel}`}
      title={current.nativeLabel}
      style={{
        width: 44,
        height: 44,
        padding: 0,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--btn-bg)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition:
          "border-color 0.2s, background var(--transition-theme), transform 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Flag code={current.flagCode} w={38} h={26} />
      </span>
    </button>

    {mounted && open && pos &&
      createPortal(
        <div
          ref={dropRef}
          role="listbox"
          aria-activedescendant={
            activeIdx >= 0 ? `lang-opt-${LANGS[activeIdx].code}` : undefined
          }
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, 0)",
            transformOrigin: "top center",
            minWidth: 220,
            maxWidth: "calc(100vw - 16px)",
            maxHeight: "min(60vh, 60dvh)",
            overflowY: "auto",
            padding: 4,
            background: "var(--card-bg-solid, var(--btn-bg))",
            border: "1px solid var(--border)",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0,0,0,0.32)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 9999,
            animation: "langDropIn 0.18s ease-out both",
            color: "var(--text)",
          }}
        >
          {LANGS.map((opt, i) => {
            const active = opt.code === current.code;
            const highlighted = i === activeIdx;
            return (
              <button
                key={opt.code}
                id={`lang-opt-${opt.code}`}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="option"
                aria-selected={active}
                onClick={() => pick(opt.code)}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  minHeight: 44,
                  border: "none",
                  borderRadius: 6,
                  background: highlighted
                    ? "var(--btn-bg-hover, rgba(255,255,255,0.07))"
                    : active
                    ? "var(--btn-bg-hover, rgba(255,255,255,0.04))"
                    : "transparent",
                  color: "var(--text)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 500,
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
              >
                <Flag code={opt.flagCode} w={24} h={16} />
                <span style={{ flex: 1, whiteSpace: "nowrap" }}>
                  {opt.nativeLabel}
                </span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    opacity: 0.5,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.05em",
                  }}
                >
                  {opt.label}
                </span>
                {active && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginLeft: 2, opacity: 0.8 }}
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
  </div>
);
}
