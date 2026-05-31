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
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 8 L16 16" opacity="0.5" />
        <path d="M12 8 L16 12" opacity="0.5" />
        <path d="M8 12 L12 16" opacity="0.5" />
        {mounted && !glass && (
          <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
    </button>
  );
}