import type { AiProviderConfig, AiProvider } from "./types";

export const PROVIDER_CONFIGS: Record<AiProvider, AiProviderConfig> = {
  deepseek: {
    name: "DeepSeek",
    models: ["deepseek-chat", "deepseek-reasoner"],
    defaultModel: "deepseek-chat",
    envKey: "DEEPSEEK_API_KEY",
    baseUrl: "https://api.deepseek.com/v1",
    docsUrl: "https://platform.deepseek.com/api_keys",
    color: "#4F46E5",
  },
  claude: {
    name: "Claude",
    models: ["claude-sonnet-4-20250514", "claude-haiku-3-5-20241022"],
    defaultModel: "claude-sonnet-4-20250514",
    envKey: "ANTHROPIC_API_KEY",
    baseUrl: "https://api.anthropic.com/v1",
    docsUrl: "https://console.anthropic.com/settings/keys",
    color: "#D97706",
  },
  gemini: {
    name: "Gemini",
    models: ["gemini-2.5-flash", "gemini-2.5-pro"],
    defaultModel: "gemini-2.5-flash",
    envKey: "GEMINI_API_KEY",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    docsUrl: "https://aistudio.google.com/app/apikey",
    color: "#7C3AED",
  },
  qwen: {
    name: "Qwen",
    models: ["qwen-max", "qwen-plus", "qwen-turbo"],
    defaultModel: "qwen-max",
    envKey: "QWEN_API_KEY",
    baseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    docsUrl: "https://bailian.console.aliyun.com/",
    color: "#2563EB",
  },
  custom: {
    name: "Custom (Ollama)",
    models: ["llama3", "qwen", "mistral"],
    defaultModel: "llama3",
    envKey: "CUSTOM_AI_ENDPOINT",
    baseUrl: "http://localhost:11434",
    docsUrl: "https://ollama.ai",
    color: "#6B7280",
  },
};

export const REPORT_PROMPTS: Record<string, string> = {
  "payroll-anomaly": `Kamu adalah analis HR senior untuk perusahaan tambang di Indonesia.
Analisis data penggajian berikut dan temukan anomali, potensi kesalahan perhitungan, atau pola tidak biasa.
Berikan rekomendasi perbaikan yang spesifik dan actionable.
Gunakan bahasa Indonesia. Format: bullet points dengan temuan dan rekomendasi.`,

  "turnover-risk": `Kamu adalah konsultan HR spesialis retensi karyawan di industri tambang.
Analisis data turnover dan identifikasi karyawan yang berisiko resign.
Berikan strategi retensi yang spesifik berdasarkan data.
Gunakan bahasa Indonesia.`,

  "compliance-check": `Kamu adalah compliance officer spesialis ketenagakerjaan Indonesia.
Periksa kepatuhan terhadap: BPJS Kesehatan & Ketenagakerjaan, PPh 21 TER, PKWT limits, 
sertifikasi mining (SIO/POP/POU), MCU berkala, dan SMK3.
Berikan status (compliant/warning/critical) untuk setiap area.
Gunakan bahasa Indonesia.`,

  "workforce-cost": `Kamu adalah analis biaya HR untuk perusahaan tambang.
Analisis biaya tenaga kerja per site, per departemen, dan per kategori pekerja (PKWT/PKWTT/outsource).
Berikan rekomendasi optimalisasi biaya tanpa mengorbankan kepatuhan.
Gunakan bahasa Indonesia.`,

  "safety-trend": `Kamu adalah ahli K3 pertambangan (SMK3).
Analisis tren insiden keselamatan, identifikasi akar masalah, dan berikan rekomendasi 
pencegahan berdasarkan hierarki pengendalian risiko.
Gunakan bahasa Indonesia.`,

  "shift-efficiency": `Kamu adalah spesialis manajemen shift tambang.
Evaluasi pola rotasi shift (4-4, 7-3, 5-2, 24/7), tingkat kelelahan, dan distribusi lembur.
Berikan rekomendasi pola shift yang optimal.
Gunakan bahasa Indonesia.`,

  "performance": `Kamu adalah HR business partner untuk perusahaan tambang.
Buat ringkasan performa karyawan berdasarkan KPI, kehadiran, pelatihan, dan sertifikasi.
Soroti pencapaian dan area pengembangan.
Gunakan bahasa Indonesia.`,

  "site-productivity": `Kamu adalah analis produktivitas tambang.
Analisis hubungan antara headcount, kehadiran, dan output produksi per site.
Identifikasi site yang underperforming dan rekomendasi perbaikan.
Gunakan bahasa Indonesia.`,

  "cert-gap": `Kamu adalah spesialis pengembangan SDM tambang.
Identifikasi kesenjangan sertifikasi (SIO, POP, POU) dan pelatihan.
Buat rencana pengembangan kompetensi berdasarkan Permen ESDM 26/2018.
Gunakan bahasa Indonesia.`,

  "manpower-forecast": `Kamu adalah perencana tenaga kerja tambang.
Buat proyeksi kebutuhan SDM berdasarkan: rencana produksi, turnover historis, 
dan ekspansi site. Sertakan rekomendasi rekrutmen dan pengembangan.
Gunakan bahasa Indonesia.`,

  "regulatory-impact": `Kamu adalah konsultan hukum ketenagakerjaan spesialis mining.
Rangkum perubahan regulasi terbaru (UU, PP, Permenaker, Permen ESDM) dan 
analisis dampaknya terhadap operasional HR perusahaan tambang.
Gunakan bahasa Indonesia.`,
};
