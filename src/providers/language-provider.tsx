"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { id, type TranslationKeys } from "@/lib/i18n/id";
import { en } from "@/lib/i18n/en";

type Language = "id" | "en";
type Translations = Record<TranslationKeys, string>;

const translations: Record<Language, Translations> = { id, en };

interface LanguageCtx {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("veg-hrm-lang") as Language;
    if (saved === "en" || saved === "id") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem("veg-hrm-lang", l);
    document.documentElement.lang = l === "id" ? "id" : "en";
  }, []);

  const t = useCallback(
    (key: TranslationKeys) => translations[lang]?.[key] ?? id[key] ?? key,
    [lang]
  );

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
