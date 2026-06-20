"use client";

import { useApp } from "@/lib/AppContext";
import LangWipe from "./LangWipe";

interface CategoryDef {
  id: string;
  label: string;
  mapUrl: string | null;
}

const CATEGORIES: Record<string, CategoryDef> = {
  "faq-kog":    { id: "kog",    label: "KoG",                mapUrl: null },
  "faq-block":  { id: "block",  label: "Block",              mapUrl: "https://i.postimg.cc/kgNk9CjQ/izobrazenie.png" },
  "faq-fng":    { id: "fng",    label: "FNG",                mapUrl: null },
  "faq-novice": { id: "novice", label: "Novice",             mapUrl: null },
  "faq-krx":    { id: "krx",    label: "Tutorial KRX Crack", mapUrl: null },
};

interface Props {
  sectionId: string;
}

export default function FaqSubContent({ sectionId }: Props) {
  useApp();

  const category = CATEGORIES[sectionId];

  if (!category) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
          background: "var(--bg)",
        }}
      >
        {category.mapUrl ? (
          <img
            src={category.mapUrl}
            alt={category.label}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "90%",
              maxHeight: "85%",
              objectFit: "contain",
              imageRendering: "pixelated",
              userSelect: "none",
              pointerEvents: "none",
              filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.4))",
            }}
            draggable={false}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.3 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
                fontWeight: 500,
                opacity: 0.35,
              }}
            >
              Coming soon
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "clamp(1rem, 3vw, 2rem)",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "0.5rem 1rem",
          borderRadius: 10,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-strong)",
          color: "var(--text)",
          fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
          fontWeight: 600,
          zIndex: 2,
          letterSpacing: "0.02em",
        }}
      >
        <LangWipe>{category.label}</LangWipe>
      </div>
    </div>
  );
}