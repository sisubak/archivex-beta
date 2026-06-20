"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/AppContext";

export default function GlassToggle() {
  const { glass, setGlass } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setGlass(!glass)}
      aria-label={glass ? "Disable glass effect" : "Enable glass effect"}
      title={glass ? "Glass: ON" : "Glass: OFF"}
      className="glass-toggle-btn"
      style={{
        width: 30,
        height: 30,
        padding: 0,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--btn-bg)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.2s, background var(--transition-theme), transform 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: glass ? 1 : 0.35,
          transition: "opacity 0.25s",
        }}
      >
        <path d="M2 12C2 12 5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
        {mounted && !glass && (
          <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
      <style>{`
        .glass-toggle-btn:hover {
          border-color: var(--border-strong);
        }
      `}</style>
    </button>
  );
}