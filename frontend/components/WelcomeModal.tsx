"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { LANGS, type Lang } from "@/lib/i18n";
import { WELCOME_TEXT } from "@/lib/welcomeText";
import { getCookie, setCookie } from "@/lib/cookies";

const COOKIE_NAME = "ax_welcome_v1";

export default function WelcomeModal() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [disagreed, setDisagreed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = getCookie(COOKIE_NAME);
    if (seen !== "1") setOpen(true);
  }, []);

  const accept = () => {
    setCookie(COOKIE_NAME, "1", 365);
    setOpen(false);
  };

  const handleDisagree = () => {
    setDisagreed(true);
  };

  if (!mounted || !open) return null;

  const t = WELCOME_TEXT[lang] ?? WELCOME_TEXT.en;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "ax-fade-in 200ms ease-out",
      }}
    >
      <div
        style={{
          background: "var(--bg-elev, #14141a)",
          color: "var(--text, #e8e8f0)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          maxWidth: "480px",
          width: "100%",
          padding: "clamp(20px, 5vw, 28px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          fontFamily: "var(--font-ui), system-ui, sans-serif",
        }}
      >
        {disagreed ? (
          <>
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "clamp(16px, 4vw, 20px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {t.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(13px, 3.2vw, 14px)",
                lineHeight: 1.55,
                opacity: 0.75,
              }}
            >
              {t.hint}
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "16px",
                justifyContent: "center",
              }}
            >
              {LANGS.map((opt) => {
                const active = opt.code === lang;
                return (
                  <button
                    key={opt.code}
                    onClick={() => setLang(opt.code as Lang)}
                    aria-label={opt.nativeLabel}
                    aria-pressed={active}
                    style={{
                      background: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
                      color: "inherit",
                      border: active
                        ? "1px solid rgba(255,255,255,0.32)"
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      padding: "6px 10px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 120ms ease",
                      fontFamily: "inherit",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <h2
              id="welcome-modal-title"
              style={{
                margin: "0 0 12px 0",
                fontSize: "clamp(16px, 4vw, 20px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              {t.title}
            </h2>

            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "clamp(13px, 3.2vw, 14px)",
                lineHeight: 1.55,
                opacity: 0.9,
              }}
            >
              {t.body}
            </p>

            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: "clamp(13px, 3.2vw, 14px)",
                lineHeight: 1.55,
                opacity: 0.65,
              }}
            >
              {t.hint}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <button
                onClick={accept}
                style={{
                  width: "100%",
                  background: "linear-gradient(180deg, #6c7cff 0%, #4f5fe6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 16px rgba(79,95,230,0.32)",
                  minHeight: 44,
                }}
              >
                {t.button}
              </button>
              <button
                onClick={handleDisagree}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  minHeight: 44,
                  opacity: 0.7,
                }}
              >
                I disagree
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes ax-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}