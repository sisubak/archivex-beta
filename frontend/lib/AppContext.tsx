"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, LANGS } from "./i18n";
import { getCookie, setCookie } from "./cookies";

export type Theme = "dark" | "light";

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  glass: boolean;
  setGlass: (v: boolean) => void;
  navigateTo: (sectionId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const VALID_LANGS = LANGS.map((l) => l.code) as Lang[];
const isValidLang = (v: unknown): v is Lang =>
  typeof v === "string" && (VALID_LANGS as string[]).includes(v);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  const [glass, setGlassState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("archivex.glass");
    return saved === null ? true : saved === "1";
  });

  useEffect(() => {
    const savedTheme = getCookie("theme") as Theme | null;
    const savedLang = getCookie("lang");
    if (savedTheme === "dark" || savedTheme === "light") setThemeState(savedTheme);
    if (isValidLang(savedLang)) setLangState(savedLang);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-glass", glass ? "on" : "off");
  }, [glass]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    setCookie("theme", t);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    setCookie("lang", l);
  };

  const setGlass = (v: boolean) => {
    setGlassState(v);
    if (typeof window !== "undefined") {
      localStorage.setItem("archivex.glass", v ? "1" : "0");
    }
  };

  const navigateTo = (sectionId: string) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("archivex:navigate", { detail: { id: sectionId } })
    );
  };

  return (
    <AppContext.Provider
      value={{ theme, lang, setTheme, setLang, glass, setGlass, navigateTo }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("niga useApp must be used within AppProvider");
  return ctx;
}