"use client";

import { useApp } from "@/lib/AppContext";
import { t, type DictKey } from "@/lib/i18n";
import LangWipe from "./LangWipe";

const PILLARS: { titleKey: DictKey; descKey: DictKey; icon: JSX.Element }[] = [
  { titleKey: "aboutPillar1Title", descKey: "aboutPillar1Desc", icon: <Icon path="M3 12h18M3 6h18M3 18h18" /> },
  { titleKey: "aboutPillar2Title", descKey: "aboutPillar2Desc", icon: <Icon path="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /> },
  { titleKey: "aboutPillar3Title", descKey: "aboutPillar3Desc", icon: <Icon path="M12 8v4l3 2M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" /> },
  { titleKey: "aboutPillar4Title", descKey: "aboutPillar4Desc", icon: <Icon path="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /> },
  { titleKey: "aboutPillar5Title", descKey: "aboutPillar5Desc", icon: <Icon path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> },
  { titleKey: "aboutPillar6Title", descKey: "aboutPillar6Desc", icon: <Icon path="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /> },
];

export default function AboutContent() {
  const { lang } = useApp();

  return (
    <div
      style={{
        width: "min(900px, 92vw)",
        maxHeight: "calc(100vh - 2rem - var(--safe-top) - var(--safe-bottom) - var(--mobile-nav-h))",
        overflowY: "auto",
        padding: "0 clamp(0.5rem, 0.3rem + 0.8vw, 1rem)",
        color: "var(--text)",
      }}
      className="about-scroll"
    >
      <style>{`
        .about-scroll::-webkit-scrollbar { width: 4px; }
        .about-scroll::-webkit-scrollbar-track { background: transparent; }
        .about-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        .about-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent); }
      `}</style>

      <header style={{ marginBottom: "clamp(1rem, 0.7rem + 1.2vw, 1.8rem)" }}>
        <p
          className="font-mono"
          style={{
            opacity: 0.4,
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            marginBottom: "0.35rem",
            textTransform: "uppercase",
          }}
        >
          [ about ]
        </p>
        <h1
          style={{
            fontSize: "var(--fs-h1)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            marginBottom: "0.7rem",
          }}
        >
          <LangWipe>{t(lang, "aboutHeading")}</LangWipe>
        </h1>
        <p
          style={{
            fontSize: "var(--fs-base)",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "640px",
          }}
        >
          <LangWipe>{t(lang, "aboutLead")}</LangWipe>
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
          gap: "clamp(0.5rem, 1vw, 0.75rem)",
          marginBottom: "1.2rem",
        }}
      >
        {PILLARS.map((p, i) => (
          <div
            key={i}
            className="about-pillar"
            style={{
              padding: "clamp(0.7rem, 0.5rem + 0.5vw, 1rem)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--btn-bg)",
              transition: "border-color 0.2s, transform 0.2s",
              cursor: "default",
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: "clamp(28px, 5vw, 36px)",
                height: "clamp(28px, 5vw, 36px)",
                borderRadius: "7px",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.6rem",
                color: "var(--accent)",
              }}
            >
              {p.icon}
            </div>
            <h3
              style={{
                fontSize: "var(--fs-h3)",
                fontWeight: 600,
                marginBottom: "0.25rem",
                letterSpacing: "-0.01em",
              }}
            >
              <LangWipe>{t(lang, p.titleKey)}</LangWipe>
            </h3>
            <p
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              <LangWipe>{t(lang, p.descKey)}</LangWipe>
            </p>
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: "var(--fs-sm)",
          color: "var(--text-muted)",
          fontStyle: "italic",
          opacity: 0.75,
          paddingTop: "0.8rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <LangWipe>{t(lang, "aboutOutro")}</LangWipe>
      </p>

      <style>{`
        @media (hover: hover) {
          .about-pillar:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}