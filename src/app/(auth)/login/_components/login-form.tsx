"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, setLang, lang } = useLanguage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error === "Invalid login credentials"
          ? t("login.error.invalid")
          : data.error || t("login.error.connection"));
        setLoading(false);
        return;
      }

      router.push(searchParams.get("redirect") || "/");
      router.refresh();
    } catch {
      setError(t("login.error.connection"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex justify-end gap-1 mb-2">
        <button
          type="button"
          onClick={() => setLang("id")}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            lang === "id"
              ? "bg-tiffany text-white"
              : "text-[var(--muted-fg)] hover:bg-[var(--muted)]"
          }`}
        >
          🇮🇩 Indonesia
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            lang === "en"
              ? "bg-tiffany text-white"
              : "text-[var(--muted-fg)] hover:bg-[var(--muted)]"
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{t("login.title")}</h2>
        <p className="text-sm text-[var(--muted-fg)] mt-1">{t("login.subtitle")}</p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          {lang === "id" ? "Email atau No. Telepon" : "Email or Phone Number"}
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="w-full px-4 py-2.5 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent
                     placeholder:text-[var(--muted-fg)]"
          placeholder={lang === "id" ? "admin@perusahaan.com atau 08123456789" : "admin@company.com or 08123456789"}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          {t("login.password")}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-2.5 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)] focus:border-transparent
                     placeholder:text-[var(--muted-fg)]"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="text-sm text-danger bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-tiffany text-white font-medium rounded-lg text-sm
                   hover:bg-tiffany-dark transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("login.processing")}
          </>
        ) : (
          t("login.signin")
        )}
      </button>
    </form>
  );
}
