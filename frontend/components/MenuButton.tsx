"use client";

import { useEffect, useState, useRef } from "react";
import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";

interface Props {
  current: string;
  onHome: () => void;
}

interface Position {
  x: number;
  y: number;
}

const CAMERA_DURATION = 900;
const SETTLE_DELAY = 150;
const DISSOLVE_DURATION = 320;

export default function MenuButton({ current, onHome }: Props) {
  const { lang } = useApp();
  const [pos, setPos] = useState<Position | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const mountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dissolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mountTimer.current) clearTimeout(mountTimer.current);
    if (dissolveTimer.current) clearTimeout(dissolveTimer.current);
    setMounted(false);
    setPos(null);
    setDissolving(false);

    if (current === "menu" || current === "center") return;

    const compute = () => {
      const card = document.querySelector<HTMLElement>(
        `[data-section-card="${current}"]`
      );
      if (!card) return;
      const rect = card.getBoundingClientRect();
      setPos({ x: rect.left + 10, y: rect.top + 10 });
    };

    mountTimer.current = setTimeout(() => {
      compute();
      setMounted(true);
    }, CAMERA_DURATION + SETTLE_DELAY);

    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    return () => {
      if (mountTimer.current) clearTimeout(mountTimer.current);
      if (dissolveTimer.current) clearTimeout(dissolveTimer.current);
      window.removeEventListener("resize", onResize);
    };
  }, [current]);

  const handleClick = () => {
    if (dissolving) return;
    setDissolving(true);
    dissolveTimer.current = setTimeout(() => onHome(), DISSOLVE_DURATION);
  };

  if (!mounted || !pos || current === "menu" || current === "center") return null;

  const animClass = dissolving ? "menu-btn-dissolve" : "menu-btn-anim";

  return (
    <div className="menu-btn-host">
      <style>{`
        @keyframes menuFloat {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25%      { transform: translate(3px, -3px) rotate(0.6deg); }
          50%      { transform: translate(-2px, -4px) rotate(-0.5deg); }
          75%      { transform: translate(-3px, 2px) rotate(0.4deg); }
        }
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translate(0, -6px) scale(0.92); }
          to   { opacity: 1; transform: translate(0, 0) scale(1); }
        }
        @keyframes menuDissolveOut {
          0%   { opacity: 1; filter: contrast(1) brightness(1); transform: scale(1); }
          50%  { opacity: 0.55; filter: contrast(1.8) brightness(1.4); transform: scale(0.94); }
          100% { opacity: 0; filter: contrast(3) brightness(2); transform: scale(0.75); }
        }
        .menu-btn-anim {
          animation:
            menuFadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both,
            menuFloat 4.5s ease-in-out infinite 0.4s;
        }
        .menu-btn-dissolve {
          animation: menuDissolveOut 0.32s steps(6, end) both !important;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .menu-btn-host { display: none !important; }
        }
      `}</style>

      <button
        onClick={handleClick}
        aria-label="Back to main menu"
        className={animClass}
        style={{
          position: "fixed",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          zIndex: 9999,
          padding: "clamp(0.45rem, 0.35rem + 0.3vw, 0.6rem) clamp(0.7rem, 0.55rem + 0.5vw, 1rem)",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          backdropFilter: "blur(12px)",
          color: "var(--text)",
          cursor: "pointer",
          fontSize: "var(--fs-sm)",
          fontWeight: 500,
          fontFamily: "var(--font-ui), -apple-system, sans-serif",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          willChange: "transform",
          transition: "background 0.25s, border-color 0.25s, color var(--transition-theme)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18" />
          <path d="M3 6h18" />
          <path d="M3 18h18" />
        </svg>
        <span>{t(lang, "menuBack")}</span>
      </button>
    </div>
  );
}