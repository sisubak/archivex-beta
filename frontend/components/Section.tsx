"use client";

import { Section as SectionType } from "@/lib/sections";
import { useApp } from "@/lib/AppContext";
import { t, type DictKey } from "@/lib/i18n";
import ThemeToggle from "./ThemeToggle";
import LangSelector from "./LangSelector";
import GlassToggle from "./GlassToggle";
import LangWipe from "./LangWipe";
import StatusContent from "./StatusContent";
import AboutContent from "./AboutContent";
import RulesContent from "./RulesContent";
import TeamContent from "./TeamContent";
import ArchiveXLogo from "./ArchiveXLogo";
import FaqContent from "./FaqContent";
import FaqSubContent from "./FaqSubContent";
import ClientsContent from "./ClientsContent";
import BioContent from "./BioContent";

interface Props {
section: SectionType;
active: boolean;
isMoving: boolean;
moveIntensity?: number;
currentId?: string;
}

export default function Section({ section, active, isMoving }: Props) {
const blurAmount = !active && isMoving ? 3 : 0;
const kind = section.cardKind ?? "default";

const isFullBleed = kind === "faq-sub" || kind === "clients";

const wrapperStyle: React.CSSProperties = {
position: "absolute",
top: `${section.y}vh`,
left: `${section.x}vw`,
width: "100vw",
height: "100vh",
display: isFullBleed ? "block" : "flex",
alignItems: "center",
justifyContent: "center",
padding: isFullBleed
  ? 0
  : "calc(var(--safe-top) + 1rem) calc(var(--safe-right) + 1rem) calc(var(--safe-bottom) + 1rem) calc(var(--safe-left) + 1rem)",
pointerEvents: active ? "auto" : "none",
};

const isNaked =
kind === "about" ||
kind === "rules" ||
kind === "team" ||
kind === "faq-sub" ||
kind === "clients";

const cardOverflow: React.CSSProperties["overflowY"] =
kind === "menu" ? "visible" : "auto";

const glassApplied = !isNaked;

const cardStyle: React.CSSProperties = isNaked
? {
    position: "relative",
    opacity: active ? 1 : 0.4,
    filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
    transition: "opacity 0.4s ease, filter 0.35s ease",
    maxWidth: "100%",
    maxHeight: "100%",
    ...(kind === "faq-sub" || kind === "clients"
      ? { width: "100%", height: "100%" }
      : {}),
  }
: {
    position: "relative",
    padding: "var(--space-card-y) var(--space-card-x)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-card)",
    background: "var(--card-bg)",
    backdropFilter: "blur(10px)",
    textAlign: kind === "menu" ? "center" : "left",
    width:
      kind === "menu"
        ? "min(420px, 90vw)"
        : kind === "status"
          ? "min(560px, 92vw)"
          : kind === "faq"
            ? "min(480px, 90vw)"
            : kind === "bio"
              ? "min(560px, 92vw)"
              : "min(420px, 90vw)",
    maxWidth: "100%",
    maxHeight:
      kind === "menu"
        ? "none"
        : "calc(100vh - 2rem - var(--safe-top) - var(--safe-bottom))",
    overflowY: cardOverflow,
    opacity: active ? 1 : 0.4,
    filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
    transition:
      "opacity 0.4s ease, filter 0.35s ease, background var(--transition-theme), border-color var(--transition-theme)",
  };

return (
<div style={wrapperStyle} aria-hidden={!active}>
  <div
    style={cardStyle}
    data-section-card={section.id}
    data-active={active ? "true" : "false"}
    data-glass-applied={glassApplied ? "true" : "false"}
    {...(!active ? { inert: "" as unknown as boolean } : {})}
  >
    {kind === "menu" && <CenterContent />}
    {kind === "status" && <StatusContent />}
    {kind === "about" && <AboutContent />}
    {kind === "rules" && <RulesContent />}
    {kind === "team" && <TeamContent />}
    {kind === "faq" && <FaqContent />}
    {kind === "faq-sub" && <FaqSubContent sectionId={section.id} />}
    {kind === "clients" && <ClientsContent />}
    {kind === "bio" && section.bioCoderId && (
      <BioContent
        active={active}
        coderId={section.bioCoderId}
        title={section.title}
      />
    )}
    {kind === "default" && <DefaultContent id={section.id} />}
  </div>
</div>
);
}

function CenterContent() {
const { lang } = useApp();
return (
<>
  <ArchiveXLogo />

  <p
    style={{
      marginTop: "0.9rem",
      marginBottom: "1.4rem",
      fontSize: "var(--fs-sm)",
      color: "var(--text-muted)",
      lineHeight: 1.5,
    }}
  >
    <LangWipe>{t(lang, "tagline")}</LangWipe>
  </p>

  <div
    style={{
      height: 1,
      background: "var(--border)",
      margin: "0 auto 1.1rem",
      width: "70%",
      opacity: 0.7,
    }}
  />

  <div
    style={{
      display: "flex",
      gap: "clamp(0.4rem, 0.3rem + 0.4vw, 0.65rem)",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <ThemeToggle />
    <LangSelector />
    <GlassToggle />
    <span
      className="font-mono"
      style={{
        fontSize: "var(--fs-xs)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        opacity: 0.55,
        padding: "0 0.4rem",
      }}
    >
      [ <LangWipe>{t(lang, "mainMenuLabel")}</LangWipe> ]
    </span>
  </div>
</>
);
}

function titleKeyFor(id: string): DictKey {
return `section${id.charAt(0).toUpperCase() + id.slice(1)}` as DictKey;
}

function DefaultContent({ id }: { id: string }) {
const { lang } = useApp();
const translated = t(lang, titleKeyFor(id));

return (
<>
  <h1
    style={{
      fontSize: "var(--fs-h1)",
      fontWeight: 700,
      letterSpacing: "-0.025em",
      lineHeight: 1.05,
      marginBottom: "0.3rem",
    }}
  >
    <LangWipe>{translated}</LangWipe>
  </h1>
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
    [ {id} ]
  </p>
</>
);
}
