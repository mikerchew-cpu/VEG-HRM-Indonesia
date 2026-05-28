"use client";

import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";
import { useLanguage } from "@/providers/language-provider";

export default function LoginPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-tiffany flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("login.brand.title")}</h1>
          <p className="text-tiffany-light mt-1 text-sm">{t("login.brand.subtitle")}</p>
        </div>
        <blockquote className="max-w-md">
          <p className="text-lg leading-relaxed text-white/90 italic">
            &ldquo;{t("login.brand.quote")}&rdquo;
          </p>
          <footer className="mt-3 text-sm text-white/60">— VEG HRM Indonesia</footer>
        </blockquote>
        <div className="text-sm text-white/50">
          &copy; {new Date().getFullYear()} VEG HRM Indonesia
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-white dark:bg-[var(--background)]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">{t("login.brand.title")}</h1>
            <p className="text-[var(--muted-fg)] text-sm mt-1">{t("login.brand.subtitle")}</p>
          </div>

          {/* Language switcher on login */}
          <div className="flex justify-end mb-4 gap-1">
            <button
              onClick={() => {}} // handled by provider
              className={`text-xs px-2 py-1 rounded ${lang === "id" ? "bg-tiffany text-white" : "text-gray-400"}`}
            >
              🇮🇩 ID
            </button>
            <button
              onClick={() => {}}
              className={`text-xs px-2 py-1 rounded ${lang === "en" ? "bg-tiffany text-white" : "text-gray-400"}`}
            >
              🇬🇧 EN
            </button>
          </div>

          <Suspense fallback={<div className="text-center text-sm text-gray-400 py-8">{t("common.loading")}</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
