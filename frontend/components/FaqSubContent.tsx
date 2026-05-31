"use client";

import { useEffect, useRef, useState } from "react";
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

interface MapCoords {
  clientX: number;
  clientY: number;
  imgX: number;
  imgY: number;
  normX: number;
  normY: number;
  tileX: number;
  tileY: number;
}

interface Props {
  sectionId: string;
}

export default function FaqSubContent({ sectionId }: Props) {
  useApp();

  const category = CATEGORIES[sectionId];
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number } | null>(null);
  const [coords, setCoords] = useState<MapCoords | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const mapWrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!category?.mapUrl) {
      setCoords(null);
      return;
    }
    const updateSize = () => {
      const wrap = mapWrapRef.current;
      const img = imgRef.current;
      if (wrap) setViewportSize({ w: wrap.clientWidth, h: wrap.clientHeight });
      if (img && img.naturalWidth > 0) {
        setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [category?.mapUrl, sectionId]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDev || !imgRef.current) return;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) return;

    const normX = parseFloat((localX / rect.width).toFixed(4));
    const normY = parseFloat((localY / rect.height).toFixed(4));
    const imgX = Math.round(normX * (img.naturalWidth || 1));
    const imgY = Math.round(normY * (img.naturalHeight || 1));
    const tileX = Math.floor(imgX / 32);
    const tileY = Math.floor(imgY / 32);

    const snippet = `{
    id: "hotspot-${tileX}-${tileY}",
    section: "${sectionId}",
    category: "${category.id}",
    norm: { x: ${normX}, y: ${normY} },
    imgPx: { x: ${imgX}, y: ${imgY} },
    tile: { x: ${tileX}, y: ${tileY} },
    imgSize: { w: ${img.naturalWidth}, h: ${img.naturalHeight} },
    title: "",
    body: "",
    },`;

    navigator.clipboard.writeText(snippet).then(
      () => {
        setToast(`copied hotspot @ tile ${tileX},${tileY}`);
        setTimeout(() => setToast(null), 2000);
      },
      () => {
        setToast("clipboard blocked");
        setTimeout(() => setToast(null), 2000);
      }
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDev || !imgRef.current) return;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
      setCoords(null);
      return;
    }
    const normX = localX / rect.width;
    const normY = localY / rect.height;
    const imgX = Math.round(normX * (img.naturalWidth || 1));
    const imgY = Math.round(normY * (img.naturalHeight || 1));
    setCoords({
      clientX: Math.round(e.clientX),
      clientY: Math.round(e.clientY),
      imgX,
      imgY,
      normX: parseFloat(normX.toFixed(4)),
      normY: parseFloat(normY.toFixed(4)),
      tileX: Math.floor(imgX / 32),
      tileY: Math.floor(imgY / 32),
    });
  };

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
        ref={mapWrapRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCoords(null)}
        onClick={handleClick}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
          background: "var(--bg)",
          cursor: isDev && category.mapUrl ? "crosshair" : "default",
        }}
      >
        {category.mapUrl ? (
          <img
            ref={imgRef}
            src={category.mapUrl}
            alt={category.label}
            onLoad={(e) => {
              const t = e.currentTarget;
              setImgSize({ w: t.naturalWidth, h: t.naturalHeight });
              if (mapWrapRef.current) {
                setViewportSize({
                  w: mapWrapRef.current.clientWidth,
                  h: mapWrapRef.current.clientHeight,
                });
              }
            }}
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
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              fontWeight: 500,
              opacity: 0.4,
            }}
          >
            map coming soon
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "clamp(1rem, 3vw, 2rem)",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "0.6rem 1.2rem",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-strong)",
          color: "var(--text)",
          fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
          fontWeight: 600,
          zIndex: 2,
          letterSpacing: "0.02em",
        }}
      >
        <LangWipe>{category.label}</LangWipe>
      </div>

      {isDev && toast && (
        <div
          style={{
            position: "absolute",
            bottom: "clamp(4.5rem, 8vh, 6rem)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "0.6rem 1rem",
            background: "rgba(0,0,0,0.85)",
            color: "#0f0",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            borderRadius: 6,
            zIndex: 20,
            border: "1px solid rgba(0,255,0,0.4)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          ✓ {toast}
        </div>
      )}

      {isDev && category.mapUrl && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "0.6rem 0.8rem",
            background: "rgba(0,0,0,0.78)",
            color: "#0f0",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 11,
            lineHeight: 1.5,
            borderRadius: 6,
            zIndex: 10,
            pointerEvents: "none",
            minWidth: 220,
            border: "1px solid rgba(0,255,0,0.3)",
          }}
        >
          <div style={{ color: "#0ff", marginBottom: 4, fontWeight: 700 }}>DEV: map coords</div>
          <div>img: {imgSize ? `${imgSize.w}×${imgSize.h}` : "loading..."}</div>
          <div>view: {viewportSize ? `${viewportSize.w}×${viewportSize.h}` : "—"}</div>
          <div style={{ marginTop: 4, borderTop: "1px solid rgba(0,255,0,0.2)", paddingTop: 4 }}>
            {coords ? (
              <>
                <div>client: {coords.clientX}, {coords.clientY}</div>
                <div>img px: {coords.imgX}, {coords.imgY}</div>
                <div>norm: {coords.normX}, {coords.normY}</div>
                <div>tile (32px): {coords.tileX}, {coords.tileY}</div>
                <div style={{ marginTop: 4, color: "#ff0", opacity: 0.7 }}>click to copy →</div>
              </>
            ) : (
              <div style={{ opacity: 0.5 }}>move cursor over map</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}