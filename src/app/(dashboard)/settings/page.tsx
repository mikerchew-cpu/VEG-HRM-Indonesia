"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { UMP_2025 } from "@/lib/constants/compliance";

const COMPANY = {
  name: "PT Tambang Indonesia",
  slug: "pt-tambang-indonesia",
  address: "Jl. Mineral No. 99, Jakarta Selatan",
  phone: "(021) 1234-5678",
  email: "admin@tambangindonesia.com",
  npwp: "01.234.567.8-012.000",
  bpjsPerusahaan: "BPJS-2020-12345",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"company" | "ump" | "users" | "ai" | "password">("company");
  const [pwData, setPwData] = useState({ current: "", newPass: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);
  const [aiKeys, setAiKeys] = useState({
    deepseek: "",
    claude: "",
    gemini: "",
    custom: "",
  });
  const [aiSaving, setAiSaving] = useState(false);
  const [aiSaved, setAiSaved] = useState(false);

  async function handleAiSave() {
    setAiSaving(true);
    setAiSaved(false);
    try {
      const res = await fetch("/api/ai/providers/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          DEEPSEEK_API_KEY: aiKeys.deepseek,
          ANTHROPIC_API_KEY: aiKeys.claude,
          GEMINI_API_KEY: aiKeys.gemini,
          CUSTOM_AI_ENDPOINT: aiKeys.custom,
        }),
      });
      if (res.ok) setAiSaved(true);
    } catch {
      // fallback
    }
    setAiSaving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Profil perusahaan, referensi UMP/UMR, dan manajemen pengguna
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "company" as const, label: "Profil Perusahaan" },
          { id: "ump" as const, label: "Referensi UMP/UMR" },
          { id: "users" as const, label: "Pengguna" },
          { id: "password" as const, label: "Ubah Password" },
          { id: "ai" as const, label: "AI Providers" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === t.id
                ? "bg-tiffany text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "company" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Data Perusahaan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nama Perusahaan</label>
              <input
                defaultValue={COMPANY.name}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
              <input
                defaultValue={COMPANY.slug}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Alamat</label>
              <input
                defaultValue={COMPANY.address}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Telepon</label>
              <input
                defaultValue={COMPANY.phone}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                defaultValue={COMPANY.email}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">NPWP Perusahaan</label>
              <input
                defaultValue={COMPANY.npwp}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">No. BPJS Perusahaan</label>
              <input
                defaultValue={COMPANY.bpjsPerusahaan}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-tiffany text-white text-sm rounded-lg hover:bg-tiffany-dark">
              Simpan
            </button>
          </div>
        </Card>
      )}

      {activeTab === "ump" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-1">Upah Minimum Provinsi (UMP) 2025</h2>
          <p className="text-xs text-gray-500 mb-4">PP 36/2021 — digunakan untuk referensi perhitungan upah</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Provinsi</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">UMP 2025</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Estimasi UMK Tambang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(UMP_2025).map(([prov, amount]) => (
                <tr key={prov}>
                  <td className="px-3 py-2 text-sm text-charcoal">{prov}</td>
                  <td className="px-3 py-2 text-right text-sm font-medium">
                    Rp {amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-gray-500">
                    Rp {Math.round(amount * 1.15).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              UMK (Upah Minimum Kabupaten/Kota) untuk sektor pertambangan umumnya 10-20% di atas UMP.
              Data ini perlu diperbarui setiap tahun setelah pengumuman resmi dari Kemnaker.
            </p>
          </div>
        </Card>
      )}

      {activeTab === "users" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Pengguna Sistem</h2>
          {[
            { name: "Admin Utama", email: "admin@tambangindonesia.com", role: "Super Admin" },
            { name: "HR Manager", email: "hr@tambangindonesia.com", role: "HR Manager" },
            { name: "Payroll Staff", email: "payroll@tambangindonesia.com", role: "Payroll" },
          ].map((u) => (
            <div key={u.email} className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm text-charcoal font-medium">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{u.role}</span>
                <button className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
              </div>
            </div>
          ))}
          <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-tiffany hover:text-tiffany transition-colors">
            + Tambah Pengguna
          </button>
        </Card>
      )}

      {activeTab === "password" && (
        <Card>
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-1">Ubah Password</h2>
          <p className="text-xs text-[var(--muted-fg)] mb-4">Password minimal 6 karakter, gunakan kombinasi huruf dan angka</p>

          {pwMsg && (
            <div className={`mb-4 p-3 rounded-lg text-xs ${
              pwMsg.type === "success"
                ? "bg-tiffany-light text-tiffany-dark"
                : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
            }`}>
              {pwMsg.text}
            </div>
          )}

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (pwData.newPass !== pwData.confirm) {
              setPwMsg({ type: "error", text: "Password baru dan konfirmasi tidak cocok" });
              return;
            }
            if (pwData.newPass.length < 6) {
              setPwMsg({ type: "error", text: "Password minimal 6 karakter" });
              return;
            }
            setPwLoading(true);
            setPwMsg(null);
            try {
              const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: pwData.current, newPassword: pwData.newPass }),
              });
              const data = await res.json();
              if (res.ok) {
                setPwMsg({ type: "success", text: "✓ Password berhasil diubah!" });
                setPwData({ current: "", newPass: "", confirm: "" });
              } else {
                setPwMsg({ type: "error", text: data.error || "Gagal mengubah password" });
              }
            } catch {
              setPwMsg({ type: "error", text: "Gagal terhubung ke server" });
            }
            setPwLoading(false);
          }} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-fg)] mb-1">Password Saat Ini</label>
              <input
                type="password"
                value={pwData.current}
                onChange={(e) => setPwData((p) => ({ ...p, current: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-fg)] mb-1">Password Baru</label>
              <input
                type="password"
                value={pwData.newPass}
                onChange={(e) => setPwData((p) => ({ ...p, newPass: e.target.value }))}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-fg)] mb-1">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={pwData.confirm}
                onChange={(e) => setPwData((p) => ({ ...p, confirm: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="px-4 py-2 bg-tiffany text-white text-sm rounded-lg hover:bg-tiffany-dark disabled:opacity-50"
            >
              {pwLoading ? "Menyimpan..." : "Ubah Password"}
            </button>
          </form>
        </Card>
      )}

      {activeTab === "ai" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-1">AI Provider Configuration</h2>
          <p className="text-xs text-gray-500 mb-4">
            Masukkan API key untuk mengaktifkan AI analysis & recommendation engine
          </p>

          <div className="space-y-4">
            {[
              { key: "deepseek", label: "DeepSeek", envKey: "DEEPSEEK_API_KEY", placeholder: "sk-...", doc: "https://platform.deepseek.com/api_keys" },
              { key: "claude", label: "Claude (Anthropic)", envKey: "ANTHROPIC_API_KEY", placeholder: "sk-ant-...", doc: "https://console.anthropic.com/settings/keys" },
              { key: "gemini", label: "Gemini (Google)", envKey: "GEMINI_API_KEY", placeholder: "AIza...", doc: "https://aistudio.google.com/app/apikey" },
              { key: "custom", label: "Custom / Ollama (Local)", envKey: "CUSTOM_AI_ENDPOINT", placeholder: "http://192.168.x.x:11434", doc: "https://ollama.ai" },
            ].map((p) => (
              <div key={p.key} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-charcoal">{p.label}</span>
                    <a href={p.doc} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-tiffany hover:underline">
                      Get API Key
                    </a>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    aiKeys[p.key as keyof typeof aiKeys] ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"
                  }`}>
                    {aiKeys[p.key as keyof typeof aiKeys] ? "Configured" : "Not set"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={aiKeys[p.key as keyof typeof aiKeys]}
                    onChange={(e) => setAiKeys((prev) => ({ ...prev, [p.key]: e.target.value }))}
                    placeholder={p.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            {aiSaved && (
              <span className="text-xs text-tiffany font-medium">✓ API keys saved to environment</span>
            )}
            <button
              onClick={handleAiSave}
              disabled={aiSaving}
              className="ml-auto px-4 py-2 bg-tiffany text-white text-sm rounded-lg hover:bg-tiffany-dark disabled:opacity-50"
            >
              {aiSaving ? "Saving..." : "Save API Keys"}
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>Note:</strong> API keys are stored as Vercel environment variables. In production,
              you must redeploy for changes to take effect. For local development, add them to your .env.local file.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
