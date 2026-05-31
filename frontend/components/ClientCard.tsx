"use client";

import { memo, useRef } from "react";
import type { ClientEntry } from "@/lib/clientsData";
import type { Lang } from "@/lib/i18n";

interface Props {
  client: ClientEntry;
  lang: Lang;
  onClick: () => void;
}

const CAN_HOVER =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover)").matches;

function ClientCardBase({ client, lang, onClick }: Props) {
  const desc = client.descriptions[lang] ?? client.descriptions.en;
  const ref = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{
        position: "relative",
        textAlign: "left",
        padding: 0,
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        background: "var(--card-bg)",
        color: "var(--text)",
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.18s ease, border-color 0.18s ease",
        minHeight: 44,
        WebkitTapHighlightColor: "transparent",
        willChange: "transform",
      }}
      onMouseEnter={(e) => {
        if (!CAN_HOVER) return;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "var(--accent, var(--text))";
      }}
      onMouseLeave={(e) => {
        if (!CAN_HOVER) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "var(--bg)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={client.image}
          alt={client.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          loading="lazy"
          decoding="async"
        />
        {client.vibecoded && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              padding: "0.2rem 0.4rem",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              borderRadius: 4,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            vibe-coded
          </span>
        )}
      </div>

      <div
        style={{
          padding: "clamp(0.6rem, 1.5vw, 0.85rem)",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
        }}
      >
        <div
          style={{
            fontSize: "clamp(0.85rem, 0.7rem + 0.5vw, 1rem)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {client.title}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: "0.6rem",
            color: "var(--text-muted)",
            opacity: 0.6,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {client.badge}
        </div>
        <div
          style={{
            fontSize: "var(--fs-xs)",
            color: "var(--text-muted)",
            opacity: 0.85,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desc}
        </div>
      </div>
    </button>
  );
}
export default memo(ClientCardBase, (prev, next) => {
  return (
    prev.client === next.client &&
    prev.lang === next.lang &&
    prev.onClick === next.onClick
  );
});