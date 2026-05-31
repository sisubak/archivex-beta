"use client";

import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";
import LangWipe from "./LangWipe";

const RULES = [1, 2, 3, 4, 5] as const;

export default function RulesContent() {
  const { lang } = useApp();

  return (
    <div
      style={{
        width: "min(720px, 90vw)",
        maxHeight: "calc(100vh - 2rem - var(--safe-top) - var(--safe-bottom))",
        overflowY: "auto",
        padding: "0 clamp(0.5rem, 0.3rem + 0.8vw, 1rem)",
        color: "var(--text)",
      }}
      className="rules-scroll"
    >
      <style>{`
        .rules-scroll::-webkit-scrollbar { width: 4px; }
        .rules-scroll::-webkit-scrollbar-track { background: transparent; }
        .rules-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        .rules-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent); }
      `}</style>

      <header style={{ marginBottom: "clamp(1.1rem, 0.7rem + 1.4vw, 1.8rem)" }}>
        <p
          className="font-mono"
          style={{
            opacity: 0.4,
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            marginBottom: "0.4rem",
            textTransform: "uppercase",
          }}
        >
          [ rules ]
        </p>
        <h1
          style={{
            fontSize: "var(--fs-h1)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            marginBottom: "0.7rem",
          }}
        >
          <LangWipe>{t(lang, "rulesHeading")}</LangWipe>
        </h1>
        <p
          style={{
            fontSize: "var(--fs-base)",
            lineHeight: 1.55,
            color: "var(--text-muted)",
            maxWidth: "580px",
          }}
        >
          <LangWipe>{t(lang, "rulesLead")}</LangWipe>
        </p>
      </header>

      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {RULES.map((n) => (
          <li
            key={n}
            style={{
              display: "flex",
              gap: "clamp(0.6rem, 0.4rem + 0.5vw, 1rem)",
              padding:
                "clamp(0.75rem, 0.5rem + 0.7vw, 0.95rem) clamp(0.85rem, 0.6rem + 0.7vw, 1.1rem)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--btn-bg)",
              minWidth: 0,
            }}
          >
            <div
              className="font-mono"
              style={{
                flexShrink: 0,
                fontSize: "clamp(1.1rem, 0.9rem + 0.8vw, 1.4rem)",
                fontWeight: 700,
                color: "var(--accent)",
                lineHeight: 1,
                minWidth: "clamp(24px, 4vw, 32px)",
              }}
            >
              0{n}
            </div>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  fontSize: "var(--fs-h3)",
                  fontWeight: 600,
                  marginBottom: "0.3rem",
                  letterSpacing: "-0.005em",
                }}
              >
                <LangWipe>{t(lang, `rule${n}Title` as any)}</LangWipe>
              </h3>
              <p
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-muted)",
                  lineHeight: 1.55,
                }}
              >
                <LangWipe>{t(lang, `rule${n}Body` as any)}</LangWipe>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p
        style={{
          marginTop: "1.2rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border)",
          fontSize: "var(--fs-sm)",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        <LangWipe>{t(lang, "rulesOutro")}</LangWipe>
      </p>
    </div>
  );
}