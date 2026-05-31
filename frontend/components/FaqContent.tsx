"use client";

import { useApp } from "@/lib/AppContext";
import { t } from "@/lib/i18n";
import LangWipe from "./LangWipe";

export default function FaqContent() {
  const { lang } = useApp();

  return (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        maxWidth: 480,
        padding: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "var(--fs-h1)",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          marginBottom: "0.6rem",
        }}
      >
        <LangWipe>{t(lang, "sectionFaq")}</LangWipe>
      </h1>
      <p
        style={{
          fontSize: "var(--fs-sm)",
          color: "var(--text-muted)",
          lineHeight: 1.5,
          marginBottom: "1rem",
        }}
      >
        <LangWipe>{t(lang, "faqHubHint")}</LangWipe>
      </p>
      <p
        className="font-mono"
        style={{
          opacity: 0.45,
          fontSize: "var(--fs-xs)",
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        [ kog · block · fng · novice · krx ]
      </p>
    </div>
  );
}