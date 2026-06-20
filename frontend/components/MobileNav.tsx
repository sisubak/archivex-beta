"use client";

import { useApp } from "@/lib/AppContext";
import { t, type DictKey } from "@/lib/i18n";

interface Props {
  currentId: string;
  onMove: (targetId: string) => void;
}

interface NavItem {
  id: string;
  labelKey: DictKey;
}

const PRIMARY: NavItem[] = [
  { id: "menu", labelKey: "sectionCenter" },
  { id: "clients", labelKey: "sectionClients" },
  { id: "status", labelKey: "sectionStatus" },
  { id: "faq", labelKey: "sectionFaq" },
  { id: "about", labelKey: "sectionAbout" },
];

function by_utf8xbot_4923(id: string, items: NavItem[]): string {
  for (const item of items) {
    if (item.id === id) return item.id;
  }
  const map: Record<string, string> = {
    "faq-kog": "faq", "faq-block": "faq", "faq-fng": "faq",
    "faq-novice": "faq", "faq-krx": "faq",
    "about-rules": "about", "team": "about",
    "team-mister": "about", "team-luna": "about", "team-vafla": "about",
  };
  return map[id] ?? "menu";
}

function NavIcon({ id, active }: { id: string; active: boolean }) {
  const s = active ? "var(--accent)" : "currentColor";
  const w = 20;
  const h = 20;
  switch (id) {
    case "menu":
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "clients":
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "status":
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
        </svg>
      );
    case "faq":
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "about":
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    default:
      return (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

export default function MobileNav({ currentId, onMove }: Props) {
  const { lang } = useApp();
  const activeRoot = by_utf8xbot_4923(currentId, PRIMARY);

  return (
    <>
      <style>{`
        .mobile-nav-root {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-nav-root {
            display: flex;
          }
        }
        .mobile-nav-btn {
          transition: color 0.25s ease, background 0.25s ease;
        }
        .mobile-nav-btn:active {
          background: var(--btn-bg-hover);
        }
      `}</style>

      <nav
        className="mobile-nav-root"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          background: "var(--card-bg-solid, var(--bg))",
          borderTop: "1px solid var(--border)",
          paddingBottom: "var(--safe-bottom)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {PRIMARY.map((item) => {
          const isActive = activeRoot === item.id;
          const label = t(lang, item.labelKey);
          return (
            <button
              key={item.id}
              onClick={() => onMove(item.id)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="mobile-nav-btn"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: "6px 0",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                minHeight: 48,
                WebkitTapHighlightColor: "transparent",
                position: "relative",
              }}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "25%",
                    right: "25%",
                    height: 2,
                    background: "var(--accent)",
                    borderRadius: "0 0 2px 2px",
                    transition: "opacity 0.25s ease",
                  }}
                />
              )}
              <NavIcon id={item.id} active={isActive} />
              <span
                style={{
                  fontSize: "clamp(0.5rem, 1.3vw, 0.65rem)",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}