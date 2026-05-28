"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

const REPORT_TYPES = [
  { id: "payroll-anomaly", label: "Payroll Anomaly Report", desc: "Detects unusual patterns, miscalculations, outliers", provider: "DeepSeek" },
  { id: "turnover-risk", label: "Turnover Risk Analysis", desc: "Predicts flight-risk employees, recommends retention", provider: "Claude" },
  { id: "compliance-check", label: "Compliance Health Check", desc: "Scans BPJS, PPh 21, PKWT expiry, mining cert gaps", provider: "DeepSeek" },
  { id: "workforce-cost", label: "Workforce Cost Optimization", desc: "Labor cost per site, OT spend, contractor vs permanent", provider: "DeepSeek" },
  { id: "safety-trend", label: "Safety Incident Trend Report", desc: "Incident patterns, root causes, interventions", provider: "Gemini + Claude" },
  { id: "shift-efficiency", label: "Shift Efficiency Analysis", desc: "Roster patterns, fatigue risk, overtime distribution", provider: "DeepSeek" },
  { id: "performance", label: "Employee Performance Summary", desc: "KPI, attendance, training data into narrative review", provider: "Claude" },
  { id: "site-productivity", label: "Site Productivity Analysis", desc: "Headcount, attendance, production output", provider: "DeepSeek" },
  { id: "cert-gap", label: "Certification & Training Gap", desc: "Expired/expiring certs, recommends training plan", provider: "DeepSeek" },
  { id: "manpower-forecast", label: "Manpower Planning Forecast", desc: "Hiring needs based on turnover, production targets", provider: "DeepSeek + Claude" },
  { id: "regulatory-impact", label: "Regulatory Change Impact", desc: "New regulations, assesses company impact", provider: "Gemini" },
];

const MOCK_REPORTS = [
  {
    id: 1, type: "Payroll Anomaly Report", period: "May 2026",
    summary: "3 anomalies detected: Site B OT cost 40% above budget, 12 workers missing BPJS contributions (2 months), OT cap exceeded for 8 operators",
    provider: "DeepSeek", date: "28 May 2026", status: "ready",
  },
  {
    id: 2, type: "Compliance Health Check", period: "May 2026",
    summary: "4 issues found: 2 PKWT contracts nearing 5-year limit, 5 SIO certs expiring within 6 months, 12 workers overdue for MCU, 1 BPJS reporting gap",
    provider: "DeepSeek", date: "27 May 2026", status: "ready",
  },
  {
    id: 3, type: "Safety Incident Trend", period: "Q2 2026",
    summary: "Near misses up 25% QoQ. Recommends refresher safety training at Site B. Common root cause: hauling road conditions.",
    provider: "Gemini", date: "26 May 2026", status: "ready",
  },
];

const AI_PROVIDERS = [
  { id: "deepseek", name: "DeepSeek", model: "deepseek-chat", color: "bg-blue-500", available: true },
  { id: "claude", name: "Claude", model: "claude-sonnet-4", color: "bg-orange-500", available: true },
  { id: "gemini", name: "Gemini", model: "gemini-2.5-flash", color: "bg-purple-500", available: true },
  { id: "custom", name: "Custom (Ollama)", model: "llama3", color: "bg-gray-500", available: false },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"reports" | "generate" | "settings">("reports");
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES[0].id);
  const [selectedProvider, setSelectedProvider] = useState("deepseek");
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const report = REPORT_TYPES.find((r) => r.id === selectedReport);
      setGeneratedReport(
        `✅ ${report?.label} (${report?.provider}) berhasil digenerate.\n\nPeriode: Mei 2026\nAI Model: ${AI_PROVIDERS.find((p) => p.id === selectedProvider)?.name} (${AI_PROVIDERS.find((p) => p.id === selectedProvider)?.model})\nWaktu: ~32 detik\nToken: ~2,450\n\nRingkasan:\nTidak ada anomali signifikan ditemukan pada periode ini. BPJS compliance 100%, payroll variance dalam batas wajar (2.3%). Direkomendasikan monitoring berkala pada Site B untuk overtime cost.`
      );
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">Laporan AI</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Analisis otomatis & rekomendasi — didukung DeepSeek, Claude, dan Gemini
        </p>
      </div>

      {/* AI Provider Status */}
      <div className="flex gap-3">
        {AI_PROVIDERS.map((p) => (
          <div key={p.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <div className={`w-2.5 h-2.5 rounded-full ${p.available ? "bg-tiffany" : "bg-gray-300"}`} />
            <span className="text-xs font-medium text-gray-700">{p.name}</span>
            <span className="text-[10px] text-gray-400">{p.model}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "reports" as const, label: "Laporan Tersimpan" },
          { id: "generate" as const, label: "Generate Baru" },
          { id: "settings" as const, label: "Pengaturan AI" },
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

      {/* Saved Reports */}
      {activeTab === "reports" && (
        <div className="space-y-3">
          {MOCK_REPORTS.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-charcoal">{r.type}</h3>
                  <p className="text-xs text-gray-400">{r.period} · {r.date}</p>
                </div>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                  {r.provider}
                </span>
              </div>
              <p className="text-xs text-gray-600">{r.summary}</p>
              <div className="mt-2 flex gap-2">
                <button className="text-xs text-tiffany hover:text-tiffany-dark font-medium">Lihat Detail</button>
                <button className="text-xs text-gray-400 hover:text-gray-600">Export PDF</button>
                <button className="text-xs text-gray-400 hover:text-gray-600">Regenerate dgn Claude</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate New */}
      {activeTab === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-4">Konfigurasi Report</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Jenis Laporan</label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tiffany"
                >
                  {REPORT_TYPES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {REPORT_TYPES.find((r) => r.id === selectedReport)?.desc}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Periode</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tiffany">
                  <option>Mei 2026</option>
                  <option>April 2026</option>
                  <option>Maret 2026</option>
                  <option>Q2 2026</option>
                  <option>Q1 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">AI Model</label>
                <div className="grid grid-cols-2 gap-2">
                  {AI_PROVIDERS.filter((p) => p.available).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProvider(p.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedProvider === p.id
                          ? "border-tiffany bg-tiffany-light"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.color}`} />
                        <span className="text-sm font-medium text-charcoal">{p.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{p.model}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-2.5 bg-tiffany text-white text-sm font-medium rounded-lg hover:bg-tiffany-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating dengan {AI_PROVIDERS.find((p) => p.id === selectedProvider)?.name}...
                  </>
                ) : (
                  "Generate Report"
                )}
              </button>
            </div>
          </Card>

          {/* Report output */}
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-4">Hasil Report</h2>
            {generatedReport ? (
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {generatedReport}
              </pre>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-sm">Pilih jenis laporan dan klik Generate</p>
                <p className="text-xs mt-1">Report akan muncul di sini</p>
              </div>
            )}
            {generatedReport && (
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 bg-tiffany text-white text-xs rounded-lg hover:bg-tiffany-dark">
                  Export PDF
                </button>
                <button className="px-3 py-1.5 border border-gray-200 text-xs rounded-lg hover:bg-gray-50">
                  Regenerate dengan Claude
                </button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* AI Settings */}
      {activeTab === "settings" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Pengaturan AI Provider</h2>
          <div className="space-y-4">
            {AI_PROVIDERS.map((p) => (
              <div key={p.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${p.color}`} />
                    <span className="text-sm font-medium text-charcoal">{p.name}</span>
                    <span className="text-xs text-gray-400">{p.model}</span>
                  </div>
                  {p.available ? (
                    <span className="text-xs text-tiffany font-medium">✓ Connected</span>
                  ) : (
                    <span className="text-xs text-gray-400">Not configured</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder={p.available ? "API Key: ••••••••••" : "API Key..."}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-tiffany"
                    readOnly={p.available}
                    value={p.available ? "sk-" + p.id + "-••••••••••" : ""}
                  />
                  <button className="px-3 py-1.5 bg-tiffany text-white text-xs rounded-lg">Test</button>
                </div>
              </div>
            ))}

            {!AI_PROVIDERS.find((p) => p.id === "custom")?.available && (
              <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-sm font-medium text-charcoal">Custom (Ollama/Local)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Endpoint: http://192.168.x.x:11434"
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    className="w-32 px-3 py-1.5 border border-gray-200 rounded text-xs"
                  />
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    Gunakan Ollama untuk deployment on-premise di site yang tidak memiliki akses internet.
                    Option ini mendukung air-gapped environment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
