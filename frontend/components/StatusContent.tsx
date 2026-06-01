"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";
import { SITE_STATS } from "@/lib/stats";
import LangWipe from "./LangWipe";

interface CounterProps {
target: number;
duration?: number;
}

function AnimatedCounter({ target, duration = 1400 }: CounterProps) {
const [value, setValue] = useState(0);
const startedRef = useRef(false);
const rafRef = useRef<number | null>(null);

useEffect(() => {
  if (startedRef.current) return;
  startedRef.current = true;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    setValue(target);
    return;
  }

  const start = performance.now();
  const tick = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setValue(Math.floor(eased * target));
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setValue(target);
      rafRef.current = null;
    }
  };
  rafRef.current = requestAnimationFrame(tick);

  return () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };
}, [target, duration]);

return <>{value.toLocaleString()}</>;
}

interface StatItemProps {
label: React.ReactNode;
value: number;
badge?: React.ReactNode;
}

function StatItem({ label, value, badge }: StatItemProps) {
return (
  <div
    style={{
      position: "relative",
      padding:
        "clamp(0.85rem, 0.6rem + 0.6vw, 1.1rem) clamp(0.95rem, 0.7rem + 0.7vw, 1.3rem)",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      background: "var(--btn-bg)",
      transition:
        "background var(--transition-theme), border-color var(--transition-theme)",
      minWidth: 0,
    }}
  >
    {badge}
    <div
      style={{
        fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2.2rem)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        marginBottom: "0.4rem",
        color: "var(--text)",
      }}
    >
      <AnimatedCounter target={value} />
    </div>
    <div
      style={{
        fontSize: "var(--fs-xs)",
        color: "var(--text-muted)",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </div>
  </div>
);
}

const CLOSE_ANIM_MS = 240;
const FOCUSABLE_SELECTOR =
'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ChatModalProps {
src: string;
caption: React.ReactNode;
onClose: () => void;
}

function ChatModal({ src, caption, onClose }: ChatModalProps) {
const [mounted, setMounted] = useState(false);
const [closing, setClosing] = useState(false);
const closeTimerRef = useRef<number | null>(null);
const dialogRef = useRef<HTMLDivElement | null>(null);
const returnFocusRef = useRef<HTMLElement | null>(null);

const requestClose = useCallback(() => {
  if (closing) return;
  setClosing(true);
  closeTimerRef.current = window.setTimeout(() => onClose(), CLOSE_ANIM_MS);
}, [closing, onClose]);

useEffect(() => {
  setMounted(true);
  returnFocusRef.current = document.activeElement as HTMLElement | null;

  const prevOverflow = document.body.style.overflow;
  const prevPaddingRight = document.body.style.paddingRight;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  document.body.style.overflow = "hidden";

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      requestClose();
      return;
    }
    if (e.key === "Tab" && dialogRef.current) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener("keydown", onKey);

  return () => {
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = prevOverflow;
    document.body.style.paddingRight = prevPaddingRight;
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    returnFocusRef.current?.focus?.();
  };
}, [requestClose]);

useEffect(() => {
  if (!mounted) return;
  const id = window.setTimeout(() => {
    const closeBtn = dialogRef.current?.querySelector<HTMLElement>(
      '[data-modal-close="true"]'
    );
    closeBtn?.focus();
  }, 30);
  return () => clearTimeout(id);
}, [mounted]);

if (!mounted || typeof document === "undefined") return null;

return createPortal(
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Community chat preview"
    onClick={requestClose}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      height: "100dvh",
      background: "rgba(0,0,0,0.78)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "zoom-out",
      padding:
        "calc(var(--safe-top, 0px) + 1rem) calc(var(--safe-right, 0px) + 1rem) calc(var(--safe-bottom, 0px) + 1rem) calc(var(--safe-left, 0px) + 1rem)",
      animation: closing
        ? `chatModalFadeOut ${CLOSE_ANIM_MS}ms ease-in both`
        : "chatModalFadeIn 0.2s ease-out both",
    }}
  >
    <style>{`
      @keyframes chatModalFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes chatModalFadeOut {
        from { opacity: 1; }
        to   { opacity: 0; }
      }
      @keyframes chatModalPopIn {
        from { opacity: 0; transform: scale(0.92); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes chatModalPopOut {
        from { opacity: 1; transform: scale(1); }
        to   { opacity: 0; transform: scale(0.9); }
      }
    `}</style>
    <div
      ref={dialogRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        maxWidth: "min(900px, 100%)",
        maxHeight: "100%",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-elev, var(--bg-elevated))",
        animation: closing
          ? `chatModalPopOut ${CLOSE_ANIM_MS}ms cubic-bezier(0.4, 0, 0.6, 1) both`
          : "chatModalPopIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        cursor: "default",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <img
          src={src}
          alt="Community chat full"
          draggable={false}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          flex: "0 0 auto",
          padding: "0.7rem 1rem",
          fontSize: "var(--fs-xs)",
          color: "var(--text-muted)",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-elev, var(--bg-elevated))",
        }}
      >
        {caption}
      </div>
      <button
        data-modal-close="true"
        onClick={(e) => {
          e.stopPropagation();
          requestClose();
        }}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "0.6rem",
          right: "0.6rem",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "1px solid var(--border-strong)",
          background: "var(--btn-bg)",
          color: "var(--text)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "background 0.18s, transform 0.18s",
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--btn-bg-hover)";
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--btn-bg)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>,
  document.body
);
}

function ChatBadge({ src, caption }: { src: string; caption: React.ReactNode }) {
const [open, setOpen] = useState(false);

return (
  <>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
      aria-label="View community chat"
      aria-haspopup="dialog"
      style={{
        position: "absolute",
        right: "-8px",
        bottom: "-8px",
        width: "clamp(40px, 8vw, 44px)",
        height: "clamp(40px, 8vw, 44px)",
        borderRadius: "10px",
        border: "1px solid var(--border-strong)",
        background: "var(--bg-elev, var(--bg-elevated))",
        padding: 0,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
        transition: "transform 0.18s ease, border-color 0.18s",
        zIndex: 2,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </button>

    {open && (
      <ChatModal src={src} caption={caption} onClose={() => setOpen(false)} />
    )}
  </>
);
}

export default function StatusContent() {
const { lang } = useApp();

return (
  <div style={{ width: "100%", minWidth: 0 }}>
    <h1
      style={{
        fontSize: "var(--fs-h2)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        marginBottom: "0.3rem",
      }}
    >
      <LangWipe>{t(lang, "statsTitle")}</LangWipe>
    </h1>
    <p
      className="font-mono"
      style={{
        opacity: 0.45,
        fontSize: "var(--fs-xs)",
        letterSpacing: "0.05em",
        color: "var(--text-muted)",
        marginBottom: "1.2rem",
        textTransform: "uppercase",
      }}
    >
      [ status ]
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))",
        gap: "0.75rem",
      }}
    >
      <StatItem
        label={<LangWipe>{t(lang, "statsClients")}</LangWipe>}
        value={SITE_STATS.clients}
      />
      <StatItem
        label={<LangWipe>{t(lang, "statsArts")}</LangWipe>}
        value={SITE_STATS.arts}
      />
      <StatItem
        label={<LangWipe>{t(lang, "statsCommunity")}</LangWipe>}
        value={SITE_STATS.community}
        badge={
          <ChatBadge
            src={SITE_STATS.chatImageUrl}
            caption={<LangWipe>{t(lang, "statsChatCaption")}</LangWipe>}
          />
        }
      />
    </div>
  </div>
);
}
