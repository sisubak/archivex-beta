"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { t, type Lang } from "@/lib/i18n";
import { CLIENTS, type ClientEntry } from "@/lib/clientsData";
import LangWipe from "./LangWipe";
import ClientCard from "./ClientCard";
import ClientModal from "./ClientModal";
import ClientFilters from "./ClientFilters";

export default function ClientsContent() {
  const { lang, navigateTo } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [vibeOnly, setVibeOnly] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [openClient, setOpenClient] = useState<ClientEntry | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIsMobile(window.innerWidth < 760));
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 150);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CLIENTS.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (vibeOnly && !c.vibecoded) return false;
      if (q) {
        const desc = c.descriptions[lang as Lang] ?? c.descriptions.en;
        return (
          c.title.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [typeFilter, vibeOnly, search, lang]);

  const goBack = useCallback(() => {
    if (navigateTo) navigateTo("menu");
  }, [navigateTo]);

  const handleOpen = useCallback((c: ClientEntry) => setOpenClient(c), []);
  const handleClose = useCallback(() => setOpenClient(null), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const backButton = (
    <button
      onClick={goBack}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.55rem 0.85rem",
        background: "var(--card-bg-solid)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        color: "var(--text)",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-xs)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        minHeight: 44,
      }}
    >
      <span>←</span>
      <LangWipe>{t(lang as Lang, "backToMenu")}</LangWipe>
    </button>
  );

  const filtersButton = (
    <button
      onClick={openDrawer}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.55rem 0.85rem",
        background: "var(--card-bg-solid)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        color: "var(--text)",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-xs)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        minHeight: 44,
      }}
    >
      ☰ <LangWipe>{t(lang as Lang, "clientsFilterTypeLabel")}</LangWipe>
    </button>
  );

  const headerBlock = (
    <div>
      <h1
        style={{
          fontSize: "clamp(1.5rem, 3vw + 1rem, 2.4rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: 0,
          lineHeight: 1.05,
        }}
      >
        <LangWipe>{t(lang as Lang, "clientsTitle")}</LangWipe>
      </h1>
      <p
        className="font-mono"
        style={{
          margin: "0.3rem 0 0",
          fontSize: "var(--fs-xs)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          opacity: 0.55,
        }}
      >
        [ {filtered.length} <LangWipe>{t(lang as Lang, "clientsResultLabel")}</LangWipe> ]
      </p>
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(220px, 280px) 1fr",
        gap: 0,
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <aside
          style={{
            padding: "calc(var(--safe-top) + 1.2rem) 1rem 1rem 1.2rem",
            borderRight: "1px solid var(--border)",
            background: "var(--card-bg-solid)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {backButton}
          {headerBlock}
          <ClientFilters
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            vibeOnly={vibeOnly}
            setVibeOnly={setVibeOnly}
            search={searchInput}
            setSearch={setSearchInput}
            lang={lang as Lang}
          />
        </aside>
      )}

      <main
        style={{
          padding: isMobile
            ? "calc(var(--safe-top) + 0.75rem) calc(var(--safe-right) + 0.75rem) calc(var(--safe-bottom) + 1rem) calc(var(--safe-left) + 0.75rem)"
            : "calc(var(--safe-top) + 1.2rem) calc(var(--safe-right) + 1rem) calc(var(--safe-bottom) + 1.2rem) 1rem",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {isMobile && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "0.9rem",
              flexWrap: "wrap",
              position: "sticky",
              top: 0,
              zIndex: 5,
              paddingBottom: "0.5rem",
              background: "linear-gradient(to bottom, var(--bg) 70%, transparent)",
            }}
          >
            {backButton}
            {filtersButton}
          </div>
        )}

        {isMobile && <div style={{ marginBottom: "1rem" }}>{headerBlock}</div>}

        {filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "40vh",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-sm)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: 0.6,
              textAlign: "center",
              padding: "1rem",
            }}
          >
            <LangWipe>{t(lang as Lang, "clientsEmpty")}</LangWipe>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
              gap: "clamp(0.6rem, 1.5vw, 1rem)",
            }}
          >
            {filtered.map((c, i) => (
              <MemoCardWrapper
                key={`${c.title}-${i}`}
                client={c}
                lang={lang as Lang}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </main>

      {isMobile && drawerOpen && (
        <div
          onClick={closeDrawer}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(320px, 88vw)",
              height: "100%",
              background: "var(--bg)",
              borderRight: "1px solid var(--border)",
              padding: "calc(var(--safe-top) + 1.2rem) 1rem 1.2rem 1.2rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              animation: "slideInLeft 0.22s ease",
            }}
          >
            <button
              onClick={closeDrawer}
              style={{
                alignSelf: "flex-end",
                width: 36,
                height: 36,
                border: "1px solid var(--border)",
                borderRadius: "50%",
                background: "transparent",
                color: "var(--text)",
                cursor: "pointer",
                fontSize: "1.1rem",
                lineHeight: 1,
              }}
              aria-label="Close filters"
            >
              ×
            </button>
            <ClientFilters
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              vibeOnly={vibeOnly}
              setVibeOnly={setVibeOnly}
              search={searchInput}
              setSearch={setSearchInput}
              lang={lang as Lang}
            />
          </div>
        </div>
      )}

      {openClient && (
        <ClientModal
          client={openClient}
          lang={lang as Lang}
          onClose={handleClose}
        />
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

import { memo } from "react";

const MemoCardWrapper = memo(function MemoCardWrapper({
  client,
  lang,
  onOpen,
}: {
  client: ClientEntry;
  lang: Lang;
  onOpen: (c: ClientEntry) => void;
}) {
  const handle = useCallback(() => onOpen(client), [client, onOpen]);
  return <ClientCard client={client} lang={lang} onClick={handle} />;
});