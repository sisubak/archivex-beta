"use client";

import Image from "next/image";
import { useApp } from "@/lib/AppContext";
import { t, type DictKey } from "@/lib/i18n";
import LangWipe from "./LangWipe";

interface BioMeta {
nameKey: DictKey;
messageKey: DictKey;
avatar: string;
languages: string[];
discord?: string;
}

const BIOS: Record<"mister" | "luna" | "vafla", BioMeta> = {
mister: {
  nameKey: "bioMister",
  messageKey: "bioMisterMessage",
  avatar: "/avatars/mister.png",
  languages: [
    "Go", "Python", "Lua", "JavaScript", "Node.js",
    "Next.js", "Rust", "C++", "C#", "C", "Java", "TypeScript",
  ],
},
luna: {
  nameKey: "bioLuna",
  messageKey: "bioLunaMessage",
  avatar: "/avatars/luna.png",
  languages: ["Node.js", "JavaScript"],
  discord: "https://discord.gg/5zHqF8HW",
},
vafla: {
  nameKey: "bioVafla",
  messageKey: "bioVaflaMessage",
  avatar: "/avatars/vafla.png",
  languages: ["JavaScript", "Node.js"],
},
};

const LANG_ICON_MAP: Record<string, string> = {
"Go": "go",
"Python": "python",
"Lua": "lua",
"JavaScript": "js",
"Node.js": "nodejs",
"Next.js": "nextjs",
"Rust": "rust",
"C++": "cpp",
"C#": "csharp",
"C": "c",
"Java": "java",
"TypeScript": "typescript",
};

function DiscordIcon() {
return (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M18.942 5.556a16.299 16.299 0 0 0-4.126-1.297c-.178.321-.385.754-.529 1.097a15.175 15.175 0 0 0-4.573 0 11.583 11.583 0 0 0-.535-1.097 16.274 16.274 0 0 0-4.129 1.3c-2.611 3.946-3.319 7.794-2.965 11.587a16.494 16.494 0 0 0 5.061 2.593 12.65 12.65 0 0 0 1.084-1.785 10.689 10.689 0 0 1-1.707-.831c.143-.106.283-.217.418-.331 3.291 1.539 6.866 1.539 10.118 0 .137.114.277.225.418.331-.541.326-1.114.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595c.415-4.396-.709-8.209-2.973-11.589zM8.678 14.813c-.988 0-1.798-.922-1.798-2.045s.793-2.047 1.798-2.047 1.815.922 1.798 2.047c.001 1.123-.793 2.045-1.798 2.045zm6.644 0c-.988 0-1.798-.922-1.798-2.045s.793-2.047 1.798-2.047 1.815.922 1.798 2.047c0 1.123-.793 2.045-1.798 2.045z" />
  </svg>
);
}

interface Props {
coderId: "mister" | "luna" | "vafla";
}

export default function BioContent({ coderId }: Props) {
const { lang } = useApp();
const bio = BIOS[coderId];
if (!bio) return null;

const name = t(lang, bio.nameKey);
const message = t(lang, bio.messageKey);
const hasMessage = message && message !== bio.messageKey;

return (
  <div className="bio-wrap">
    <div className="bio-hud-top">
      <span className="hud-tag">// CODER_PROFILE</span>
      <span className="hud-id">ID_{coderId.toUpperCase()}</span>
    </div>

    <div className="bio-header">
      <div className="bio-avatar">
        <Image
          src={bio.avatar}
          alt={name}
          width={140}
          height={140}
          unoptimized
        />
        <span className="bio-avatar-corner" />
      </div>
      <div className="bio-title">
        <div className="bio-name">
          <LangWipe>{name}</LangWipe>
        </div>
        <div className="bio-role">
          <LangWipe>{t(lang, "bioRoleLabel")}</LangWipe>
        </div>
      </div>
    </div>

    <div className="bio-divider" />

    {hasMessage && (
      <section className="bio-section">
        <div className="bio-section-title">
          <span className="bio-section-bullet">▸</span>
          <LangWipe>{t(lang, "bioAboutLabel")}</LangWipe>
        </div>
        <div className="bio-message">
          <LangWipe>{message}</LangWipe>
        </div>
      </section>
    )}

    {bio.languages.length > 0 && (
      <section className="bio-section">
        <div className="bio-section-title">
          <span className="bio-section-bullet">▸</span>
          <LangWipe>{t(lang, "bioLanguagesLabel")}</LangWipe>
          <span className="bio-section-count">[{bio.languages.length}]</span>
        </div>
        <div className="bio-langs">
          {bio.languages.map((l) => {
            const icon = LANG_ICON_MAP[l];
            return (
              <span key={l} className="bio-lang-chip">
                {icon && (
                  <img
                    src={`/icons/langs/${icon}.svg`}
                    alt=""
                    className="bio-lang-icon"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <span>{l}</span>
              </span>
            );
          })}
        </div>
      </section>
    )}

    {bio.discord && (
      <section className="bio-section">
        <div className="bio-section-title">
          <span className="bio-section-bullet">▸</span>
          <LangWipe>{t(lang, "bioLinksLabel")}</LangWipe>
        </div>
        <div className="bio-links">
          <a
            href={bio.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="bio-link"
          >
            <DiscordIcon />
            <span>Discord</span>
          </a>
        </div>
      </section>
    )}

    <div className="bio-hud-bottom">
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
    </div>

    <style jsx>{`
      .bio-wrap {
        width: 100%;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: clamp(14px, 1.2vw + 10px, 22px);
        color: var(--text);
        font-family: var(--font-ui), -apple-system, sans-serif;
      }
      .bio-hud-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        font-size: clamp(9px, 0.55vw + 7px, 11px);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        opacity: 0.55;
        font-family: var(--font-mono, ui-monospace, monospace);
      }
      .hud-tag { color: var(--text-muted, var(--text)); }
      .hud-id { color: var(--text-muted, var(--text)); }
      .bio-header {
        display: flex;
        align-items: center;
        gap: clamp(14px, 1.6vw + 8px, 22px);
      }
      .bio-avatar {
        width: clamp(86px, 18vw + 30px, 140px);
        height: clamp(86px, 18vw + 30px, 140px);
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--text);
        flex-shrink: 0;
        background: var(--bg);
        position: relative;
      }
      .bio-avatar :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .bio-avatar-corner {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 14px;
        height: 14px;
        border-top: 2px solid var(--text);
        border-right: 2px solid var(--text);
      }
      .bio-title {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        flex: 1;
      }
      .bio-name {
        font-size: clamp(18px, 2.4vw + 10px, 30px);
        font-weight: 700;
        letter-spacing: 0.01em;
        line-height: 1.1;
        word-break: break-word;
      }
      .bio-role {
        font-size: clamp(10px, 0.6vw + 8px, 12px);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        opacity: 0.55;
        font-family: var(--font-mono, ui-monospace, monospace);
      }
      .bio-divider {
        height: 1px;
        background: var(--text);
        opacity: 0.25;
      }
      .bio-section {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 0.8vw + 4px, 12px);
      }
      .bio-section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: clamp(10px, 0.6vw + 8px, 12px);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        opacity: 0.65;
        font-family: var(--font-mono, ui-monospace, monospace);
      }
      .bio-section-bullet {
        opacity: 0.5;
      }
      .bio-section-count {
        margin-left: auto;
        opacity: 0.4;
        font-size: clamp(9px, 0.5vw + 7px, 11px);
      }
      .bio-message {
        font-size: clamp(12.5px, 0.7vw + 11px, 14.5px);
        line-height: 1.65;
        white-space: pre-wrap;
        padding-left: 14px;
        border-left: 1px solid var(--text);
        opacity: 0.85;
      }
      .bio-langs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .bio-lang-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border: 1px solid var(--text);
        border-radius: 999px;
        font-size: clamp(11px, 0.5vw + 9.5px, 13px);
        font-weight: 500;
        font-family: var(--font-mono, ui-monospace, monospace);
        transition: background 0.15s, color 0.15s;
        min-height: 32px;
      }
      @media (hover: hover) {
        .bio-lang-chip:hover {
          background: var(--text);
          color: var(--bg);
        }
        .bio-lang-chip:hover .bio-lang-icon {
          filter: invert(1);
        }
      }
      .bio-lang-icon {
        width: 16px;
        height: 16px;
        object-fit: contain;
        display: block;
      }
      .bio-links {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .bio-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border: 1px solid var(--text);
        border-radius: 8px;
        font-size: clamp(11px, 0.5vw + 9.5px, 13px);
        font-weight: 500;
        color: var(--text);
        text-decoration: none;
        font-family: var(--font-mono, ui-monospace, monospace);
        transition: background 0.15s, color 0.15s;
        min-height: 44px;
      }
      @media (hover: hover) {
        .bio-link:hover {
          background: var(--text);
          color: var(--bg);
        }
      }
      .bio-link:active {
        background: var(--text);
        color: var(--bg);
      }
      .bio-hud-bottom {
        margin-top: auto;
        height: 16px;
        position: relative;
      }
      .hud-corner {
        position: absolute;
        bottom: 0;
        width: 14px;
        height: 14px;
      }
      .hud-corner-bl {
        left: 0;
        border-bottom: 2px solid var(--text);
        border-left: 2px solid var(--text);
      }
      .hud-corner-br {
        right: 0;
        border-bottom: 2px solid var(--text);
        border-right: 2px solid var(--text);
      }
      @media (max-width: 480px) {
        .bio-header {
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .bio-avatar {
          width: clamp(76px, 28vw, 110px);
          height: clamp(76px, 28vw, 110px);
        }
        .bio-name {
          font-size: clamp(18px, 5vw + 4px, 24px);
        }
      }
    `}</style>
  </div>
);
}