"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ClientEntry } from "@/lib/clientsData";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  client: ClientEntry;
  lang: Lang;
  onClose: () => void;
}

export default function ClientModal({ client, lang, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIsMobile(window.innerWidth < 640));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("resize", onResize);
    };
  }, [onClose]);

  const gallery = mounted ? [client.image, ...(client.arts ?? [])] : [];

  const next = useCallback(
    () => setGalleryIdx((i) => (i + 1) % gallery.length),
    [gallery.length]
  );
  const prev = useCallback(
    () => setGalleryIdx((i) => (i - 1 + gallery.length) % gallery.length),
    [gallery.length]
  );

  if (!mounted) return null;

  const currentImage = gallery[galleryIdx];
  const desc = client.descriptions[lang] ?? client.descriptions.en;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : "2rem 1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? "100%" : "min(720px, 100%)",
          height: isMobile ? "100%" : "auto",
          maxHeight: isMobile ? "100%" : "90vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "var(--bg)",
          border: isMobile ? "none" : "1px solid var(--border)",
          borderRadius: isMobile ? 0 : "var(--radius-card)",
          color: "var(--text)",
          padding: isMobile
            ? "calc(var(--safe-top) + 1rem) calc(var(--safe-right) + 1rem) calc(var(--safe-bottom) + 1.2rem) calc(var(--safe-left) + 1rem)"
            : "1.5rem",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: isMobile ? "sticky" : "absolute",
            top: isMobile ? 0 : 12,
            right: isMobile ? 0 : 12,
            alignSelf: "flex-end",
            width: 40,
            height: 40,
            border: "1px solid var(--border)",
            borderRadius: "50%",
            background: "var(--card-bg)",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: "1.1rem",
            lineHeight: 1,
            zIndex: 2,
          }}
        >
          ×
        </button>

        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: "#000",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={currentImage}
            alt={client.title}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            decoding="async"
          />
          {gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                style={navBtnStyle("left")}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={next}
                style={navBtnStyle("right")}
                aria-label="Next"
              >
                ›
              </button>
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "#fff",
                  background: "rgba(0,0,0,0.55)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: 4,
                }}
              >
                {galleryIdx + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.2rem, 2vw + 0.8rem, 1.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              wordBreak: "break-word",
            }}
          >
            {client.title}
          </h2>
          <div
            className="font-mono"
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              opacity: 0.65,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {client.badge}
            {client.vibecoded && " • vibe-coded"}
          </div>
        </div>

        <p
          style={{
            margin: 0,
            color: "var(--text-muted)",
            lineHeight: 1.55,
            fontSize: "var(--fs-sm)",
          }}
        >
          {desc}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.3rem",
          }}
        >
          {client.download && (
            <a
              href={client.download}
              target="_blank"
              rel="noreferrer"
              style={actionBtnStyle("primary", isMobile)}
            >
              {t(lang, "clientsBtnDownload")}
            </a>
          )}
          {client.buy && (
            <a
              href={client.buy}
              target="_blank"
              rel="noreferrer"
              style={actionBtnStyle("primary", isMobile)}
            >
              {t(lang, "clientsBtnBuy")}
            </a>
          )}
          {client.telegram && (
            <a
              href={client.telegram}
              target="_blank"
              rel="noreferrer"
              style={actionBtnStyle(undefined, isMobile)}
            >
              Telegram
            </a>
          )}
          {client.discord && (
            <a
              href={client.discord}
              target="_blank"
              rel="noreferrer"
              style={actionBtnStyle(undefined, isMobile)}
            >
              Discord
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

function navBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 8,
    top: "50%",
    transform: "translateY(-50%)",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1.2rem",
  } as React.CSSProperties;
}

function actionBtnStyle(variant: "primary" | undefined, isMobile: boolean): React.CSSProperties {
  return {
    padding: isMobile ? "0.7rem 1rem" : "0.55rem 0.9rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-card)",
    background: variant === "primary" ? "var(--text)" : "transparent",
    color: variant === "primary" ? "var(--bg)" : "var(--text)",
    textDecoration: "none",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    cursor: "pointer",
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    flex: isMobile ? "1 1 auto" : "0 0 auto",
    justifyContent: "center",
  };
}