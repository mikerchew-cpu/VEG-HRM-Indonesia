"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/providers/language-provider";
import { useTheme } from "@/providers/theme-provider";

export function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();

  async function handleSignOut() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const themeIcon = theme === "dark" ? "🌙" : theme === "system" ? "💻" : "☀️";

  return (
    <header className="h-14 bg-[var(--card)] border-b border-[var(--header-border)] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-tiffany" />
        <span className="text-sm text-[var(--muted-fg)]">
          {new Date().toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Language toggle */}
        <div className="relative">
          <button
            onClick={() => { setShowLang(!showLang); setShowTheme(false); }}
            className="px-2.5 py-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors text-sm text-[var(--muted-fg)]"
            title={t("language.en")}
          >
            {lang === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
          </button>
          {showLang && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowLang(false)} />
              <div className="absolute right-0 mt-1 w-36 bg-[var(--card)] border border-[var(--card-border)] rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={() => { setLang("id"); setShowLang(false); }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${lang === "id" ? "text-tiffany font-medium" : "text-[var(--foreground)]"}`}
                >
                  🇮🇩 Indonesia
                </button>
                <button
                  onClick={() => { setLang("en"); setShowLang(false); }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${lang === "en" ? "text-tiffany font-medium" : "text-[var(--foreground)]"}`}
                >
                  🇬🇧 English
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <div className="relative">
          <button
            onClick={() => { setShowTheme(!showTheme); setShowLang(false); }}
            className="px-2.5 py-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors text-sm"
            title={t("theme.dark")}
          >
            {themeIcon}
          </button>
          {showTheme && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTheme(false)} />
              <div className="absolute right-0 mt-1 w-36 bg-[var(--card)] border border-[var(--card-border)] rounded-lg shadow-lg z-20 py-1">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setShowTheme(false); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === t ? "text-tiffany font-medium" : "text-[var(--foreground)]"}`}
                  >
                    <span>{t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}</span>
                    {t === "light" ? t("theme.light") : t === "dark" ? t("theme.dark") : t("theme.system")}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setShowMenu(!showMenu); setShowLang(false); setShowTheme(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <div className="w-7 h-7 bg-tiffany-light rounded-full flex items-center justify-center dark:bg-tiffany-dark/30">
              <span className="text-xs font-medium text-tiffany-dark">A</span>
            </div>
            <span className="text-sm text-[var(--foreground)] hidden sm:inline">Admin</span>
            <svg className="w-4 h-4 text-[var(--muted-fg)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-[var(--card)] border border-[var(--card-border)] rounded-lg shadow-lg z-20 py-1">
                <div className="px-4 py-2 border-b border-[var(--card-border)]">
                  <p className="text-sm font-medium text-[var(--foreground)]">Admin</p>
                  <p className="text-xs text-[var(--muted-fg)]">admin@veg-hrm.com</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2"
                >
                  {loggingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("header.signingout")}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t("header.signout")}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
