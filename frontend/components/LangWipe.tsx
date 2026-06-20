"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/AppContext";

interface Props {
  children: React.ReactNode;
  duration?: number;
  lineColor?: string;
  lineWidth?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function LangWipe({
  children,
  duration = 380,
  lineColor,
  lineWidth = 2,
  disabled = false,
  style,
  className,
}: Props) {
  const { lang } = useApp();

  const [outgoing, setOutgoing] = useState<React.ReactNode>(children);
  const [incoming, setIncoming] = useState<React.ReactNode>(children);
  const [phase, setPhase] = useState<"idle" | "wiping">("idle");
  const prevLang = useRef(lang);
  const animId = useRef(0);

  useEffect(() => {
    if (prevLang.current === lang) {
      setIncoming(children);
      if (phase === "idle") setOutgoing(children);
      return;
    }

    prevLang.current = lang;

    if (disabled) {
      setOutgoing(children);
      setIncoming(children);
      return;
    }

    setIncoming(children);
    setPhase("wiping");
    const id = ++animId.current;

    const timer = window.setTimeout(() => {
      if (animId.current !== id) return;
      setPhase("idle");
      setOutgoing(children);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [lang, children, disabled, duration, phase]);

  useEffect(() => {
    if (phase === "idle") {
      setOutgoing(children);
      setIncoming(children);
    }
  }, [children, phase]);

  const animKey = `lw-${duration}`;

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        verticalAlign: "baseline",
        ...style,
      }}
    >
      <style>{`
        @keyframes ${animKey}-out {
          0%   { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 0 100%); }
        }
        @keyframes ${animKey}-in {
          0%   { clip-path: inset(0 100% 0 0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0);    opacity: 1; }
        }
        @keyframes ${animKey}-line {
          0%   { left: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

      <span
        aria-hidden="true"
        style={{
          visibility: "hidden",
          display: "inline-block",
          whiteSpace: "inherit",
        }}
      >
        {incoming}
      </span>

      {phase === "idle" && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "inline-block",
          }}
        >
          {incoming}
        </span>
      )}

      {phase === "wiping" && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "inline-block",
              animation: `${animKey}-out ${duration}ms cubic-bezier(0.65, 0, 0.35, 1) forwards`,
              willChange: "clip-path",
            }}
          >
            {outgoing}
          </span>

          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "inline-block",
              animation: `${animKey}-in ${duration}ms cubic-bezier(0.65, 0, 0.35, 1) forwards`,
              willChange: "clip-path",
            }}
          >
            {incoming}
          </span>

          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-0.05em",
              bottom: "-0.05em",
              width: `${lineWidth}px`,
              background:
                lineColor ??
                "linear-gradient(to bottom, transparent, currentColor 20%, currentColor 80%, transparent)",
              opacity: 0.55,
              boxShadow: "0 0 6px currentColor",
              animation: `${animKey}-line ${duration}ms cubic-bezier(0.65, 0, 0.35, 1) forwards`,
              willChange: "left, opacity",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </span>
  );
}