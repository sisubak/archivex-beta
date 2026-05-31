"use client";

import { memo } from "react";
import { t, type Lang } from "@/lib/i18n";
import { CLIENT_TYPE_FILTERS } from "@/lib/clientsData";
import LangWipe from "./LangWipe";

interface Props {
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  vibeOnly: boolean;
  setVibeOnly: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  lang: Lang;
}

function ClientFiltersBase({
  typeFilter,
  setTypeFilter,
  vibeOnly,
  setVibeOnly,
  search,
  setSearch,
  lang,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label
          className="font-mono"
          style={{
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            opacity: 0.7,
          }}
        >
          <LangWipe>{t(lang, "clientsSearchLabel")}</LangWipe>
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="..."
          style={{
            padding: "0.55rem 0.7rem",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-xs)",
            outline: "none",
            minHeight: 44,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label
          className="font-mono"
          style={{
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            opacity: 0.7,
          }}
        >
          <LangWipe>{t(lang, "clientsFilterTypeLabel")}</LangWipe>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {CLIENT_TYPE_FILTERS.map((f) => {
            const active = typeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.55rem 0.8rem",
                  background: active ? "var(--text)" : "transparent",
                  color: active ? "var(--bg)" : "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-card)",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--fs-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textAlign: "left",
                  minHeight: 40,
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
              >
                <LangWipe>{t(lang, f.labelKey)}</LangWipe>
                {active && <span style={{ opacity: 0.7 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.5rem 0.7rem",
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          cursor: "pointer",
          minHeight: 44,
        }}
      >
        <input
          type="checkbox"
          checked={vibeOnly}
          onChange={(e) => setVibeOnly(e.target.checked)}
          style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--text)" }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text)",
          }}
        >
          <LangWipe>{t(lang, "clientsFilterVibe")}</LangWipe>
        </span>
      </label>
    </div>
  );
}

export default memo(ClientFiltersBase);