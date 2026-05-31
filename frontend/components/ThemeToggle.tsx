"use client";

import { useApp } from "@/lib/AppContext";
import LangSelector from "@/components/LangSelector";

export default function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const isLight = theme === "light";

  const toggle = () => setTheme(isLight ? "dark" : "light");

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        position: "relative",
        width: "62px",
        height: "30px",
        borderRadius: "999px",
        border: "1px solid var(--border)",
        background: isLight
          ? "linear-gradient(90deg, #f4f4f0 0%, #ffffff 100%)"
          : "linear-gradient(90deg, #0a0a0f 0%, #1a1a25 100%)",
        cursor: "pointer",
        padding: 0,
        transition: "background var(--transition-theme), border-color var(--transition-theme)",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: isLight ? "34px" : "3px",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: isLight ? "#1a1a20" : "#e8e8f0",
          transition: "left var(--transition-theme), background var(--transition-theme)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }}
      >
        {isLight ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#1a1a20" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#e8e8f0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}