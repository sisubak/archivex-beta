"use client";

import { memo, useEffect, useState } from "react";
import type { ClientEntry } from "@/lib/clientsData";
import type { Lang } from "@/lib/i18n";

interface Props {
  client: ClientEntry;
  lang: Lang;
  onClick: () => void;
}

function ClientCardBase({ client, lang, onClick }: Props) {
  const desc = client.descriptions[lang] ?? client.descriptions.en;

  return (
    <button
      onClick={onClick}
      className="client-card"
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
        font: "inherit",
      }}
    >
      <style>{`
        .client-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent, var(--text));
        }
        .client-card:focus-visible {
          border-color: var(--accent, var(--text));
        }
        @media (hover: none) {
          .client-card:hover {
            transform: none;
            border-color: var(--border);
          }
        }
        @media (max-width: 480px) {
          .client-card:hover {
            transform: none;
            border-color: var(--border);
          }
        }
      `}</style>

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
              top: 5,
              right: 5,
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              padding: "0.15rem 0.35rem",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              borderRadius: 3,
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
          padding: "clamp(0.5rem, 1.2vw, 0.75rem)",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <div
          style={{
            fontSize: "clamp(0.8rem, 0.65rem + 0.4vw, 0.95rem)",
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
            fontSize: "0.55rem",
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

const ClientCard = memo(ClientCardBase, (prev, next) => {
  return (
    prev.client === next.client &&
    prev.lang === next.lang &&
    prev.onClick === next.onClick
  );
});

export default ClientCard;