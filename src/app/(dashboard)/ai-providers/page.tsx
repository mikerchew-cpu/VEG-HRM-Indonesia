"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { useLanguage } from "@/providers/language-provider";

interface ProviderStatus {
  id: string;
  name: string;
  models: string[];
  defaultModel: string;
  docsUrl: string;
  color: string;
  configured: boolean;
  maskedKey: string | null;
}

export default function AiProvidersPage() {
  const { t, lang } = useLanguage();
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<Record<string, { testing: boolean; connected?: boolean; error?: string }>>({});
  const [saveMsg, setSaveMsg] = useState<{ id: string; type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/ai/providers")
      .then((r) => r.json())
      .then((d) => {
        setProviders(d.providers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveKey(id: string) {
    const key = apiKeys[id]?.trim();
    if (!key) {
      setSaveMsg({ id, type: "error", text: lang === "id" ? "Masukkan API key terlebih dahulu" : "Enter an API key first" });
      return;
    }

    setSaveMsg({ id, type: "success", text: lang === "id" ? "Menyimpan..." : "Saving..." });

    try {
      const envKey = PROVIDER_MAP[id]?.envKey || id.toUpperCase() + "_API_KEY";
      const res = await fetch("/api/ai/providers/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [envKey]: key }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setSaveMsg({ id, type: "error", text: data.error || `HTTP ${res.status}` });
        return;
      }

      setProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, configured: true, maskedKey: key.slice(0, 6) + "••••" + key.slice(-4) } : p))
      );
      setApiKeys((prev) => ({ ...prev, [id]: "" }));
      setSaveMsg({
        id,
        type: "success",
        text: data.persisted?.length
          ? (lang === "id" ? "✓ Tersimpan ke Vercel. Redeploy untuk production." : "✓ Saved to Vercel. Redeploy for production.")
          : (lang === "id" ? "✓ Tersimpan (session)" : "✓ Saved (session)"),
      });
    } catch (e) {
      setSaveMsg({ id, type: "error", text: e instanceof Error ? e.message : "Network error" });
    }

    setTimeout(() => setSaveMsg(null), 5000);
  }

  async function testConnection(id: string) {
    setTestResults((prev) => ({ ...prev, [id]: { testing: true } }));

    try {
      const res = await fetch("/api/ai/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: id, apiKey: apiKeys[id] || undefined }),
      });
      const data = await res.json();

      setTestResults((prev) => ({
        ...prev,
        [id]: { testing: false, connected: data.connected, error: data.error },
      }));
    } catch {
      setTestResults((prev) => ({ ...prev, [id]: { testing: false, connected: false, error: "Request failed" } }));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--muted-fg)] text-sm">
        {lang === "id" ? "Memuat..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">AI Providers</h1>
        <p className="text-sm text-[var(--muted-fg)] mt-0.5">
          {lang === "id"
            ? "Kelola koneksi AI untuk analisis & rekomendasi HR"
            : "Manage AI connections for HR analysis & recommendations"}
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {providers.map((p) => (
          <div key={p.id} className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-3 text-center">
            <div className={`w-3 h-3 rounded-full mx-auto mb-1.5 ${p.configured ? "bg-tiffany" : "bg-gray-300"}`} />
            <p className="text-xs font-medium text-[var(--foreground)] truncate">{p.name}</p>
            <p className="text-[10px] text-[var(--muted-fg)]">{p.configured ? (lang === "id" ? "Terhubung" : "Connected") : (lang === "id" ? "Belum" : "Not set")}</p>
          </div>
        ))}
      </div>

      {/* Provider cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {providers.map((p) => {
          const test = testResults[p.id];
          return (
            <Card key={p.id} className="p-0 overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: p.color }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[var(--foreground)]">{p.name}</h2>
                      <p className="text-xs text-[var(--muted-fg)]">{p.defaultModel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Status indicator */}
                    {test?.testing ? (
                      <span className="text-xs text-[var(--muted-fg)]">{lang === "id" ? "Menguji..." : "Testing..."}</span>
                    ) : test?.connected ? (
                      <span className="flex items-center gap-1 text-xs text-tiffany font-medium">
                        <span className="w-2 h-2 rounded-full bg-tiffany animate-pulse" />
                        {lang === "id" ? "Terhubung" : "Connected"}
                      </span>
                    ) : p.configured ? (
                      <span className="flex items-center gap-1 text-xs text-[var(--muted-fg)]">
                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                        {lang === "id" ? "Belum diuji" : "Untested"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                        {lang === "id" ? "Belum diset" : "Not configured"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Models */}
                <div>
                  <label className="text-xs font-medium text-[var(--muted-fg)] mb-1 block">
                    {lang === "id" ? "Model tersedia" : "Available models"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {p.models.map((m) => (
                      <span key={m} className="px-2 py-1 bg-[var(--muted)] text-[var(--muted-fg)] rounded text-[10px] font-mono">
                        {m}
                      </span>
                    ))}
                    <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-tiffany hover:underline ml-1 self-center">
                      {lang === "id" ? "Daftar model →" : "View all →"}
                    </a>
                  </div>
                </div>

                {/* API Key input */}
                <div>
                  <label className="text-xs font-medium text-[var(--muted-fg)] mb-1 block">
                    {lang === "id" ? "API Key" : "API Key"}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <PasswordInput
                        id={`key-${p.id}`}
                        value={apiKeys[p.id] ?? ""}
                        onChange={(v) => setApiKeys((prev) => ({ ...prev, [p.id]: v }))}
                        placeholder={p.maskedKey || (lang === "id" ? "Masukkan API key..." : "Enter API key...")}
                      />
                    </div>
                    <button
                      onClick={() => saveKey(p.id)}
                      disabled={!apiKeys[p.id]}
                      className="px-3 py-2 bg-[var(--muted)] text-[var(--foreground)] text-sm rounded-lg hover:bg-[var(--card-border)] disabled:opacity-40 transition-colors"
                    >
                      {lang === "id" ? "Simpan" : "Save"}
                    </button>
                  </div>
                  <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-tiffany hover:underline mt-1 inline-block">
                    {lang === "id" ? "Dapatkan API key →" : "Get API key →"}
                  </a>
                </div>

                {/* Save status */}
                {saveMsg?.id === p.id && (
                  <div className={`text-xs px-3 py-2 rounded-lg ${
                    saveMsg.type === "success"
                      ? "bg-tiffany-light text-tiffany-dark"
                      : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                  }`}>
                    {saveMsg.text}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => testConnection(p.id)}
                    disabled={!p.configured && !apiKeys[p.id]}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                      test?.connected
                        ? "bg-tiffany-light text-tiffany-dark dark:bg-tiffany-dark/20"
                        : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--card-border)]"
                    } disabled:opacity-40`}
                  >
                    {test?.testing ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {test?.testing
                      ? (lang === "id" ? "Menguji..." : "Testing...")
                      : (lang === "id" ? "Uji Koneksi" : "Test Connection")}
                  </button>

                  {test?.error && !test.connected && (
                    <span className="text-xs text-danger">{test.error}</span>
                  )}
                  {test?.connected && (
                    <span className="text-xs text-tiffany">✓ {lang === "id" ? "Koneksi berhasil" : "Connected"}</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
        <p className="text-xs text-yellow-700 dark:text-yellow-400">
          {lang === "id"
            ? "API key disimpan di environment variables Vercel. Untuk production, redeploy diperlukan agar perubahan berlaku. Untuk development lokal, tambahkan ke file .env.local."
            : "API keys are stored in Vercel environment variables. For production, redeploy is required. For local dev, add to your .env.local file."}
        </p>
      </div>
    </div>
  );
}

const PROVIDER_MAP: Record<string, { envKey: string }> = {
  deepseek: { envKey: "DEEPSEEK_API_KEY" },
  claude: { envKey: "ANTHROPIC_API_KEY" },
  gemini: { envKey: "GEMINI_API_KEY" },
  qwen: { envKey: "QWEN_API_KEY" },
  custom: { envKey: "CUSTOM_AI_ENDPOINT" },
};
